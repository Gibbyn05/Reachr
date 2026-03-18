import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  const redirectUri = process.env.TIKTOK_REDIRECT_URI;
  
  if (!clientKey || !redirectUri) {
    return NextResponse.json({ error: "TikTok credentials missing" }, { status: 500 });
  }

  // Define the scopes we need. 
  // 'video.upload', 'video.publish' etc are for videos.
  // For photo mode, we need 'user.info.basic' and potentially others.
  // See: https://developers.tiktok.com/doc/content-posting-api-v2-publish-content-from-url/
  const scopes = "user.info.basic,video.upload,video.publish";
  const state = Math.random().toString(36).substring(7);

  const authUrl = new URL("https://www.tiktok.com/v2/auth/authorize/");
  authUrl.searchParams.append("client_key", clientKey);
  authUrl.searchParams.append("scope", scopes);
  authUrl.searchParams.append("response_type", "code");
  authUrl.searchParams.append("redirect_uri", redirectUri);
  authUrl.searchParams.append("state", state);

  return NextResponse.redirect(authUrl.toString());
}
