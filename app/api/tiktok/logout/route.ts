import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const response = NextResponse.redirect(new URL("/tiktok", process.env.NEXT_PUBLIC_APP_URL || "https://reachr.no"));
  
  // Clear the tiktok_access_token cookie
  response.cookies.set("tiktok_access_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0),
    path: "/",
  });
  
  return response;
}
