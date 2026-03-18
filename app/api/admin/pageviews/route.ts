import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!isAdmin(user?.email)) {
    return NextResponse.json({ error: "Ingen tilgang" }, { status: 403 });
  }

  const adminClient = createServiceClient();

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const monthStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [totalRes, todayRes, weekRes, monthRes, dailyRes] = await Promise.all([
    adminClient.from("page_views").select("id", { count: "exact", head: true }),
    adminClient.from("page_views").select("id", { count: "exact", head: true }).gte("visited_at", todayStart),
    adminClient.from("page_views").select("id", { count: "exact", head: true }).gte("visited_at", weekStart),
    adminClient.from("page_views").select("id", { count: "exact", head: true }).gte("visited_at", monthStart),
    adminClient.from("page_views").select("visited_at, ip_hash").gte("visited_at", weekStart),
  ]);

  // Build daily counts for last 7 days
  const dailyMap: Record<string, { views: number; unique: Set<string> }> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().slice(0, 10);
    dailyMap[key] = { views: 0, unique: new Set() };
  }
  for (const row of dailyRes.data ?? []) {
    const key = row.visited_at.slice(0, 10);
    if (dailyMap[key]) {
      dailyMap[key].views++;
      if (row.ip_hash) dailyMap[key].unique.add(row.ip_hash);
    }
  }
  const daily = Object.entries(dailyMap).map(([date, v]) => ({
    date,
    views: v.views,
    unique: v.unique.size,
  }));

  // Unique visitors this month (by ip_hash)
  const { data: monthData } = await adminClient
    .from("page_views")
    .select("ip_hash")
    .gte("visited_at", monthStart);
  const uniqueMonth = new Set((monthData ?? []).map(r => r.ip_hash).filter(Boolean)).size;

  return NextResponse.json({
    total: totalRes.count ?? 0,
    today: todayRes.count ?? 0,
    week: weekRes.count ?? 0,
    month: monthRes.count ?? 0,
    uniqueMonth,
    daily,
  });
}
