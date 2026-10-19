-- Chapters and appendices of the AIM Treatise, rewritten by the treatise sync
-- when the source text changes. Visitors can read them. Only the service role writes.
-- Chapter 2 is the glossary and is not stored here.

CREATE TABLE public.treatise_chapters (
  slug text PRIMARY KEY,
  title text NOT NULL,
  label text NOT NULL,
  part text NOT NULL CHECK (part IN ('I', 'II', 'appendix')),
  markdown text NOT NULL,
  headings jsonb NOT NULL DEFAULT '[]'::jsonb,
  source_sha text NOT NULL,
  source_date text,
  position integer NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX treatise_chapters_position_idx
  ON public.treatise_chapters (position);

CREATE INDEX treatise_chapters_source_sha_idx
  ON public.treatise_chapters (source_sha);

ALTER TABLE public.treatise_chapters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Treatise chapters are public"
ON public.treatise_chapters
FOR SELECT
TO anon, authenticated
USING (true);

GRANT SELECT ON public.treatise_chapters TO anon, authenticated;
GRANT ALL ON public.treatise_chapters TO service_role;
