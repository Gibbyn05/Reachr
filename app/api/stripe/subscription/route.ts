import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { isAdmin, isFreeUser } from "@/lib/admin";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Ikke logget inn" }, { status: 401 });
    }

    // Admin or VIP bypass — full access, no payment required
    if (isFreeUser(user.email)) {
      return NextResponse.json({
        subscription: {
          id: isAdmin(user.email) ? "admin" : "free_user",
          status: "active",
          plan: "team",
          interval: "yearly",
          current_period_end: "2099-01-01T00:00:00.000Z",
          cancel_at_period_end: false,
        },
      });
    }

    // Check Supabase subscriptions table first
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (!process.env.STRIPE_SECRET_KEY) {
      if (sub) return NextResponse.json({ subscription: sub });
      // Check team membership (metadata OR direct DB lookup)
      const metaOwner: string | undefined = user.user_metadata?.team_owner;
      const serviceClient = createServiceClient();
      const { data: mRow } = await serviceClient
        .from("team_members")
        .select("owner_email")
        .eq("member_email", user.email)
        .limit(1)
        .single();
      const ownerEmail = metaOwner ?? mRow?.owner_email ?? null;
      if (ownerEmail) {
        const { data: ownerSub } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_email", ownerEmail)
          .single();
        if (ownerSub) return NextResponse.json({ subscription: { ...ownerSub, via_team_owner: ownerEmail } });

        // Admin/VIP bypass for team members too
        if (isFreeUser(ownerEmail)) {
          return NextResponse.json({
            subscription: {
              id: isAdmin(ownerEmail) ? "admin_team_member" : "free_team_member",
              status: "active",
              plan: "team",
              interval: "yearly",
              current_period_end: "2099-01-01T00:00:00.000Z",
              cancel_at_period_end: false,
              via_team_owner: ownerEmail,
            },
          });
        }
      }
      return NextResponse.json({ subscription: null });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-02-25.clover",
    });

    /** Look up a Stripe subscription by email and return the first active/trialing one */
    async function getStripeSubForEmail(email: string) {
      const customers = await stripe.customers.list({ email, limit: 1 });
      const customer = customers.data[0];
      if (!customer) return null;
      const [active, trialing] = await Promise.all([
        stripe.subscriptions.list({ customer: customer.id, status: "active", limit: 1 }),
        stripe.subscriptions.list({ customer: customer.id, status: "trialing", limit: 1 }),
      ]);
      const stripeSub = active.data[0] ?? trialing.data[0] ?? null;
      if (!stripeSub) return null;
      return { stripeSub, customer };
    }

    // 1. Try the current user's own subscription
    const ownResult = await getStripeSubForEmail(user.email!);

    if (ownResult) {
      const { stripeSub, customer } = ownResult;
      return NextResponse.json({
        subscription: {
          id: stripeSub.id,
          status: stripeSub.status,
          plan: (stripeSub.metadata?.plan as string) ?? "solo",
          interval: (stripeSub.metadata?.interval as string) ?? "monthly",
          current_period_end: new Date((stripeSub as any).current_period_end * 1000).toISOString(),
          cancel_at_period_end: stripeSub.cancel_at_period_end,
          stripe_customer_id: customer.id,
        },
      });
    }

    // 2. Team member fallback — resolve owner email from two sources
    //    a) user_metadata.team_owner (set during invite-link registration)
    //    b) direct team_members table lookup (covers existing accounts added to a team)
    const metaOwnerEmail: string | undefined = user.user_metadata?.team_owner;

    // Direct DB lookup: find any team this user is a member of (service role bypasses RLS)
    const serviceClient = createServiceClient();
    const { data: memberRow } = await serviceClient
      .from("team_members")
      .select("owner_email")
      .eq("member_email", user.email)
      .limit(1)
      .single();

    const teamOwnerEmail = metaOwnerEmail ?? memberRow?.owner_email ?? null;

    if (teamOwnerEmail) {
      const ownerResult = await getStripeSubForEmail(teamOwnerEmail);
      if (ownerResult) {
        const { stripeSub, customer } = ownerResult;
        const plan = (stripeSub.metadata?.plan as string) ?? "team";
        return NextResponse.json({
          subscription: {
            id: stripeSub.id,
            status: stripeSub.status,
            plan,
            interval: (stripeSub.metadata?.interval as string) ?? "monthly",
            current_period_end: new Date((stripeSub as any).current_period_end * 1000).toISOString(),
            cancel_at_period_end: stripeSub.cancel_at_period_end,
            stripe_customer_id: customer.id,
            via_team_owner: teamOwnerEmail,
          },
        });
      }

      // Stripe not reachable / no Stripe sub — check Supabase subscriptions table for owner
      const { data: ownerSub } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_email", teamOwnerEmail)
        .single();
      if (ownerSub) {
        return NextResponse.json({ subscription: { ...ownerSub, via_team_owner: teamOwnerEmail } });
      }

      // Admin/VIP bypass for team members too
      if (isFreeUser(teamOwnerEmail)) {
        return NextResponse.json({
          subscription: {
            id: isAdmin(teamOwnerEmail) ? "admin_team_member" : "free_team_member",
            status: "active",
            plan: "team",
            interval: "yearly",
            current_period_end: "2099-01-01T00:00:00.000Z",
            cancel_at_period_end: false,
            via_team_owner: teamOwnerEmail,
          },
        });
      }
    }

    return NextResponse.json({ subscription: null });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Stripe subscription GET error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
