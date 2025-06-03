-- Fix Media Deletion - Add missing media_urls column if it doesn't exist
-- Run this in your Supabase SQL Editor

-- Add media_urls column if it doesn't exist
ALTER TABLE games ADD COLUMN IF NOT EXISTS media_urls JSONB;

-- Create an index on media_urls for better performance
CREATE INDEX IF NOT EXISTS idx_games_media_urls ON games USING gin(media_urls);

-- Update existing games to have empty media_urls array if NULL
UPDATE games 
SET media_urls = '[]'::jsonb 
WHERE media_urls IS NULL;

-- Verify the column exists
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'games' 
AND column_name = 'media_urls';

-- Show sample of updated structure
SELECT id, title, 
       CASE WHEN icon_url IS NOT NULL THEN '✓' ELSE '✗' END as has_icon,
       CASE WHEN thumbnail_url IS NOT NULL THEN '✓' ELSE '✗' END as has_thumbnail,
       CASE WHEN primary_video_url IS NOT NULL THEN '✓' ELSE '✗' END as has_primary_video,
       CASE WHEN media_urls IS NOT NULL THEN jsonb_array_length(media_urls) ELSE 0 END as media_count
FROM games
LIMIT 5; 