-- Storage buckets setup for file uploads
-- Run this in your Supabase SQL Editor to create the necessary storage buckets

-- Create images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true);

-- Create videos bucket  
INSERT INTO storage.buckets (id, name, public)
VALUES ('videos', 'videos', true);

-- Set up storage policies for images bucket
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update images"
ON storage.objects FOR UPDATE
WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete images"
ON storage.objects FOR DELETE
USING (bucket_id = 'images' AND auth.role() = 'authenticated');

-- Set up storage policies for videos bucket
CREATE POLICY "Public Access Videos"
ON storage.objects FOR SELECT
USING (bucket_id = 'videos');

CREATE POLICY "Authenticated users can upload videos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'videos' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update videos"
ON storage.objects FOR UPDATE
WITH CHECK (bucket_id = 'videos' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete videos"
ON storage.objects FOR DELETE
USING (bucket_id = 'videos' AND auth.role() = 'authenticated');

-- Add icon_url column to games table
ALTER TABLE games ADD COLUMN IF NOT EXISTS icon_url TEXT;

-- Add media_urls column to games table to store all images and videos
ALTER TABLE games ADD COLUMN IF NOT EXISTS media_urls JSONB; 