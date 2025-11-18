-- Fix articles table RLS to give admins full access
-- Admins have full CRUD access to all articles
-- Public can read published articles

-- Create helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if user has is_admin = true in auth.users metadata
  RETURN (
    SELECT COALESCE(
      (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean,
      false
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view their own articles" ON articles;
DROP POLICY IF EXISTS "Users can insert their own articles" ON articles;
DROP POLICY IF EXISTS "Users can update their own articles" ON articles;
DROP POLICY IF EXISTS "Users can delete their own articles" ON articles;
DROP POLICY IF EXISTS "Authenticated users can view all articles" ON articles;
DROP POLICY IF EXISTS "Authenticated users can insert articles" ON articles;
DROP POLICY IF EXISTS "Authenticated users can update all articles" ON articles;
DROP POLICY IF EXISTS "Authenticated users can delete all articles" ON articles;
DROP POLICY IF EXISTS "Public can view published articles" ON articles;

-- Enable RLS
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Admins can read ALL articles (drafts and published)
CREATE POLICY "Admins can view all articles"
ON articles FOR SELECT
TO authenticated
USING (is_admin());

-- Admins can insert articles
CREATE POLICY "Admins can insert articles"
ON articles FOR INSERT
TO authenticated
WITH CHECK (is_admin());

-- Admins can update ALL articles
CREATE POLICY "Admins can update all articles"
ON articles FOR UPDATE
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- Admins can delete ALL articles
CREATE POLICY "Admins can delete all articles"
ON articles FOR DELETE
TO authenticated
USING (is_admin());

-- Public (non-authenticated) can read published articles only
CREATE POLICY "Public can view published articles"
ON articles FOR SELECT
TO anon
USING (status = 'published');

-- Regular authenticated users can read published articles
CREATE POLICY "Authenticated users can view published articles"
ON articles FOR SELECT
TO authenticated
USING (status = 'published' AND NOT is_admin());

