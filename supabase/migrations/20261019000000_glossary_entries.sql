-- Chapter 2 glossary, rewritten by the treatise sync when that chapter changes.
-- Visitors can read it. Only the service role (the sync job) writes it.

CREATE TABLE public.glossary_entries (
  slug text PRIMARY KEY,
  term text NOT NULL,
  letter text NOT NULL,
  definition text NOT NULL,
  explanation text NOT NULL DEFAULT '',
  derivation text,
  epistemic_status text,
  cross_references text[] NOT NULL DEFAULT '{}',
  notes text,
  source_sha text NOT NULL,
  position integer NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX glossary_entries_letter_position_idx
  ON public.glossary_entries (letter, position);

CREATE INDEX glossary_entries_source_sha_idx
  ON public.glossary_entries (source_sha);

ALTER TABLE public.glossary_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Glossary entries are public"
ON public.glossary_entries
FOR SELECT
TO anon, authenticated
USING (true);

GRANT SELECT ON public.glossary_entries TO anon, authenticated;
GRANT ALL ON public.glossary_entries TO service_role;
