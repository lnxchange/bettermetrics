-- Fix ambiguous column reference in match_documents function
-- The parameter 'document_type' conflicts with the column name 'document_type'
-- PostgreSQL error 42702: column reference "document_type" is ambiguous

-- Must drop the function first because we're changing parameter names
DROP FUNCTION IF EXISTS match_documents(vector(1536), float, int, text);

-- Recreate the function with renamed parameter
CREATE FUNCTION match_documents (
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 5,
  p_document_type text DEFAULT NULL  -- Renamed from 'document_type' to avoid ambiguity
)
RETURNS TABLE (
  chunk_text text,
  metadata jsonb,
  document_id uuid,
  chunk_index int,
  similarity_score float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    de.chunk_text,
    de.metadata,
    de.document_id,
    de.chunk_index,
    1 - (de.embedding <=> query_embedding) as similarity_score
  FROM document_embeddings de
  WHERE 
    (p_document_type IS NULL OR de.document_type = p_document_type)
    AND 1 - (de.embedding <=> query_embedding) > match_threshold
  ORDER BY de.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
