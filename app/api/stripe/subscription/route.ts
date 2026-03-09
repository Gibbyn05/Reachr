import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Ikke logget inn" }, { status: 401 });
    }

    // Admin bypass — full access, no payment required
    if (isAdmin(user.email)) {
      return NextResponse.json({
        subscription: {
          id: "admin",
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
      // No Stripe configured — check own sub, then team owner's sub
      if (sub) return NextResponse.json({ subscription: sub });
      const teamOwnerEmail: string | undefined = user.user_metadata?.team_owner;
      if (teamOwnerEmail) {
        const { data: ownerSub } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_email", teamOwnerEmail)
          .single();
        if (ownerSub) return NextResponse.json({ subscription: { ...ownerSub, via_team_owner: teamOwnerEmail } });
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

    // 2. Team member fallback — check owner's subscription
    const teamOwnerEmail: string | undefined = user.user_metadata?.team_owner;
    if (teamOwnerEmail) {
      // Verify this user is an active member of that team
      const { data: membership } = await supabase
        .from("team_members")
        .select("status")
        .eq("owner_email", teamOwnerEmail)
        .eq("member_email", user.email)
        .single();

      if (membership) {
        const ownerResult = await getStripeSubForEmail(teamOwnerEmail);
        if (ownerResult) {
          const { stripeSub, customer } = ownerResult;
          // Only team plan covers multiple users
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

        // Owner exists in team table but Stripe not configured / no sub found —
        // also check Supabase subscriptions table for owner
        const { data: ownerSub } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_email", teamOwnerEmail)
          .single();
        if (ownerSub) {
          return NextResponse.json({ subscription: { ...ownerSub, via_team_owner: teamOwnerEmail } });
        }
      }
    }

    return NextResponse.json({ subscription: null });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Stripe subscription GET error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
