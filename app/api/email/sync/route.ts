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

    const { data: leads } = await db
      .from("leads")
      .select("id, email, name, meeting_date, notes")
      .eq("user_email", user.email);

    if (!leads) return NextResponse.json({ success: true, message: "Ingen leads å sjekke mot." });

    const leadEmailMap = new Map(leads.map(l => [l.email?.toLowerCase().trim(), l]));
    
    let foundRepliesCount = 0;
    let foundMeetingsCount = 0;
    let totalUnreadMessagesSeen = 0;

    for (const conn of connections) {
      let accessToken = conn.access_token;
      
      // Refresh token if expired
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
        } catch (e) { continue; }
      }

      const foundConversations: { id: string, provider: string, email: string, snippet: string }[] = [];

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
                const fromHeader = detail.payload.headers.find((h: any) => h.name.toLowerCase() === "from")?.value || "";
                const match = fromHeader.match(/<(.+)>|(\S+@\S+)/);
                const email = (match ? (match[1] || match[2]) : fromHeader).toLowerCase().trim();
                if (email) foundConversations.push({ id: msg.id, provider: "gmail", email, snippet: detail.snippet || "" });
              }
            }
          }
        } else if (conn.provider === "outlook") {
          const listRes = await fetch(`https://graph.microsoft.com/v1.0/me/messages?$filter=isRead eq false&$top=15&$select=from,id,bodyPreview`, {
            headers: { Authorization: `Bearer ${accessToken}` }
          });
          if (listRes.ok) {
            const data = await listRes.json();
            const messages = data.value || [];
            totalUnreadMessagesSeen += messages.length;
            for (const msg of messages) {
              const email = msg.from?.emailAddress?.address?.toLowerCase().trim();
              if (email) foundConversations.push({ id: msg.id, provider: "outlook", email, snippet: msg.bodyPreview || "" });
            }
          }
        }
      } catch (e) { console.error("[Sync] Fetch failed:", e); }

      for (const conv of foundConversations) {
        const lead = leadEmailMap.get(conv.email);
        if (lead) {
          foundRepliesCount++;

          // Cleaning
          let cleanedSnippet = (conv.snippet || "").trim();
          const threadMarkers = [/\nOn\s.*\swrote:/i, /\sOn\s.*\swrote:/i, /\nDen\s.*\sskrev:/i, /\sDen\s.*\sskrev:/i, /---------- Forwarded message ---------/i, /From:.*@/i];
          for (const marker of threadMarkers) {
            const match = cleanedSnippet.match(marker);
            if (match) cleanedSnippet = cleanedSnippet.substring(0, match.index).trim();
          }

          // Dedupe: If snippet already in notes, skip adding it
          if (lead.notes && lead.notes.includes(cleanedSnippet.substring(0, 40))) {
            // Still mark as read so we don't look at it again
            await markAsRead(conv.id, conv.provider, accessToken);
            continue;
          }

          let status = "Kontaktet";
          let meetingDate = null;
          let aiReason = "";

          if (process.env.ANTHROPIC_API_KEY) {
            try {
              const now = new Date();
              const isoToday = now.toISOString().split("T")[0]; // Use ISO for context
              const aiResponse = await anthropic.messages.create({
                model: "claude-3-haiku-20240307",
                max_tokens: 300,
                system: `Du er en norsk salgsassistent. I dag er ${isoToday}.
                Oppgave: Finn møtedato og tidspunkt i svaret. 
                Viktige regler:
                - Vi bruker Europe/Oslo tidssone.
                - "kl 17" = 17:00. 
                - Hvis kun dato er oppgitt, sett tid til 09:00.
                - Returner KUN JSON.`,
                messages: [{ 
                  role: "user", 
                  content: `Analyser denne meldingen: "${cleanedSnippet}"
                  
                  Returner JSON: 
                  { 
                    "isMeetingRequested": boolean, 
                    "date": "YYYY-MM-DD",
                    "time": "HH:mm" | null,
                    "reason": "forklaring" 
                  }` 
                }],
              });

              const analysis = JSON.parse((aiResponse.content[0] as any).text);
              if (analysis.isMeetingRequested && analysis.date) {
                status = "Booket møte";
                const timeStr = analysis.time || "09:00";
                // Final ISO string: YYYY-MM-DDTHH:mm:00+01:00
                meetingDate = `${analysis.date}T${timeStr}:00+01:00`;
                aiReason = analysis.reason;
                foundMeetingsCount++;
              }
            } catch (e) {
              console.error("[Sync] AI Error:", e);
            }
          }

          const nowStr = new Date().toLocaleString("nb-NO");
          let newNoteText = `Svar mottatt (${nowStr}): "${cleanedSnippet}"`;
          if (status === "Booket møte" && meetingDate) {
            if (lead.meeting_date === meetingDate) {
              newNoteText = `Gjentatt bekreftelse på møte (${nowStr}): "${cleanedSnippet}"`;
            } else {
              const displayDate = new Date(meetingDate).toLocaleString("nb-NO", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
              newNoteText = `🎯 MØTE BOOKET (${nowStr})\nTid: ${displayDate}\nBeskrivelse: ${aiReason || "Møteforespørsel"}\n\nSvar: "${cleanedSnippet}"`;
            }
          }

          const combined = lead.notes && lead.notes !== "—" ? `${newNoteText}\n\n---\n\n${lead.notes}` : newNoteText;
          
          await db.from("leads").update({ 
            status: status,
            meeting_date: meetingDate || lead.meeting_date,
            last_contacted: new Date().toISOString(),
            notes: combined
          }).eq("id", lead.id);

          await markAsRead(conv.id, conv.provider, accessToken);
          
          await db.from("email_sequence_enrollments").update({ status: "completed" }).eq("lead_id", lead.id).eq("status", "active");
        }
      }
    }

    if (foundRepliesCount > 0) {
      return NextResponse.json({ success: true, message: `Fant svar fra ${foundRepliesCount} leads.${foundMeetingsCount > 0 ? ` 🎯 ${foundMeetingsCount} møter booket!` : ""}` });
    }
    return NextResponse.json({ success: true, message: totalUnreadMessagesSeen > 0 ? `Sett ${totalUnreadMessagesSeen} e-poster, men ingen fra leads.` : "Ingen nye e-poster." });

  } catch (error) {
    return NextResponse.json({ error: "Feil under synk" }, { status: 500 });
  }
}

async function markAsRead(id: string, provider: string, token: string) {
  try {
    if (provider === "gmail") {
      await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}/modify`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ removeLabelIds: ["UNREAD"] })
      });
    } else {
      await fetch(`https://graph.microsoft.com/v1.0/me/messages/${id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: true })
      });
    }
  } catch (e) {}
}
