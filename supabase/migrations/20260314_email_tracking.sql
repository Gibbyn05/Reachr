-- Tracking for emails sent
CREATE TABLE IF NOT EXISTS email_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email text NOT NULL,
  lead_id text,
  recipient_email text NOT NULL,
  subject text,
  sent_at timestamptz DEFAULT now(),
  sequence_id uuid REFERENCES email_sequences(id) ON DELETE SET NULL,
  step_id uuid REFERENCES email_sequence_steps(id) ON DELETE SET NULL
);

-- Events: Opens and Clicks
CREATE TABLE IF NOT EXISTS email_events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email_log_id uuid REFERENCES email_logs(id) ON DELETE CASCADE,
  event_type text NOT NULL, -- 'open', 'click'
  target_url text, -- for clicks
  user_agent text,
  ip_address text,
  occurred_at timestamptz DEFAULT now()
);

-- RLS
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_logs" ON email_logs
  USING (user_email = (auth.jwt() ->> 'email')::text);

CREATE POLICY "user_events" ON email_events
  USING (email_log_id IN (
    SELECT id FROM email_logs WHERE user_email = (auth.jwt() ->> 'email')::text
  ));
