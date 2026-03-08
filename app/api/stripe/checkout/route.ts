import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Admin bypass — skip Stripe entirely
  if (isAdmin(user?.email)) {
    return NextResponse.json({ url: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding?payment=success` });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-02-25.clover",
  });

  const PRICE_IDS: Record<string, string> = {
    solo_monthly: process.env.STRIPE_PRICE_SOLO_MONTHLY!,
    solo_yearly: process.env.STRIPE_PRICE_SOLO_YEARLY!,
    team_monthly: process.env.STRIPE_PRICE_TEAM_MONTHLY!,
    team_yearly: process.env.STRIPE_PRICE_TEAM_YEARLY!,
  };

  try {
    const { plan, interval } = await req.json();

    const priceKey = `${plan}_${interval}`;
    const priceId = PRICE_IDS[priceKey];

    if (!priceId) {
      return NextResponse.json({ error: "Ugyldig plan" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding/betaling`,
      ...(user?.email && { customer_email: user.email }),
      metadata: {
        plan,
        interval,
        ...(user?.id && { userId: user.id }),
      },
      subscription_data: {
        trial_period_days: 3,
        metadata: {
          plan,
          ...(user?.id && { userId: user.id }),
        },
      },
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
