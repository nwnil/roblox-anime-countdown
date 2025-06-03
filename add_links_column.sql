-- Add links column to games table
ALTER TABLE games ADD COLUMN IF NOT EXISTS links JSONB; 