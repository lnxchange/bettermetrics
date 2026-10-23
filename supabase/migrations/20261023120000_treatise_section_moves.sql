-- Where a section number went when a treatise publish accepted a renumbering
-- or a removal. Saved chats follow these hops. Visitors can read them.
-- Only the service role writes, and only from an accepted publish.

CREATE TABLE public.treatise_section_moves (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  from_section text NOT NULL,
  from_slug text NOT NULL,
  to_section text,
  to_slug text NOT NULL,
  published_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX treatise_section_moves_from_idx
  ON public.treatise_section_moves (from_section, published_at);

ALTER TABLE public.treatise_section_moves ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Treatise section moves are public"
ON public.treatise_section_moves
FOR SELECT
TO anon, authenticated
USING (true);

GRANT SELECT ON public.treatise_section_moves TO anon, authenticated;
GRANT ALL ON public.treatise_section_moves TO service_role;
