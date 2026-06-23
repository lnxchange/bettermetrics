import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables must be set')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const fixSQL = `
CREATE OR REPLACE FUNCTION match_documents (
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 5,
  p_document_type text DEFAULT NULL
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
`

async function fix() {
  console.log('Fixing match_documents function...')
  
  const { data, error } = await supabase.rpc('exec_sql', { sql: fixSQL })
  
  if (error) {
    console.error('RPC exec_sql failed:', error.message)
    console.log('\nTrying alternative approach...')
    
    // The Supabase JS client doesn't support raw SQL execution
    // We need to use the Management API or run SQL via the dashboard
    console.log('\n=== MANUAL FIX REQUIRED ===')
    console.log('Please run the following SQL in the Supabase SQL Editor:')
    console.log('Go to: https://supabase.com/dashboard/project/mlwjklukwwaljtwysmna/sql/new')
    console.log('\n' + fixSQL)
    return
  }
  
  console.log('Success!')
}

fix()
