-- Add new columns for approximate release dates
ALTER TABLE games 
ADD COLUMN has_exact_date BOOLEAN DEFAULT true,
ADD COLUMN approximate_release_text TEXT;

-- Add comments to explain the new columns
COMMENT ON COLUMN games.has_exact_date IS 'Whether the release date is exact (true) or approximate (false)';
COMMENT ON COLUMN games.approximate_release_text IS 'Text description for approximate release dates like "July 2025", "Q2 2025", etc.'; 