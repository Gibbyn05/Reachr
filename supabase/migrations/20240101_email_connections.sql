-- Email OAuth connections per user
CREATE TABLE IF NOT EXISTS email_connections (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email text NOT NULL,
  provider text NOT NULL,          -- 'gmail' | 'outlook'
  email_address text NOT NULL,
  access_token text NOT NULL,
  refresh_token text,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_email, provider)
);

ALTER TABLE email_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own email connections"
  ON email_connections
  FOR ALL
  USING (user_email = auth.jwt() ->> 'email')
  WITH CHECK (user_email = auth.jwt() ->> 'email');
