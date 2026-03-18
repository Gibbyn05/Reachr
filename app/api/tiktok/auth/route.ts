import { NextRequest, NextResponse } from "next/server";
import crypto from 'crypto';

function generateRandomString(length: number): string {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  let text = '';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

function sha256(plain: string): Buffer {
  return crypto.createHash('sha256').update(plain).digest();
}

function base64UrlEncode(buffer: Buffer): string {
  return buffer.toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export async function GET(req: NextRequest) {
  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  const redirectUri = process.env.TIKTOK_REDIRECT_URI;
  
  if (!clientKey || !redirectUri) {
    return NextResponse.json({ error: "TikTok credentials missing" }, { status: 500 });
  }

  // PKCE: code_challenge & code_verifier are required for TikTok OAuth 2.0
  const codeVerifier = generateRandomString(50);
  const codeChallenge = base64UrlEncode(sha256(codeVerifier));

  const scopes = "user.info.basic video.upload video.publish";
  const state = Math.random().toString(36).substring(7);

  const authUrl = new URL("https://www.tiktok.com/v2/auth/authorize");
  authUrl.searchParams.append("client_key", clientKey);
  authUrl.searchParams.append("scope", scopes);
  authUrl.searchParams.append("response_type", "code");
  authUrl.searchParams.append("redirect_uri", redirectUri);
  authUrl.searchParams.append("state", state);
  authUrl.searchParams.append("code_challenge", codeChallenge);
  authUrl.searchParams.append("code_challenge_method", "S256");

  const response = NextResponse.redirect(authUrl.toString());
  
  // Store code_verifier in a cookie for the callback to use
  response.cookies.set("tiktok_code_verifier", codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 300, // 5 minutes is plenty for the flow
    path: "/",
  });

  return response;
}
