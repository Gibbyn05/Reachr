import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

async function refreshGoogleToken(refreshToken: string) {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      grant_type: "refresh_token",
    }),
  });
  return res.json();
}

async function refreshMicrosoftToken(refreshToken: string) {
  const res = await fetch("https://login.microsoftonline.com/common/oauth2/v2.0/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: process.env.MICROSOFT_CLIENT_ID!,
      client_secret: process.env.MICROSOFT_CLIENT_SECRET!,
      grant_type: "refresh_token",
      scope: "https://graph.microsoft.com/Mail.Read offline_access",
    }),
  });
  return res.json();
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 401 });
  }

  const db = createServiceClient();
  try {

    const { data: connections } = await db
      .from("email_connections")
      .select("*")
      .eq("user_email", user.email);

    if (!connections || connections.length === 0) {
      return NextResponse.json({ error: "Ingen e-postkonto tilkoblet" }, { status: 400 });
    }

    // Get all leads for this user to match senders
    const { data: leads } = await db
      .from("leads")
      .select("id, email, name, meeting_date, notes")
      .eq("user_email", user.email);

    if (!leads) return NextResponse.json({ success: true, message: "Ingen leads å sjekke mot." });

    const leadEmailMap = new Map(leads.map(l => [l.email?.toLowerCase().trim(), l]));
    const monitoredEmails = Array.from(leadEmailMap.keys());

    let foundRepliesCount = 0;
    let totalUnreadMessagesSeen = 0;
    let detectedSenderEmails: string[] = [];
    let apiDiagnostics: string[] = [];
    let foundMeetingsCount = 0;

    for (const conn of connections) {
      let accessToken = conn.access_token;
      
      // Refresh token if needed
      if (conn.expires_at && new Date(conn.expires_at) < new Date()) {
        try {
          const refreshed = conn.provider === "gmail" 
            ? await refreshGoogleToken(conn.refresh_token) 
            : await refreshMicrosoftToken(conn.refresh_token);
          
          if (refreshed.access_token) {
            accessToken = refreshed.access_token;
            await db.from("email_connections").update({
              access_token: accessToken,
              expires_at: refreshed.expires_in ? new Date(Date.now() + refreshed.expires_in * 1000).toISOString() : null
            }).eq("id", conn.id);
          }
        } catch (e) {
          apiDiagnostics.push(`${conn.provider}: Token refresh failed`);
          continue;
        }
      }

      const foundConversations: { email: string, snippet: string }[] = [];

      try {
        if (conn.provider === "gmail") {
          const q = encodeURIComponent("is:unread");
          const listRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${q}&maxResults=15`, {
            headers: { Authorization: `Bearer ${accessToken}` }
          });
          
          if (listRes.ok) {
            const listData = await listRes.json();
            const messages = listData.messages || [];
            totalUnreadMessagesSeen += messages.length;
            
            for (const msg of messages) {
              const detailRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`, {
                headers: { Authorization: `Bearer ${accessToken}` }
              });
              if (detailRes.ok) {
                const detail = await detailRes.json();
                const headers = detail.payload.headers;
                const fromHeader = headers.find((h: any) => h.name.toLowerCase() === "from")?.value || "";
                const match = fromHeader.match(/<(.+)>|(\S+@\S+)/);
                const email = (match ? (match[1] || match[2]) : fromHeader).toLowerCase().trim();
                if (email) {
                  detectedSenderEmails.push(email);
                  foundConversations.push({ email, snippet: detail.snippet || "" });
                }
              }
            }
          }
        } else if (conn.provider === "outlook") {
          const listRes = await fetch(`https://graph.microsoft.com/v1.0/me/messages?$filter=isRead eq false&$top=15&$select=from,bodyPreview`, {
            headers: { Authorization: `Bearer ${accessToken}` }
          });
          if (listRes.ok) {
            const data = await listRes.json();
            const messages = data.value || [];
            totalUnreadMessagesSeen += messages.length;
            for (const msg of messages) {
              const email = msg.from?.emailAddress?.address?.toLowerCase().trim();
              if (email) {
                detectedSenderEmails.push(email);
                foundConversations.push({ email, snippet: msg.bodyPreview || "" });
              }
            }
          }
        }
      } catch (e) { console.error(e); }

      for (const conv of foundConversations) {
        const lead = leadEmailMap.get(conv.email);
        if (lead) {
          foundRepliesCount++;
          let status = "Kontaktet";
          let meetingDate = null;
          let aiReason = "";

          // Clean the snippet to remove email history/threads
          let cleanedSnippet = conv.snippet;
          const threadMarkers = [
            /\nOn\s.*\swrote:/i,
            /\sOn\s.*\swrote:/i,
            /\nDen\s.*\sskrev:/i,
            /\sDen\s.*\sskrev:/i,
            /---------- Forwarded message ---------/i,
            /From:.*@/i,
            /________________________________/
          ];
          
          for (const marker of threadMarkers) {
            const index = cleanedSnippet.search(marker);
            if (index !== -1) {
              cleanedSnippet = cleanedSnippet.substring(0, index).trim();
            }
          }

          if (process.env.ANTHROPIC_API_KEY) {
            try {
              const now = new Date();
              const aiResponse = await anthropic.messages.create({
                model: "claude-3-haiku-20240307",
                max_tokens: 300,
                system: `Du er en norsk salgsassistent. Dagens dato er ${now.toISOString().split('T')[0]}. Din jobb er å finne ut om kunden vil ha et møte. 
                
                Instrukser:
                1. Analyser KUN den nyeste meldingen (ignorer tidligere samtalehistorikk).
                2. "kl 17" betyr 17:00.
                3. Bruk ISO format: YYYY-MM-DDTHH:mm.`,
                messages: [{
                  role: "user", 
                  content: `Analyser dette svaret: "${cleanedSnippet}"
                  
                  Returner kun JSON:
                  {
                    "isMeetingRequested": boolean,
                    "datetime": "YYYY-MM-DDTHH:mm" | null,
                    "reason": "kort forklaring på norsk"
                  }`
                }],
              });

              const content = aiResponse.content[0].type === 'text' ? aiResponse.content[0].text : '';
              const analysis = JSON.parse(content);

              if (analysis.isMeetingRequested) {
                status = "Booket møte";
                meetingDate = analysis.datetime;
                aiReason = analysis.reason;
                foundMeetingsCount++;
              }
            } catch (e) {
              console.error("[Sync] AI Error:", e);
            }
          }

          // Create Note
          const nowStr = new Date().toLocaleString("nb-NO");
          let newNoteContent = `Svar mottatt via e-post (${nowStr}):\n"${cleanedSnippet}"`;
          
          if (status === "Booket møte" && meetingDate) {
            const displayDate = new Date(meetingDate).toLocaleString("nb-NO", {
              day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"
            });
            newNoteContent = `🎯 MØTE BOOKET (${nowStr})\n Foreslått tid: ${displayDate}\n Beskrivelse: ${aiReason}\n\nSvar: "${cleanedSnippet}"`;
          }

          const combinedNotes = lead.notes && lead.notes !== "—"
            ? `${newNoteContent}\n\n---\n\n${lead.notes}`
            : newNoteContent;

          // Update Lead
          await db.from("leads").update({ 
            status: status,
            meeting_date: meetingDate || lead.meeting_date,
            last_contacted: new Date().toISOString(),
            notes: combinedNotes
          }).eq("id", lead.id);

          // Stop sequence
          await db.from("email_sequence_enrollments")
            .update({ status: "completed" })
            .eq("lead_id", lead.id)
            .eq("status", "active");
        }
      }
    }


    if (foundRepliesCount > 0) {
      let msg = `Vellykket! Fant svar fra ${foundRepliesCount} leads.`;
      if (foundMeetingsCount > 0) {
        msg += ` 🎯 Fant ${foundMeetingsCount} nye møteforespørsler!`;
      }
      return NextResponse.json({ success: true, message: msg });
    }

    let report = totalUnreadMessagesSeen > 0 
      ? `Fant ${totalUnreadMessagesSeen} uleste e-poster, men ingen var fra dine leads.` 
      : "Ingen uleste e-poster funnet i din innboks.";

    return NextResponse.json({ success: true, message: report });

  } catch (error) {
    console.error("Email sync error:", error);
    return NextResponse.json({ error: "En feil oppstod under synkronisering" }, { status: 500 });
  }
}




