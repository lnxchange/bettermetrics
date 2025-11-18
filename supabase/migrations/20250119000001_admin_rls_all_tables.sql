-- Apply admin-only RLS policies to all admin tables
-- This ensures only admins can access admin panel features

-- Social Posts Table
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view all social posts" ON social_posts;
DROP POLICY IF EXISTS "Admins can insert social posts" ON social_posts;
DROP POLICY IF EXISTS "Admins can update social posts" ON social_posts;
DROP POLICY IF EXISTS "Admins can delete social posts" ON social_posts;

CREATE POLICY "Admins can view all social posts"
ON social_posts FOR SELECT
TO authenticated
USING (is_admin());

CREATE POLICY "Admins can insert social posts"
ON social_posts FOR INSERT
TO authenticated
WITH CHECK (is_admin());

CREATE POLICY "Admins can update social posts"
ON social_posts FOR UPDATE
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Admins can delete social posts"
ON social_posts FOR DELETE
TO authenticated
USING (is_admin());

-- RAG Documents Table (if exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'rag_documents') THEN
    ALTER TABLE rag_documents ENABLE ROW LEVEL SECURITY;
    
    DROP POLICY IF EXISTS "Admins can view all rag documents" ON rag_documents;
    DROP POLICY IF EXISTS "Admins can insert rag documents" ON rag_documents;
    DROP POLICY IF EXISTS "Admins can update rag documents" ON rag_documents;
    DROP POLICY IF EXISTS "Admins can delete rag documents" ON rag_documents;
    
    EXECUTE 'CREATE POLICY "Admins can view all rag documents"
    ON rag_documents FOR SELECT
    TO authenticated
    USING (is_admin())';
    
    EXECUTE 'CREATE POLICY "Admins can insert rag documents"
    ON rag_documents FOR INSERT
    TO authenticated
    WITH CHECK (is_admin())';
    
    EXECUTE 'CREATE POLICY "Admins can update rag documents"
    ON rag_documents FOR UPDATE
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin())';
    
    EXECUTE 'CREATE POLICY "Admins can delete rag documents"
    ON rag_documents FOR DELETE
    TO authenticated
    USING (is_admin())';
  END IF;
END $$;

-- RAG Chunks Table (if exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'rag_chunks') THEN
    ALTER TABLE rag_chunks ENABLE ROW LEVEL SECURITY;
    
    DROP POLICY IF EXISTS "Admins can view all rag chunks" ON rag_chunks;
    DROP POLICY IF EXISTS "Admins can insert rag chunks" ON rag_chunks;
    DROP POLICY IF EXISTS "Admins can update rag chunks" ON rag_chunks;
    DROP POLICY IF EXISTS "Admins can delete rag chunks" ON rag_chunks;
    
    EXECUTE 'CREATE POLICY "Admins can view all rag chunks"
    ON rag_chunks FOR SELECT
    TO authenticated
    USING (is_admin())';
    
    EXECUTE 'CREATE POLICY "Admins can insert rag chunks"
    ON rag_chunks FOR INSERT
    TO authenticated
    WITH CHECK (is_admin())';
    
    EXECUTE 'CREATE POLICY "Admins can update rag chunks"
    ON rag_chunks FOR UPDATE
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin())';
    
    EXECUTE 'CREATE POLICY "Admins can delete rag chunks"
    ON rag_chunks FOR DELETE
    TO authenticated
    USING (is_admin())';
  END IF;
END $$;

-- Research Documents Table (if exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'research_documents') THEN
    ALTER TABLE research_documents ENABLE ROW LEVEL SECURITY;
    
    DROP POLICY IF EXISTS "Admins can view all research documents" ON research_documents;
    DROP POLICY IF EXISTS "Admins can insert research documents" ON research_documents;
    DROP POLICY IF EXISTS "Admins can update research documents" ON research_documents;
    DROP POLICY IF EXISTS "Admins can delete research documents" ON research_documents;
    
    EXECUTE 'CREATE POLICY "Admins can view all research documents"
    ON research_documents FOR SELECT
    TO authenticated
    USING (is_admin())';
    
    EXECUTE 'CREATE POLICY "Admins can insert research documents"
    ON research_documents FOR INSERT
    TO authenticated
    WITH CHECK (is_admin())';
    
    EXECUTE 'CREATE POLICY "Admins can update research documents"
    ON research_documents FOR UPDATE
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin())';
    
    EXECUTE 'CREATE POLICY "Admins can delete research documents"
    ON research_documents FOR DELETE
    TO authenticated
    USING (is_admin())';
  END IF;
END $$;

-- Note: Chats table should allow users to manage their own chats
-- We'll handle that separately if needed

