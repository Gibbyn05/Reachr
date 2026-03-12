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
      .select("id, email, name, meeting_date")
      .eq("user_email", user.email);

    if (!leads) return NextResponse.json({ success: true, message: "Ingen leads å sjekke mot." });

    const leadEmailMap = new Map(leads.map(l => [l.email?.toLowerCase().trim(), l]));
    const monitoredEmails = Array.from(leadEmailMap.keys());
    console.log(`[Sync] Monitoring ${leads.length} leads. Leads with emails:`, monitoredEmails.length);

    let foundRepliesCount = 0;
    let totalUnreadMessagesSeen = 0;
    let detectedSenderEmails: string[] = [];
    let apiDiagnostics: string[] = [];

    for (const conn of connections) {
      let accessToken = conn.access_token;
      console.log(`[Sync] Checking ${conn.provider} for user ${user.email} (Account: ${conn.email_address})`);
      
      // Refresh token if needed
      if (conn.expires_at && new Date(conn.expires_at) < new Date()) {
        try {
          console.log(`[Sync] Token expired for ${conn.provider}, refreshing...`);
          const refreshed = conn.provider === "gmail" 
            ? await refreshGoogleToken(conn.refresh_token) 
            : await refreshMicrosoftToken(conn.refresh_token);
          
          if (refreshed.access_token) {
            accessToken = refreshed.access_token;
            await db.from("email_connections").update({
              access_token: accessToken,
              expires_at: refreshed.expires_in ? new Date(Date.now() + refreshed.expires_in * 1000).toISOString() : null
            }).eq("id", conn.id);
            console.log(`[Sync] Token refreshed successfully`);
          } else {
            apiDiagnostics.push(`${conn.provider}: Kunne ikke fornye tilgang (re-autentiser i innstillinger)`);
            continue;
          }
        } catch (e) {
          apiDiagnostics.push(`${conn.provider}: Feil under token-fornyelse`);
          continue;
        }
      }

      const foundConversations: { email: string, snippet: string }[] = [];

      try {
        if (conn.provider === "gmail") {
          // Changed query to be more inclusive but still unread
          const q = encodeURIComponent("label:unread");
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
                // Get From header case-insensitively
                const fromHeader = headers.find((h: any) => h.name.toLowerCase() === "from")?.value || "";
                const match = fromHeader.match(/<(.+)>|(\S+@\S+)/);
                const email = (match ? (match[1] || match[2]) : fromHeader).toLowerCase().trim();
                
                if (email) {
                  detectedSenderEmails.push(email);
                  foundConversations.push({ email, snippet: detail.snippet || "" });
                }
              }
            }
          } else {
            apiDiagnostics.push(`Gmail API feil: ${listRes.status}`);
          }
        } else if (conn.provider === "outlook") {
          // Broad search in messages for unread
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
          } else {
            apiDiagnostics.push(`Outlook API feil: ${listRes.status}`);
          }
        }
      } catch (e) {
        apiDiagnostics.push(`${conn.provider}: Nettverksfeil under henting`);
      }

      // Match found emails to leads
      for (const conv of foundConversations) {
        const lead = leadEmailMap.get(conv.email);
        
        if (lead) {
          console.log(`[Sync] Match funnet! Lead: ${lead.name} (${conv.email})`);
          foundRepliesCount++;

          let status = "Kontaktet";
          let meetingDate = null;

          // AI Intent Detection (if enabled)
          if (process.env.ANTHROPIC_API_KEY) {
            try {
              const aiResponse = await anthropic.messages.create({
                model: "claude-3-haiku-20240307",
                max_tokens: 200,
                system: "Du er en AI som analyserer e-poster for å se om noen vil ha et møte. Svar KUN med JSON.",
                messages: [{
                  role: "user", 
                  content: `Analyser: "${conv.snippet}". Svar: {"isMeetingRequested": boolean, "date": string | null (YYYY-MM-DD), "summary": string}`
                }],
              });

              const content = aiResponse.content[0].type === 'text' ? aiResponse.content[0].text : '';
              const analysis = JSON.parse(content);

              if (analysis.isMeetingRequested) {
                status = "Booket møte";
                meetingDate = analysis.date;
              }
            } catch (e) {
              console.error("[Sync] AI Error:", e);
            }
          }

          // 1. Update Lead
          await db.from("leads").update({ 
            status: status,
            meeting_date: meetingDate || lead.meeting_date,
            last_contacted: new Date().toISOString()
          }).eq("id", lead.id);

          // 2. Stop sequence
          await db.from("email_sequence_enrollments")
            .update({ status: "completed" })
            .eq("lead_id", lead.id)
            .eq("status", "active");
        }
      }
    }

    if (foundRepliesCount > 0) {
      return NextResponse.json({ 
        success: true, 
        message: `Vellykket! Fant svar fra ${foundRepliesCount} leads og oppdaterte status.` 
      });
    }

    // Diagnostics if nothing was matched
    let message = "Ingen nye svar ble oppdaget.";
    
    if (totalUnreadMessagesSeen > 0) {
      // Get unique emails detected
      const uniqueSenders = Array.from(new Set(detectedSenderEmails));
      message = `Fant ${totalUnreadMessagesSeen} uleste e-poster fra: ${uniqueSenders.slice(0, 3).join(", ")}. Ingen av disse samsvarer med dine leads i Reachr. Sjekk at e-posten på leadet er helt riktig.`;
    } else if (apiDiagnostics.length > 0) {
      message = `Problemer med tilkobling: ${apiDiagnostics.join(", ")}`;
    } else {
      message = "Ingen uleste e-poster ble funnet i din innboks. Pass på at svar-mailen ligger som 'ulest' for at Reachr skal se den.";
    }

    return NextResponse.json({ 
      success: true, 
      message: message
    });

  } catch (error) {
    console.error("Email sync error:", error);
    return NextResponse.json({ error: "En uventet feil oppstod under synkronisering" }, { status: 500 });
  }
}



