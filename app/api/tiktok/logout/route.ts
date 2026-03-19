import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.redirect(new URL("/tiktok", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"));
  
  // Clear the tiktok_access_token cookie
  response.cookies.set("tiktok_access_token", "", {
    maxAge: 0,
    path: "/",
  });
  
  return response;
}
