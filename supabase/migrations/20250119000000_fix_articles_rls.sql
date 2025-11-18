-- Fix articles table RLS to allow reading all articles
-- This allows authenticated users to see all articles, not just their own

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view their own articles" ON articles;
DROP POLICY IF EXISTS "Users can insert their own articles" ON articles;
DROP POLICY IF EXISTS "Users can update their own articles" ON articles;
DROP POLICY IF EXISTS "Users can delete their own articles" ON articles;

-- Enable RLS
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read ALL articles (including those with NULL user_id)
CREATE POLICY "Authenticated users can view all articles"
ON articles FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated users to insert articles
CREATE POLICY "Authenticated users can insert articles"
ON articles FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update ALL articles
-- (You may want to restrict this to user_id = auth.uid() in production)
CREATE POLICY "Authenticated users can update all articles"
ON articles FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to delete ALL articles
-- (You may want to restrict this to user_id = auth.uid() in production)
CREATE POLICY "Authenticated users can delete all articles"
ON articles FOR DELETE
TO authenticated
USING (true);

-- Public can read published articles (for the /articles/[slug] pages)
CREATE POLICY "Public can view published articles"
ON articles FOR SELECT
TO anon
USING (status = 'published');

