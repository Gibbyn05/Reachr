-- Email sequences: defines the sequence template
CREATE TABLE IF NOT EXISTS email_sequences (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_email text NOT NULL,
  name text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Email sequence steps: each email in the sequence
CREATE TABLE IF NOT EXISTS email_sequence_steps (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  sequence_id uuid REFERENCES email_sequences(id) ON DELETE CASCADE,
  step_number int NOT NULL,
  delay_days int NOT NULL DEFAULT 0,
  subject text NOT NULL,
  body text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Email sequence enrollments: tracks which leads are enrolled
CREATE TABLE IF NOT EXISTS email_sequence_enrollments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  sequence_id uuid REFERENCES email_sequences(id) ON DELETE CASCADE,
  lead_id text NOT NULL,
  lead_name text,
  lead_email text,
  current_step int DEFAULT 1,
  next_send_at timestamptz,
  status text DEFAULT 'active', -- active | paused | completed | stopped
  enrolled_at timestamptz DEFAULT now(),
  enrolled_by text
);

-- RLS policies
ALTER TABLE email_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_sequence_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_sequence_enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sequences_owner" ON email_sequences
  USING (owner_email = auth.jwt() ->> 'email');

CREATE POLICY "steps_via_sequence" ON email_sequence_steps
  USING (sequence_id IN (
    SELECT id FROM email_sequences WHERE owner_email = auth.jwt() ->> 'email'
  ));

CREATE POLICY "enrollments_owner" ON email_sequence_enrollments
  USING (enrolled_by = auth.jwt() ->> 'email');
