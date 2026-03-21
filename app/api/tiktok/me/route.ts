import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const tiktokToken = req.cookies.get("tiktok_access_token")?.value;

  if (!tiktokToken) {
    return NextResponse.json({ connected: false });
  }

  try {
    const userResponse = await fetch("https://open.tiktokapis.com/v2/user/info/?fields=display_name,avatar_url", {
      headers: { "Authorization": `Bearer ${tiktokToken}` }
    });
    
    const userData = await userResponse.json();
    
    if (userData.data?.user) {
      return NextResponse.json({ 
        connected: true,
        name: userData.data.user.display_name,
        avatar: userData.data.user.avatar_url
      });
    }

    return NextResponse.json({ connected: false });
  } catch (e) {
    return NextResponse.json({ connected: false, error: "Failed to fetch user info" });
  }
}
