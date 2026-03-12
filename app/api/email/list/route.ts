import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

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

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = createServiceClient();
  const { data: connections, error: connError } = await db
    .from("email_connections")
    .select("*")
    .eq("user_email", user.email);

  if (connError) {
    console.error("Database error fetching connections:", connError);
  }

  if (!connections || connections.length === 0) {
    return NextResponse.json({ emails: [] });
  }

  const allEmails: any[] = [];

  for (const conn of connections) {
    let accessToken = conn.access_token;
    
    // Check if token is expired
    const isExpired = conn.expires_at && new Date(conn.expires_at) < new Date();
    
    if (isExpired && conn.refresh_token) {
      console.log(`Token expired for ${conn.provider}, refreshing...`);
      try {
        const refreshed = conn.provider === "gmail"
          ? await refreshGoogleToken(conn.refresh_token)
          : await refreshMicrosoftToken(conn.refresh_token);
        
        if (refreshed.access_token) {
          accessToken = refreshed.access_token;
          const newExpiry = refreshed.expires_in
            ? new Date(Date.now() + refreshed.expires_in * 1000).toISOString()
            : null;
            
          await db.from("email_connections").update({
            access_token: accessToken,
            expires_at: newExpiry,
          }).eq("id", conn.id);
          
          console.log(`Token refreshed successfully for ${conn.provider}`);
        } else {
          console.error(`Failed to refresh token for ${conn.provider}:`, refreshed);
        }
      } catch (err) {
        console.error(`Error refreshing ${conn.provider} token:`, err);
      }
    }

    try {
      if (conn.provider === "gmail") {
        const res = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=20`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        if (res.ok) {
          const data = await res.json();
          for (const msg of (data.messages || [])) {
            const detailRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`, {
              headers: { Authorization: `Bearer ${accessToken}` }
            });
            if (detailRes.ok) {
              const detail = await detailRes.json();
              const headers = detail.payload.headers;
              const subject = headers.find((h: any) => h.name.toLowerCase() === "subject")?.value || "(Inget emne)";
              const from = headers.find((h: any) => h.name.toLowerCase() === "from")?.value || "";
              const date = headers.find((h: any) => h.name.toLowerCase() === "date")?.value || "";

              allEmails.push({
                id: msg.id,
                threadId: detail.threadId,
                from,
                subject,
                snippet: detail.snippet,
                date: new Date(date).toISOString(),
                provider: "gmail",
                isRead: !detail.labelIds?.includes("UNREAD")
              });
            }
          }
        } else {
          const err = await res.json();
          console.error(`Gmail API error for ${user.email}:`, err);
        }
      } else if (conn.provider === "outlook") {
        const res = await fetch(`https://graph.microsoft.com/v1.0/me/messages?$top=20&$select=subject,from,receivedDateTime,bodyPreview,isRead,id`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        if (res.ok) {
          const data = await res.json();
          for (const msg of (data.value || [])) {
            allEmails.push({
              id: msg.id,
              from: `${msg.from?.emailAddress?.name || ""} <${msg.from?.emailAddress?.address}>`,
              subject: msg.subject || "(Inget emne)",
              snippet: msg.bodyPreview,
              date: msg.receivedDateTime,
              provider: "outlook",
              isRead: msg.isRead
            });
          }
        } else {
          const err = await res.json();
          console.error(`Outlook API error for ${user.email}:`, err);
        }
      }
    } catch (e) {
      console.error("Fetch email error:", e);
    }
  }

  return NextResponse.json({ 
    emails: allEmails.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) 
  });
}
