import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Ikke logget inn" }, { status: 401 });
    }

    // Check Supabase subscriptions table first
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (!process.env.STRIPE_SECRET_KEY) {
      // No Stripe configured — return whatever is in Supabase (or none)
      return NextResponse.json({ subscription: sub ?? null });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-02-25.clover",
    });

    // Try to look up customer in Stripe by email
    const customers = await stripe.customers.list({ email: user.email!, limit: 1 });
    const customer = customers.data[0];

    if (!customer) {
      return NextResponse.json({ subscription: null });
    }

    // Get active or trialing subscription
    const [active, trialing] = await Promise.all([
      stripe.subscriptions.list({ customer: customer.id, status: "active", limit: 1 }),
      stripe.subscriptions.list({ customer: customer.id, status: "trialing", limit: 1 }),
    ]);

    const stripeSub = active.data[0] ?? trialing.data[0] ?? null;

    if (!stripeSub) {
      return NextResponse.json({ subscription: null });
    }

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
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Stripe subscription GET error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
