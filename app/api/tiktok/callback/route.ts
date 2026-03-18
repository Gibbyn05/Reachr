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

  // Retrieve code_verifier from the cookie (required for PKCE)
  const codeVerifier = req.cookies.get("tiktok_code_verifier")?.value;

  if (!codeVerifier) {
    return NextResponse.json({ error: "No code verifier found in cookies" }, { status: 400 });
  }

  try {
    const tokenUrl = "https://www.tiktok.com/v2/auth/token/";
    const formData = new URLSearchParams();
    formData.append("client_key", clientKey!);
    formData.append("client_secret", clientSecret!);
    formData.append("code", code);
    formData.append("grant_type", "authorization_code");
    formData.append("redirect_uri", redirectUri!);
    formData.append("code_verifier", codeVerifier);

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
    
    // Redirect back to our TikTok page with a success message 
    const finalResponse = NextResponse.redirect(new URL("/tiktok?tiktok=success", req.url));
    
    // Store the token in a secure, HTTP-only cookie
    finalResponse.cookies.set("tiktok_access_token", data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: data.expires_in,
      path: "/",
    });
    
    // Clean up the verifier cookie
    finalResponse.cookies.delete("tiktok_code_verifier");
    
    return finalResponse;
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to exchange token", details: err.message }, { status: 500 });
  }
}
