import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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
      scope: "https://graph.microsoft.com/Mail.Send offline_access",
    }),
  });
  return res.json();
}

export async function POST(req: NextRequest) {
  const { provider, to, subject, body } = await req.json();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Load connection
  const { data: conn } = await supabase
    .from("email_connections")
    .select("*")
    .eq("user_email", user.email)
    .eq("provider", provider)
    .single();

  if (!conn) {
    return NextResponse.json({ error: `Ingen ${provider}-konto tilkoblet` }, { status: 400 });
  }

  let accessToken = conn.access_token;

  // Refresh token if expired
  if (conn.expires_at && new Date(conn.expires_at) < new Date()) {
    if (!conn.refresh_token) {
      return NextResponse.json({ error: "Token utløpt – koble til kontoen på nytt" }, { status: 401 });
    }

    const refreshed = provider === "gmail"
      ? await refreshGoogleToken(conn.refresh_token)
      : await refreshMicrosoftToken(conn.refresh_token);

    if (!refreshed.access_token) {
      return NextResponse.json({ error: "Klarte ikke fornye tilgang – koble til på nytt" }, { status: 401 });
    }

    accessToken = refreshed.access_token;
    const newExpiry = refreshed.expires_in
      ? new Date(Date.now() + refreshed.expires_in * 1000).toISOString()
      : null;

    await supabase.from("email_connections").update({
      access_token: accessToken,
      expires_at: newExpiry,
    }).eq("id", conn.id);
  }

  if (provider === "gmail") {
    // Build RFC 2822 message
    const emailLines = [
      `To: ${to}`,
      `Subject: =?UTF-8?B?${Buffer.from(subject).toString("base64")}?=`,
      "MIME-Version: 1.0",
      "Content-Type: text/plain; charset=UTF-8",
      "Content-Transfer-Encoding: base64",
      "",
      Buffer.from(body).toString("base64"),
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
      return NextResponse.json({ error: err.error?.message ?? "Gmail send feilet" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  }

  // Outlook (Microsoft Graph)
  const res = await fetch("https://graph.microsoft.com/v1.0/me/sendMail", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: {
        subject,
        body: { contentType: "Text", content: body },
        toRecipients: [{ emailAddress: { address: to } }],
      },
      saveToSentItems: true,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return NextResponse.json({ error: err.error?.message ?? "Outlook send feilet" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
