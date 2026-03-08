-- Subscriptions table — oppdateres av Stripe webhook
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan text NOT NULL,                          -- 'solo' | 'team'
  status text NOT NULL DEFAULT 'active',       -- 'active' | 'cancelled' | 'past_due' | 'trialing'
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Brukeren kan lese sin egen subscription
CREATE POLICY "Users read own subscription"
  ON subscriptions
  FOR SELECT
  USING (user_id = auth.uid());

-- Bare service_role (webhook) kan skrive
CREATE POLICY "Service role manages subscriptions"
  ON subscriptions
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
