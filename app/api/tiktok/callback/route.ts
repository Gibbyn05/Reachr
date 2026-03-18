import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  if (error) {
    return NextResponse.json({ error, errorDescription }, { status: 400 });
  }

  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET;
  const redirectUri = process.env.TIKTOK_REDIRECT_URI;

  try {
    const tokenUrl = "https://www.tiktok.com/v2/auth/token/";
    const formData = new URLSearchParams();
    formData.append("client_key", clientKey!);
    formData.append("client_secret", clientSecret!);
    formData.append("code", code);
    formData.append("grant_type", "authorization_code");
    formData.append("redirect_uri", redirectUri!);

    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cache-Control": "no-cache",
      },
      body: formData,
    });

    const data = await response.json();

    if (data.error) {
      return NextResponse.json({ error: data.error, description: data.error_description }, { status: 400 });
    }

    // Success! We have the access_token.
    // data.access_token, data.open_id, data.expires_in, data.refresh_token
    
    // For now, I'll redirect back to tiktok with a success message 
    // and store the token in a cookie (not ideal for production but works for this demo).
    const redirectRes = NextResponse.redirect(new URL("/tiktok?tiktok=success", req.url));
    redirectRes.cookies.set("tiktok_access_token", data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: data.expires_in,
      path: "/",
    });
    
    return redirectRes;
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to exchange token", details: err.message }, { status: 500 });
  }
}
