-- Source filter for chat retrieval.
-- The default is the Treatise, so an existing chat deployment that does not
-- pass p_source still excludes the older corpus. Pass p_source NULL to search
-- every stored document. The older documents stay in the database.

DROP FUNCTION IF EXISTS public.match_documents(vector, double precision, integer, text);
DROP FUNCTION IF EXISTS public.match_documents(vector(1536), double precision, integer, text);
DROP FUNCTION IF EXISTS public.match_documents(vector, double precision, integer, text, text);

CREATE FUNCTION public.match_documents(
  query_embedding vector,
  match_threshold double precision DEFAULT 0.7,
  match_count integer DEFAULT 5,
  p_document_type text DEFAULT NULL,
  p_source text DEFAULT 'aim-treatise'
)
RETURNS TABLE (
  chunk_text text,
  metadata jsonb,
  document_id uuid,
  chunk_index integer,
  similarity_score double precision
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
    AND (
      p_source IS NULL
      OR EXISTS (
        SELECT 1
        FROM rag_documents rd
        WHERE rd.id = de.document_id
          AND rd.metadata->>'source' = p_source
      )
    )
    AND de.embedding IS NOT NULL
    AND 1 - (de.embedding <=> query_embedding) > match_threshold
  ORDER BY de.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

GRANT EXECUTE ON FUNCTION public.match_documents(vector, double precision, integer, text, text)
  TO PUBLIC, anon, authenticated, service_role;
