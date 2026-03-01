-- Remove Perplexity logo images from existing article content and meta_description.
--
-- Covers both markdown-style images and HTML <img> tags whose src contains
-- "perplexity" or "r2cdn.perplexity.ai".

-- Clean meta_description: strip any <img ...> tag that contains "perplexity"
UPDATE articles
SET meta_description = regexp_replace(
  meta_description,
  '<img\s[^>]*perplexity[^>]*>',
  '',
  'gi'
)
WHERE meta_description ~* '<img\s[^>]*perplexity[^>]*>';

-- Clean content body: strip HTML img tags containing "perplexity"
UPDATE articles
SET content = regexp_replace(
  content,
  '<img\s[^>]*perplexity[^>]*>',
  '',
  'gi'
)
WHERE content ~* '<img\s[^>]*perplexity[^>]*>';

-- Clean content body: strip markdown images whose alt or URL contains "perplexity"
-- Pattern: ![anything containing perplexity](url) or ![alt](url containing perplexity)
UPDATE articles
SET content = regexp_replace(
  content,
  '!\[[^\]]*perplexity[^\]]*\]\([^\)]*\)',
  '',
  'gi'
)
WHERE content ~* '!\[[^\]]*perplexity[^\]]*\]\([^\)]*\)';

UPDATE articles
SET content = regexp_replace(
  content,
  '!\[[^\]]*\]\([^\)]*perplexity[^\)]*\)',
  '',
  'gi'
)
WHERE content ~* '!\[[^\]]*\]\([^\)]*perplexity[^\)]*\)';

-- Same cleanup for rag_documents
UPDATE rag_documents
SET content = regexp_replace(
  content,
  '<img\s[^>]*perplexity[^>]*>',
  '',
  'gi'
)
WHERE content ~* '<img\s[^>]*perplexity[^>]*>';

UPDATE rag_documents
SET content = regexp_replace(
  content,
  '!\[[^\]]*perplexity[^\]]*\]\([^\)]*\)',
  '',
  'gi'
)
WHERE content ~* '!\[[^\]]*perplexity[^\]]*\]\([^\)]*\)';

UPDATE rag_documents
SET content = regexp_replace(
  content,
  '!\[[^\]]*\]\([^\)]*perplexity[^\)]*\)',
  '',
  'gi'
)
WHERE content ~* '!\[[^\]]*\]\([^\)]*perplexity[^\)]*\)';
