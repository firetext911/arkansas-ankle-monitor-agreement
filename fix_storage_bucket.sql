-- Fix Supabase Storage bucket and RLS policies for file uploads
-- Run this SQL in your Supabase SQL Editor

-- Create the storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'agreement-files',
  'agreement-files', 
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can upload files" ON storage.objects;
DROP POLICY IF EXISTS "Public can view files" ON storage.objects;
DROP POLICY IF EXISTS "Public can delete files" ON storage.objects;

-- Create RLS policies for the agreement-files bucket
CREATE POLICY "Public can upload files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'agreement-files');

CREATE POLICY "Public can view files" ON storage.objects
  FOR SELECT USING (bucket_id = 'agreement-files');

CREATE POLICY "Public can delete files" ON storage.objects
  FOR DELETE USING (bucket_id = 'agreement-files');

-- Also allow updates for file management
CREATE POLICY "Public can update files" ON storage.objects
  FOR UPDATE USING (bucket_id = 'agreement-files');
