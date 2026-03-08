import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-02-25.clover",
  });

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Ikke logget inn" }, { status: 401 });
  }

  try {
    // Prøv å hente subscription_id fra Supabase først
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("stripe_subscription_id, stripe_customer_id")
      .eq("user_id", user.id)
      .single();

    let subscriptionId = subscription?.stripe_subscription_id;

    // Fallback: finn via Stripe customer-søk på e-post
    if (!subscriptionId) {
      const customers = await stripe.customers.list({ email: user.email!, limit: 1 });
      const customer = customers.data[0];

      if (!customer) {
        return NextResponse.json({ error: "Fant ikke kunde i Stripe" }, { status: 404 });
      }

      const subscriptions = await stripe.subscriptions.list({
        customer: customer.id,
        status: "active",
        limit: 1,
      });

      // Også sjekk trialing
      if (subscriptions.data.length === 0) {
        const trialing = await stripe.subscriptions.list({
          customer: customer.id,
          status: "trialing",
          limit: 1,
        });
        subscriptionId = trialing.data[0]?.id;
      } else {
        subscriptionId = subscriptions.data[0]?.id;
      }
    }

    if (!subscriptionId) {
      return NextResponse.json({ error: "Fant ikke aktivt abonnement" }, { status: 404 });
    }

    // Kanseller ved slutten av perioden
    await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });

    // Oppdater Supabase
    await supabase
      .from("subscriptions")
      .upsert({
        user_id: user.id,
        stripe_subscription_id: subscriptionId,
        status: "cancelling",
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Stripe cancel error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
