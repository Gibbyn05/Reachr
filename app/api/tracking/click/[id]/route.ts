import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const searchParams = req.nextUrl.searchParams;
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return NextResponse.json({ error: "Missing target URL" }, { status: 400 });
  }

  try {
    const userAgent = req.headers.get("user-agent") || "unknown";
    const ip = req.headers.get("x-forwarded-for") || "unknown";

    // Record click event
    await supabase.from("email_events").insert({
      email_log_id: id,
      event_type: "click",
      target_url: targetUrl,
      user_agent: userAgent,
      ip_address: ip,
    });

    // Redirect to the original URL
    return NextResponse.redirect(new URL(targetUrl));
  } catch (error) {
    console.error("Click tracking error:", error);
    return NextResponse.redirect(new URL(targetUrl));
  }
}
