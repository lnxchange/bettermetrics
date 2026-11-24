-- Publishing engine columns. Existing rows stay legacy and keep their status.
-- Corpus articles are public only when approved, due, and on or after go-live.
-- The March 2026 articles stay public until legacy_retirement is on, and that
-- flag does nothing before go_live_at. Nothing here deletes a row.

ALTER TABLE articles
  ADD COLUMN IF NOT EXISTS pipeline text NOT NULL DEFAULT 'legacy',
  ADD COLUMN IF NOT EXISTS editorial_status text,
  ADD COLUMN IF NOT EXISTS preview_only boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS source_papers text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS treatise_refs text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS replaces_slugs text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS feature_image text,
  ADD COLUMN IF NOT EXISTS image_alt text,
  ADD COLUMN IF NOT EXISTS content_hash text,
  ADD COLUMN IF NOT EXISTS x_post_status text,
  ADD COLUMN IF NOT EXISTS x_post_detail text;

ALTER TABLE articles DROP CONSTRAINT IF EXISTS articles_pipeline_check;
ALTER TABLE articles ADD CONSTRAINT articles_pipeline_check
  CHECK (pipeline IN ('legacy', 'corpus'));

ALTER TABLE articles DROP CONSTRAINT IF EXISTS articles_editorial_status_check;
ALTER TABLE articles ADD CONSTRAINT articles_editorial_status_check
  CHECK (editorial_status IS NULL OR editorial_status IN ('draft', 'approved', 'retired'));

ALTER TABLE articles DROP CONSTRAINT IF EXISTS articles_x_post_status_check;
ALTER TABLE articles ADD CONSTRAINT articles_x_post_status_check
  CHECK (x_post_status IS NULL OR x_post_status IN ('posted', 'skipped', 'failed'));

ALTER TABLE articles DROP CONSTRAINT IF EXISTS articles_x_post_detail_length;
ALTER TABLE articles ADD CONSTRAINT articles_x_post_detail_length
  CHECK (x_post_detail IS NULL OR char_length(x_post_detail) <= 200);

CREATE INDEX IF NOT EXISTS idx_articles_corpus_schedule
  ON articles (scheduled_publish_at)
  WHERE pipeline = 'corpus';

CREATE TABLE IF NOT EXISTS publishing_settings (
  id integer PRIMARY KEY CHECK (id = 1),
  go_live_at timestamptz NOT NULL DEFAULT '2027-01-11 00:00:00+11',
  publishing_paused boolean NOT NULL DEFAULT false,
  legacy_retirement boolean NOT NULL DEFAULT false,
  syndication_enabled boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO publishing_settings (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE publishing_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read publishing settings" ON publishing_settings;
CREATE POLICY "Anyone can read publishing settings"
  ON publishing_settings FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins can update publishing settings" ON publishing_settings;
CREATE POLICY "Admins can update publishing settings"
  ON publishing_settings FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE OR REPLACE FUNCTION public.article_is_public(item public.articles)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    COALESCE(item.preview_only, false) = false
    AND (
      CASE
        WHEN COALESCE(item.pipeline, 'legacy') <> 'corpus' THEN
          item.status = 'published'
          AND NOT EXISTS (
            SELECT 1
            FROM public.publishing_settings AS settings
            WHERE settings.id = 1
              AND settings.legacy_retirement
              AND now() >= settings.go_live_at
          )
        ELSE
          item.editorial_status = 'approved'
          AND item.scheduled_publish_at IS NOT NULL
          AND item.scheduled_publish_at <= now()
          AND EXISTS (
            SELECT 1
            FROM public.publishing_settings AS settings
            WHERE settings.id = 1
              AND now() >= settings.go_live_at
              AND settings.publishing_paused = false
          )
      END
    );
$$;

DROP POLICY IF EXISTS "Public can view published articles" ON articles;
CREATE POLICY "Public can view published articles"
  ON articles FOR SELECT
  TO anon
  USING (public.article_is_public(articles));

DROP POLICY IF EXISTS "Authenticated users can view published articles" ON articles;
CREATE POLICY "Authenticated users can view published articles"
  ON articles FOR SELECT
  TO authenticated
  USING (public.article_is_public(articles) AND NOT public.is_admin());

COMMENT ON COLUMN articles.scheduled_publish_at IS 'Melbourne Monday, Wednesday or Friday 7:00am slot for a corpus article.';
COMMENT ON COLUMN articles.editorial_status IS 'Writer status from the article file: draft, approved or retired.';
COMMENT ON COLUMN articles.preview_only IS 'Test rows. Never public, and they do not take a publishing slot.';
COMMENT ON TABLE publishing_settings IS 'Go-live, kill switch, legacy retirement and syndication. Env vars override these.';

-- Two test articles. Preview only, draft in the publication column, so the
-- public policies cannot return them even if a status flag is flipped later.
INSERT INTO articles (
  title, slug, content, author, tags, featured_image_url, feature_image, image_alt,
  meta_description, status, editorial_status, pipeline, preview_only,
  source_papers, treatise_refs, replaces_slugs
)
VALUES
(
  'TEST Preview: Appetites on a quiet morning',
  'preview-test-appetites',
  $preview_appetites$This page is a test of the article preview. It is not part of the series, and it must not be published.

An Appetite is the pull of something the body already wants. Mimetic Desire is the pull of something because someone else wants it. The two are different, and the treatise keeps them apart.

A reader can meet both in one sentence and still follow the link to the glossary. The weight on each source can sit in a line of mathematics, $w_A + w_I + w_M = 1$.

Nothing on this page should appear in the public list, the sitemap, or the feed.$preview_appetites$,
  'Yule Guttenbeil',
  ARRAY['test', 'preview'],
  '/aim-og.png',
  '/aim-og.png',
  'AIM Framework mark, a stand-in so this test page can show a hero.',
  'Test article for the private preview. Not for publication.',
  'draft',
  'draft',
  'corpus',
  true,
  ARRAY['TEST-do-not-publish.md'],
  ARRAY['4.1'],
  ARRAY[]::text[]
),
(
  'TEST Preview: The Wednesday that stays backstage',
  'preview-test-wednesday',
  $preview_wednesday$This article is marked approved in the file, with a Wednesday date, so the schedule can show what an approved piece looks like. It is a test. The loader treats it as preview only, so it does not take the Wednesday slot and it does not go live on 13 January 2027.

If you can read this page, you are signed in as an admin. Everyone else should get a missing page.$preview_wednesday$,
  'Yule Guttenbeil',
  ARRAY['test', 'preview'],
  '/aim-og.png',
  '/aim-og.png',
  'AIM Framework mark, a stand-in so this test page can show a hero.',
  'Test article held in preview so it cannot take a public slot.',
  'draft',
  'approved',
  'corpus',
  true,
  ARRAY['TEST-do-not-publish.md'],
  ARRAY['Chapter 7'],
  ARRAY[]::text[]
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  meta_description = EXCLUDED.meta_description,
  editorial_status = EXCLUDED.editorial_status,
  pipeline = 'corpus',
  preview_only = true,
  status = 'draft',
  featured_image_url = EXCLUDED.featured_image_url,
  feature_image = EXCLUDED.feature_image,
  image_alt = EXCLUDED.image_alt,
  source_papers = EXCLUDED.source_papers,
  treatise_refs = EXCLUDED.treatise_refs,
  tags = EXCLUDED.tags,
  scheduled_publish_at = NULL;
