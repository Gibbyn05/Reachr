import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  let step = "init";
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2026-02-25.clover",
    });

    step = "supabase-client";
    const supabase = await createClient();

    step = "get-user";
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Ikke logget inn: " + (userError?.message ?? "ingen bruker") }, { status: 401 });
    }

    if (!user.email) {
      return NextResponse.json({ error: "Bruker mangler e-post" }, { status: 400 });
    }

    step = "supabase-lookup";
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("stripe_subscription_id, stripe_customer_id")
      .eq("user_id", user.id)
      .single();

    let subscriptionId = subscription?.stripe_subscription_id;

    if (!subscriptionId) {
      step = "stripe-customer-lookup";
      const customers = await stripe.customers.list({ email: user.email, limit: 1 });
      const customer = customers.data[0];

      if (!customer) {
        return NextResponse.json({ error: "Fant ikke kunde i Stripe for " + user.email }, { status: 404 });
      }

      step = "stripe-subscription-lookup";
      const [active, trialing] = await Promise.all([
        stripe.subscriptions.list({ customer: customer.id, status: "active", limit: 1 }),
        stripe.subscriptions.list({ customer: customer.id, status: "trialing", limit: 1 }),
      ]);

      subscriptionId = active.data[0]?.id ?? trialing.data[0]?.id;
    }

    if (!subscriptionId) {
      return NextResponse.json({ error: "Fant ikke aktivt abonnement i Stripe" }, { status: 404 });
    }

    step = "stripe-cancel";
    await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });

    step = "supabase-update";
    await supabase
      .from("subscriptions")
      .upsert({
        user_id: user.id,
        stripe_subscription_id: subscriptionId,
        status: "cancelling",
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`Stripe cancel error at step [${step}]:`, err);
    return NextResponse.json({ error: `[${step}] ${message}` }, { status: 500 });
  }
}
