import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const adminClient = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const userEmail = user.email!;

  // Total emails sent
  const { count: totalSent } = await adminClient
    .from("email_logs")
    .select("*", { count: "exact", head: true })
    .eq("user_email", userEmail);

  // Get all email_log IDs for this user
  const { data: logs } = await adminClient
    .from("email_logs")
    .select("id")
    .eq("user_email", userEmail);

  const logIds = (logs ?? []).map((l: { id: string }) => l.id);

  let totalOpens = 0;
  let totalClicks = 0;
  let uniqueOpens = 0;

  if (logIds.length > 0) {
    // Opens
    const { count: opens } = await adminClient
      .from("email_events")
      .select("*", { count: "exact", head: true })
      .in("email_log_id", logIds)
      .eq("event_type", "open");
    totalOpens = opens ?? 0;

    // Unique opens (one per log)
    const { data: uniqueOpenData } = await adminClient
      .from("email_events")
      .select("email_log_id")
      .in("email_log_id", logIds)
      .eq("event_type", "open");
    uniqueOpens = new Set((uniqueOpenData ?? []).map((e: { email_log_id: string }) => e.email_log_id)).size;

    // Clicks
    const { count: clicks } = await adminClient
      .from("email_events")
      .select("*", { count: "exact", head: true })
      .in("email_log_id", logIds)
      .eq("event_type", "click");
    totalClicks = clicks ?? 0;
  }

  // Recent sends per day (last 14 days)
  const { data: recentLogs } = await adminClient
    .from("email_logs")
    .select("sent_at")
    .eq("user_email", userEmail)
    .gte("sent_at", new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString())
    .order("sent_at", { ascending: true });

  // Build daily counts
  const dailyCounts: Record<string, number> = {};
  for (let i = 13; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    dailyCounts[d.toISOString().split("T")[0]] = 0;
  }
  for (const log of recentLogs ?? []) {
    const day = log.sent_at.split("T")[0];
    if (dailyCounts[day] !== undefined) dailyCounts[day]++;
  }

  const openRate = totalSent! > 0 ? Math.round((uniqueOpens / totalSent!) * 100) : 0;
  const clickRate = totalSent! > 0 ? Math.round((totalClicks / totalSent!) * 100) : 0;

  return NextResponse.json({
    totalSent: totalSent ?? 0,
    totalOpens,
    uniqueOpens,
    totalClicks,
    openRate,
    clickRate,
    dailySends: Object.entries(dailyCounts).map(([date, count]) => ({ date, count })),
  });
}
