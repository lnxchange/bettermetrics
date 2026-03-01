-- Add written_at column to articles to track when the article was originally written
-- This is distinct from published_at (when it went live on the site) and
-- created_at (when the record was first inserted).
-- Defaults to created_at for existing rows so existing articles are not broken.
ALTER TABLE articles
  ADD COLUMN IF NOT EXISTS written_at TIMESTAMPTZ;

UPDATE articles
  SET written_at = created_at
  WHERE written_at IS NULL;
