
import { createServiceClient } from "@/lib/supabase/server";

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
  const tenant = process.env.MICROSOFT_TENANT_ID ?? "common";
  const res = await fetch(`https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: process.env.MICROSOFT_CLIENT_ID!,
      client_secret: process.env.MICROSOFT_CLIENT_SECRET!,
      grant_type: "refresh_token",
      scope: "https://graph.microsoft.com/Mail.Send offline_access",
    }),
  });
  return res.json();
}

export async function sendEmail({
  ownerEmail,
  to,
  subject,
  body,
  provider,
  leadId,
  sequenceId,
  stepId
}: {
  ownerEmail: string;
  to: string;
  subject: string;
  body: string;
  provider: "gmail" | "outlook";
  leadId?: string;
  sequenceId?: string;
  stepId?: string;
}) {
  const db = createServiceClient();
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.reachr.no";

  // 1. Create email log
  const { data: log, error: logErr } = await db.from("email_logs").insert({
    user_email: ownerEmail,
    lead_id: leadId,
    recipient_email: to,
    subject: subject,
    sequence_id: sequenceId,
    step_id: stepId
  }).select("id").single();

  if (logErr) console.error("Could not create email log:", logErr);
  const logId = log?.id;

  // 2. Prepare HTML body with tracking
  let htmlBody = body.replace(/\n/g, "<br />");

  if (logId) {
    // Wrap links
    const linkRegex = /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/gi;
    htmlBody = htmlBody.replace(linkRegex, (match, quote, url) => {
      if (url.startsWith("http")) {
        const trackedUrl = `${APP_URL}/api/tracking/click/${logId}?url=${encodeURIComponent(url)}`;
        return match.replace(url, trackedUrl);
      }
      return match;
    });

    // Also find plain text URLs and wrap them? No, let's stick to <a> for now.
    
    // Inject open tracking pixel
    htmlBody += `<img src="${APP_URL}/api/tracking/open/${logId}" width="1" height="1" style="display:none !important;" alt="" />`;
  }
  const { data: conn } = await db
    .from("email_connections")
    .select("*")
    .eq("user_email", ownerEmail)
    .eq("provider", provider)
    .single();

  if (!conn) throw new Error(`Ingen ${provider}-konto tilkoblet for ${ownerEmail}`);

  let accessToken = conn.access_token;
  if (conn.expires_at && new Date(conn.expires_at) < new Date()) {
    if (!conn.refresh_token) throw new Error("Token utløpt og mangler refresh_token");

    const refreshed = provider === "gmail"
      ? await refreshGoogleToken(conn.refresh_token)
      : await refreshMicrosoftToken(conn.refresh_token);

    if (!refreshed.access_token) throw new Error("Klarte ikke fornye token");

    accessToken = refreshed.access_token;
    const newExpiry = refreshed.expires_in
      ? new Date(Date.now() + refreshed.expires_in * 1000).toISOString()
      : null;

    await db.from("email_connections").update({
      access_token: accessToken,
      expires_at: newExpiry,
    }).eq("id", conn.id);
  }

  if (provider === "gmail") {
    const emailLines = [
      `To: ${to}`,
      `Subject: =?UTF-8?B?${Buffer.from(subject).toString("base64")}?=`,
      "MIME-Version: 1.0",
      "Content-Type: text/html; charset=UTF-8",
      "Content-Transfer-Encoding: base64",
      "",
      Buffer.from(htmlBody).toString("base64"),
    ];
    const raw = Buffer.from(emailLines.join("\r\n"))
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    const res = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ raw }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error?.message ?? "Gmail-utsendelse feilet");
    }
  } else {
    // Outlook
    const res = await fetch("https://graph.microsoft.com/v1.0/me/sendMail", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: {
          subject,
          body: { contentType: "HTML", content: htmlBody },
          toRecipients: [{ emailAddress: { address: to } }],
        },
        saveToSentItems: true,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || "Outlook-utsendelse feilet");
    }
  }

  console.log(`[EmailSender] Vellykket utsendelse til ${to} via ${provider}`);
  return { success: true };
}
