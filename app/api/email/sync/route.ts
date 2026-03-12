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
    console.log(`[Sync] Monitoring ${leads.length} leads. Emails:`, monitoredEmails);

    let foundRepliesCount = 0;
    let totalMessagesFound = 0;
    let unmatchedEmails: string[] = [];

    for (const conn of connections) {
      let accessToken = conn.access_token;
      console.log(`[Sync] Checking ${conn.provider} for user ${user.email}`);
      
      // Refresh token if needed
      if (conn.expires_at && new Date(conn.expires_at) < new Date()) {
        console.log(`[Sync] Refreshing token for ${conn.provider}`);
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
      }

      const foundConversations: { email: string, snippet: string }[] = [];

      if (conn.provider === "gmail") {
        const q = encodeURIComponent("is:unread");
        const listRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${q}&maxResults=20`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        if (listRes.ok) {
          const listData = await listRes.json();
          const messages = listData.messages || [];
          totalMessagesFound += messages.length;
          console.log(`[Sync] Gmail found ${messages.length} unread messages`);
          
          for (const msg of messages) {
            const detailRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`, {
              headers: { Authorization: `Bearer ${accessToken}` }
            });
            if (detailRes.ok) {
              const detail = await detailRes.json();
              const headers = detail.payload.headers;
              const fromHeader = headers.find((h: any) => (h.name === "From" || h.name === "from"))?.value || "";
              const match = fromHeader.match(/<(.+)>|(\S+@\S+)/);
              const email = (match ? (match[1] || match[2]) : fromHeader).toLowerCase().trim();
              
              if (email) {
                foundConversations.push({ email, snippet: detail.snippet || "" });
              }
            }
          }
        }
      } else if (conn.provider === "outlook") {
        const listRes = await fetch(`https://graph.microsoft.com/v1.0/me/messages?$filter=isRead eq false&$top=20&$select=from,bodyPreview`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        if (listRes.ok) {
          const data = await listRes.json();
          const messages = data.value || [];
          totalMessagesFound += messages.length;
          console.log(`[Sync] Outlook found ${messages.length} unread messages`);
          
          for (const msg of messages) {
            const email = msg.from?.emailAddress?.address?.toLowerCase().trim();
            if (email) {
              foundConversations.push({ email, snippet: msg.bodyPreview || "" });
            }
          }
        }
      }

      // Match found emails to leads and analyze intent with AI
      for (const conv of foundConversations) {
        const lead = leadEmailMap.get(conv.email);
        
        if (lead) {
          console.log(`[Sync] MATCH! ${conv.email} belongs to lead ${lead.name}`);
          // AI Intent Detection
          let status = "Kontaktet";
          let meetingDate = null;

          try {
            const aiResponse = await anthropic.messages.create({
              model: "claude-3-haiku-20240307",
              max_tokens: 200,
              system: "Du er en AI som analyserer salgs-eposter. Finn ut om kunden vil ha et møte/prat og trekk ut dato (YYYY-MM-DD).",
              messages: [{
                role: "user", 
                content: `Svar KUN JSON: {"isMeetingRequested": boolean, "date": string | null, "summary": string}\n\nE-post snippet: "${conv.snippet}"`
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

          // 1. Update Lead Status and Meeting Date
          await db.from("leads").update({ 
            status: status,
            meeting_date: meetingDate || lead.meeting_date,
            last_contacted: new Date().toISOString()
          }).eq("id", lead.id);

          // 2. Stop any active sequences for this lead
          await db
            .from("email_sequence_enrollments")
            .update({ status: "completed" })
            .eq("lead_id", lead.id)
            .eq("status", "active");

          foundRepliesCount++;
        } else {
          unmatchedEmails.push(conv.email);
        }
      }
    }

    if (foundRepliesCount > 0) {
      return NextResponse.json({ 
        success: true, 
        message: `Suksess! Fant ${foundRepliesCount} svar og oppdaterte status.` 
      });
    }

    let debugMsg = "Ingen nye svar oppdaget.";
    if (totalMessagesFound > 0) {
      debugMsg = `Fant ${totalMessagesFound} uleste e-poster, men ingen av senderne (${unmatchedEmails.slice(0, 3).join(", ")}...) samsvarte med dine leads. Sjekk at e-posten på leadet er helt riktig.`;
    }

    return NextResponse.json({ 
      success: true, 
      message: debugMsg
    });

  } catch (error) {
    console.error("Email sync error:", error);
    return NextResponse.json({ error: "En feil oppstod under synkronisering" }, { status: 500 });
  }
}


