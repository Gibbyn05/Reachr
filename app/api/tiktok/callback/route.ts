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
    const tokenUrl = "https://open.tiktokapis.com/v2/oauth/token/";
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

    const responseText = await response.text();
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error("TikTok token exchange failed with non-JSON response:", responseText);
      return NextResponse.json({ error: "Failed to exchange token", details: responseText.substring(0, 100) }, { status: 500 });
    }

    if (data.error) {
           return NextResponse.json({ error: data.error, description: data.error_description }, { status: 400 });
    }

    // Success! We have the access_token.
    // data.access_token, data.open_id, data.expires_in, data.refresh_token
    
    // Fetch user info to show in the UI (improves demo quality for TikTok review)
    let displayName = "TikTok Bruker";
    let avatarUrl = "";
    
    try {
      const userResponse = await fetch("https://open.tiktokapis.com/v2/user/info/?fields=display_name,avatar_url", {
        headers: { "Authorization": `Bearer ${data.access_token}` }
      });
      const userData = await userResponse.json();
      if (userData.data?.user) {
        displayName = userData.data.user.display_name;
        avatarUrl = userData.data.user.avatar_url;
      }
    } catch (e) {
      console.error("Failed to fetch user info:", e);
    }

    // Redirect back to our TikTok page with a success message 
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const redirectUrl = new URL("/tiktok", appUrl);
    redirectUrl.searchParams.set("tiktok", "success");
    redirectUrl.searchParams.set("name", displayName);
    if (avatarUrl) redirectUrl.searchParams.set("avatar", avatarUrl);
    
    const finalResponse = NextResponse.redirect(redirectUrl);
    
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
