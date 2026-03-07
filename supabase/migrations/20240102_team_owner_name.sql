-- Add owner_name column to team_members so members can see the owner's display name
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS owner_name TEXT NOT NULL DEFAULT '';
