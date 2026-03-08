import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import Stripe from "stripe";
import { isAdmin } from "@/lib/admin";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!isAdmin(user?.email)) {
    return NextResponse.json({ error: "Ingen tilgang" }, { status: 403 });
  }

  // Use service role key to access auth.users
  const adminClient = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: { users: authUsers }, error } = await adminClient.auth.admin.listUsers({ perPage: 1000 });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Get lead counts per email from leads table
  const { data: leads } = await adminClient.from("leads").select("added_by");
  const leadCountMap: Record<string, number> = {};
  for (const l of leads ?? []) {
    if (l.added_by) leadCountMap[l.added_by] = (leadCountMap[l.added_by] ?? 0) + 1;
  }

  // Get team_members to find team owners
  const { data: teamMembers } = await adminClient.from("team_members").select("owner_email, member_email, status");
  const teamMap: Record<string, number> = {};
  for (const t of teamMembers ?? []) {
    if (t.status === "active") teamMap[t.owner_email] = (teamMap[t.owner_email] ?? 0) + 1;
  }

  // Get Stripe subscriptions if configured
  const stripeSubMap: Record<string, { plan: string; status: string; interval: string; trialEnd: string | null }> = {};
  if (process.env.STRIPE_SECRET_KEY) {
    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2026-02-25.clover" });
      const subs = await stripe.subscriptions.list({ limit: 100, expand: ["data.customer"] });
      for (const sub of subs.data) {
        const customer = sub.customer as Stripe.Customer;
        if (customer.email) {
          stripeSubMap[customer.email] = {
            plan: (sub.metadata?.plan as string) ?? "solo",
            status: sub.status,
            interval: (sub.metadata?.interval as string) ?? "monthly",
            trialEnd: sub.trial_end ? new Date(sub.trial_end * 1000).toISOString() : null,
          };
        }
      }
    } catch { /* stripe not configured */ }
  }

  const users = (authUsers ?? []).map(u => ({
    id: u.id,
    email: u.email ?? "",
    name: u.user_metadata?.full_name ?? u.email ?? "",
    company: u.user_metadata?.company ?? "",
    createdAt: u.created_at,
    lastSignIn: u.last_sign_in_at ?? null,
    emailConfirmed: !!u.email_confirmed_at,
    leadCount: leadCountMap[u.email ?? ""] ?? 0,
    teamSize: teamMap[u.email ?? ""] ?? 0,
    isAdmin: isAdmin(u.email),
    subscription: stripeSubMap[u.email ?? ""] ?? null,
  }));

  const mrr = Object.values(stripeSubMap)
    .filter(s => s.status === "active" || s.status === "trialing")
    .reduce((sum, s) => {
      const monthly = s.plan === "solo" ? 249 : 199;
      return sum + (s.interval === "yearly" ? Math.round(monthly * 10 / 12) : monthly);
    }, 0);

  return NextResponse.json({ users, mrr });
}
