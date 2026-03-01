-- Fix embedding dimension mismatch.
--
-- The document_embeddings table was created with VECTOR(1536) for
-- text-embedding-ada-002, but document-processor.ts and vector-search.ts
-- both use text-embedding-3-large (default 3072 dims). pgvector's ivfflat
-- index supports max 2000 dimensions, so we use text-embedding-3-large with
-- dimensions=1536. App code updated to pass dimensions: 1536.
--
-- Since all existing embeddings were generated (or attempted) with the wrong
-- model/dimension they are invalid. Truncate and rebuild from scratch.

-- 1. Drop the ivfflat index (required before altering column type)
DROP INDEX IF EXISTS idx_document_embeddings_vector;

-- 2. Drop both versions of the match_documents function
DROP FUNCTION IF EXISTS match_documents(vector(1536), float, int, text);
DROP FUNCTION IF EXISTS match_documents(vector(3072), float, int, text);

-- 3. Truncate the table — all stored embeddings are invalid (wrong dimensions)
TRUNCATE TABLE document_embeddings;

-- 4. Ensure embedding column is VECTOR(1536) (fits pgvector index limit of 2000)
ALTER TABLE document_embeddings DROP COLUMN IF EXISTS embedding;
ALTER TABLE document_embeddings ADD COLUMN embedding VECTOR(1536);

-- 5. Recreate the vector similarity index
CREATE INDEX idx_document_embeddings_vector
  ON document_embeddings USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- 6. Recreate match_documents with 1536-dim vectors
CREATE FUNCTION match_documents (
  query_embedding  vector(1536),
  match_threshold  float   DEFAULT 0.7,
  match_count      int     DEFAULT 5,
  p_document_type  text    DEFAULT NULL
)
RETURNS TABLE (
  chunk_text       text,
  metadata         jsonb,
  document_id      uuid,
  chunk_index      int,
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
    1 - (de.embedding <=> query_embedding) AS similarity_score
  FROM document_embeddings de
  WHERE
    (p_document_type IS NULL OR de.document_type = p_document_type)
    AND 1 - (de.embedding <=> query_embedding) > match_threshold
  ORDER BY de.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
