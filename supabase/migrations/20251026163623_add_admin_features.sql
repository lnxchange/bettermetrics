-- Enable pgvector extension for vector similarity search
CREATE EXTENSION IF NOT EXISTS vector;

-- Create storage buckets for document uploads
INSERT INTO storage.buckets (id, name, public) VALUES 
('research-documents', 'research-documents', true),
('rag-documents', 'rag-documents', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for research-documents bucket
CREATE POLICY "Allow public read access to research documents" ON storage.objects
    FOR SELECT USING (bucket_id = 'research-documents');

CREATE POLICY "Allow admin upload to research documents" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'research-documents' AND
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND (auth.users.raw_user_meta_data->>'is_admin')::boolean = true
        )
    );

CREATE POLICY "Allow admin update to research documents" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'research-documents' AND
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND (auth.users.raw_user_meta_data->>'is_admin')::boolean = true
        )
    );

CREATE POLICY "Allow admin delete from research documents" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'research-documents' AND
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND (auth.users.raw_user_meta_data->>'is_admin')::boolean = true
        )
    );

-- Storage policies for rag-documents bucket
CREATE POLICY "Allow public read access to rag documents" ON storage.objects
    FOR SELECT USING (bucket_id = 'rag-documents');

CREATE POLICY "Allow admin upload to rag documents" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'rag-documents' AND
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND (auth.users.raw_user_meta_data->>'is_admin')::boolean = true
        )
    );

CREATE POLICY "Allow admin update to rag documents" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'rag-documents' AND
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND (auth.users.raw_user_meta_data->>'is_admin')::boolean = true
        )
    );

CREATE POLICY "Allow admin delete from rag documents" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'rag-documents' AND
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND (auth.users.raw_user_meta_data->>'is_admin')::boolean = true
        )
    );

-- Create research_documents table for managing research documents
CREATE TABLE research_documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size BIGINT,
    uploaded_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create rag_documents table for documents used in RAG system
CREATE TABLE rag_documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT,
    file_url TEXT,
    file_type TEXT,
    metadata JSONB DEFAULT '{}',
    uploaded_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create document_embeddings table for storing vector embeddings
CREATE TABLE document_embeddings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    document_id UUID NOT NULL,
    document_type TEXT NOT NULL CHECK (document_type IN ('research', 'rag')),
    chunk_text TEXT NOT NULL,
    embedding VECTOR(1536), -- OpenAI text-embedding-ada-002 dimensions
    chunk_index INTEGER NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_research_documents_uploaded_by ON research_documents(uploaded_by);
CREATE INDEX idx_rag_documents_uploaded_by ON rag_documents(uploaded_by);
CREATE INDEX idx_document_embeddings_document_id ON document_embeddings(document_id);
CREATE INDEX idx_document_embeddings_document_type ON document_embeddings(document_type);
CREATE INDEX idx_document_embeddings_vector ON document_embeddings USING ivfflat (embedding vector_cosine_ops);

-- Enable Row Level Security
ALTER TABLE research_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE rag_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_embeddings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for research_documents
CREATE POLICY "Allow public read access to research documents" ON research_documents
    FOR SELECT USING (true);

CREATE POLICY "Allow admin write access to research documents" ON research_documents
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND (auth.users.raw_user_meta_data->>'is_admin')::boolean = true
        )
    );

-- RLS Policies for rag_documents
CREATE POLICY "Allow public read access to rag documents" ON rag_documents
    FOR SELECT USING (true);

CREATE POLICY "Allow admin write access to rag documents" ON rag_documents
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND (auth.users.raw_user_meta_data->>'is_admin')::boolean = true
        )
    );

-- RLS Policies for document_embeddings
CREATE POLICY "Allow public read access to document embeddings" ON document_embeddings
    FOR SELECT USING (true);

CREATE POLICY "Allow admin write access to document embeddings" ON document_embeddings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND (auth.users.raw_user_meta_data->>'is_admin')::boolean = true
        )
    );

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_research_documents_updated_at 
    BEFORE UPDATE ON research_documents 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rag_documents_updated_at 
    BEFORE UPDATE ON rag_documents 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function for vector similarity search
CREATE OR REPLACE FUNCTION match_documents (
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 5,
  document_type text DEFAULT NULL
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
    (document_type IS NULL OR de.document_type = document_type)
    AND 1 - (de.embedding <=> query_embedding) > match_threshold
  ORDER BY de.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
