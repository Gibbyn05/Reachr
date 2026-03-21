import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Helper to save images temporarily so TikTok can fetch them via ngrok
const TEMP_DIR = path.join(process.cwd(), "public", "temp_slides");

if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

export async function POST(req: NextRequest) {
  const tiktokToken = req.cookies.get("tiktok_access_token")?.value;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://reachr.no";

  if (!tiktokToken) {
    return NextResponse.json({ error: "TikTok not connected. Please connect first." }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const slides = Array.from(formData.keys()).filter(k => k.startsWith("slide_"));
    
    if (slides.length === 0) {
      return NextResponse.json({ error: "No images provided." }, { status: 400 });
    }

    const photoItemList = [];
    for (const key of slides) {
      const file = formData.get(key) as File;
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = `${Date.now()}_${key}.png`;
      const filePath = path.join(TEMP_DIR, fileName);
      
      fs.writeFileSync(filePath, buffer);
      photoItemList.push({
        photo_url: `${appUrl}/temp_slides/${fileName}`,
        photo_size: file.size
      });
    }

    // 2. Prepare the TikTok API Request (Content Posting API v2)
    const initUrl = "https://open.tiktokapis.com/v2/post/publish/content/init/";
    
    // CAPTION
    const caption = "LinkedIn er mettet. Her er hvordan vi bygger pipeline på 30 min med Reachr.no! 🚀 #sales #b2b #marketing #startup #reachr";

    const body = {
      post_info: {
        title: "Reachr Leads Insights",
        video_description: caption,
        privacy_level: "PUBLIC_TO_EVERYONE"
      },
      media_type: "PHOTO",
      post_mode: "DIRECT_POST",
      source_info: {
        source_type: "PULL_FROM_URL",
        photo_cover_index: 0,
        photo_urls: photoItemList.map(p => p.photo_url)
      }
    };

    // 3. Call TikTok API
    const response = await fetch(initUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${tiktokToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const result = await response.json();
    
    if (result.error && result.error.code !== "ok") {
       console.error("TikTok API error:", result.error);
       return NextResponse.json({ error: result.error.message || "TikTok API error" }, { status: 400 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: "Slideshow lastet opp! Sjekk TikTok-appen din for å publisere.",
      data: result.data
    });

  } catch (err: any) {
    console.error("Publish error:", err);
    return NextResponse.json({ error: "Publishing failed", details: err.message }, { status: 500 });
  }
}
