import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.MICROSOFT_CLIENT_ID;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  if (!clientId) {
    return NextResponse.json({ error: "Microsoft OAuth ikke konfigurert" }, { status: 500 });
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${appUrl}/api/email/microsoft/callback`,
    response_type: "code",
    scope: "https://graph.microsoft.com/Mail.Send https://graph.microsoft.com/User.Read offline_access",
    response_mode: "query",
  });

  return NextResponse.redirect(
    `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${params}`
  );
}
