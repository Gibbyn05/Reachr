import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

async function cancelSub(email: string) {
  const customers = await stripe.customers.list({ email, limit: 1 });
  if (!customers.data.length) {
    console.log("No customer found for", email);
    return;
  }
  const custId = customers.data[0].id;
  console.log("Found customer ID:", custId);
  const subs = await stripe.subscriptions.list({ customer: custId, status: "all" });
  if (!subs.data.length) {
    console.log("No subscriptions found for this customer");
    return;
  }
  for (const sub of subs.data) {
    if (sub.status !== 'canceled') {
      console.log("Canceling subscription:", sub.id, sub.status);
      await stripe.subscriptions.cancel(sub.id);
    } else {
      console.log("Subscription already canceled:", sub.id);
    }
  }
  console.log("Done.");
}

cancelSub('fredriik8+1@gmail.com').catch(console.error);
