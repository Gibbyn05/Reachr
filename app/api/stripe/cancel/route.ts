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

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("stripe_subscription_id")
    .eq("user_id", user.id)
    .single();

  if (!subscription?.stripe_subscription_id) {
    return NextResponse.json({ error: "Fant ikke abonnement" }, { status: 404 });
  }

  try {
    await stripe.subscriptions.update(subscription.stripe_subscription_id, {
      cancel_at_period_end: true,
    });

    await supabase
      .from("subscriptions")
      .update({ status: "cancelling", updated_at: new Date().toISOString() })
      .eq("user_id", user.id);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Stripe cancel error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
