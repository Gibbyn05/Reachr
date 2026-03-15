import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createHash } from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { path, referrer } = await req.json();

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";
    const ipHash = createHash("sha256").update(ip).digest("hex").slice(0, 16);
    const userAgent = req.headers.get("user-agent") ?? "";

    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    await adminClient.from("page_views").insert({
      path: path ?? "/",
      ip_hash: ipHash,
      user_agent: userAgent,
      referrer: referrer ?? null,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
