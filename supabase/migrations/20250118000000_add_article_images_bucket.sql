-- Create storage bucket for article images
INSERT INTO storage.buckets (id, name, public)
VALUES ('article-images', 'article-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for article images
CREATE POLICY "Public Access to Article Images"
ON storage.objects FOR SELECT
USING (bucket_id = 'article-images');

CREATE POLICY "Authenticated Users Can Upload Article Images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'article-images');

CREATE POLICY "Users Can Update Their Own Article Images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'article-images');

CREATE POLICY "Users Can Delete Their Own Article Images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'article-images');

