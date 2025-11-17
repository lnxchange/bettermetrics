-- Articles table for blog posts and content
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  author TEXT,
  category TEXT,
  tags TEXT[],
  featured_image_url TEXT,
  meta_title TEXT,
  meta_description TEXT,
  canonical_url TEXT,
  structured_data JSONB,
  status TEXT CHECK (status IN ('draft', 'scheduled', 'published')) DEFAULT 'draft',
  scheduled_publish_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  seo_optimized_at TIMESTAMPTZ,
  perplexity_request_id TEXT,
  view_count INTEGER DEFAULT 0,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Social posts table for tracking multi-platform distribution
CREATE TABLE IF NOT EXISTS social_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  platform TEXT CHECK (platform IN ('linkedin', 'facebook', 'x')) NOT NULL,
  post_text TEXT NOT NULL,
  status TEXT CHECK (status IN ('pending', 'posted', 'failed')) DEFAULT 'pending',
  external_post_id TEXT,
  posted_at TIMESTAMPTZ,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at);
CREATE INDEX IF NOT EXISTS idx_articles_user_id ON articles(user_id);
CREATE INDEX IF NOT EXISTS idx_social_posts_article_id ON social_posts(article_id);
CREATE INDEX IF NOT EXISTS idx_social_posts_status ON social_posts(status);
CREATE INDEX IF NOT EXISTS idx_social_posts_platform ON social_posts(platform);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_posts_updated_at BEFORE UPDATE ON social_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;

-- Articles policies
-- Public can read published articles
CREATE POLICY "Public can view published articles"
  ON articles FOR SELECT
  TO public
  USING (status = 'published');

-- Authenticated users can view their own articles regardless of status
CREATE POLICY "Users can view own articles"
  ON articles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Authenticated users can create articles
CREATE POLICY "Users can create articles"
  ON articles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Authenticated users can update their own articles
CREATE POLICY "Users can update own articles"
  ON articles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Authenticated users can delete their own articles
CREATE POLICY "Users can delete own articles"
  ON articles FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Social posts policies
-- Users can view social posts for their articles
CREATE POLICY "Users can view social posts for own articles"
  ON social_posts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM articles
      WHERE articles.id = social_posts.article_id
      AND articles.user_id = auth.uid()
    )
  );

-- Users can insert social posts for their articles
CREATE POLICY "Users can create social posts for own articles"
  ON social_posts FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM articles
      WHERE articles.id = social_posts.article_id
      AND articles.user_id = auth.uid()
    )
  );

-- Users can update social posts for their articles
CREATE POLICY "Users can update social posts for own articles"
  ON social_posts FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM articles
      WHERE articles.id = social_posts.article_id
      AND articles.user_id = auth.uid()
    )
  );

-- Users can delete social posts for their articles
CREATE POLICY "Users can delete social posts for own articles"
  ON social_posts FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM articles
      WHERE articles.id = social_posts.article_id
      AND articles.user_id = auth.uid()
    )
  );

-- Function to generate slug from title
CREATE OR REPLACE FUNCTION generate_slug(title TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(regexp_replace(regexp_replace(trim(title), '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'));
END;
$$ LANGUAGE plpgsql;

-- Comment descriptions
COMMENT ON TABLE articles IS 'Stores blog articles and content with SEO metadata';
COMMENT ON TABLE social_posts IS 'Tracks social media distribution status for articles';
COMMENT ON COLUMN articles.status IS 'Article status: draft, scheduled, or published';
COMMENT ON COLUMN articles.structured_data IS 'JSON-LD structured data for SEO';
COMMENT ON COLUMN social_posts.platform IS 'Social media platform: linkedin, facebook, or x';
COMMENT ON COLUMN social_posts.status IS 'Post status: pending, posted, or failed';

