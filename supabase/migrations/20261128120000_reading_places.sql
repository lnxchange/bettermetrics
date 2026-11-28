-- Where a signed-in reader had reached in each treatise chapter.
-- Visitors keep the same fact in the bm-place cookie and never write a row.
-- Closing the account deletes these rows with the user.

create table public.reading_places (
  user_id uuid not null references auth.users (id) on delete cascade,
  slug text not null,
  heading_id text not null default '',
  offset_px integer not null,
  ratio integer not null,
  updated_at timestamptz not null,
  primary key (user_id, slug),
  constraint reading_places_slug_check check (
    char_length(slug) <= 40 and slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'
  ),
  constraint reading_places_heading_id_check check (
    heading_id = '' or (
      char_length(heading_id) <= 80 and heading_id ~ '^[a-z0-9]+([.-][a-z0-9]+)*$'
    )
  ),
  constraint reading_places_offset_px_check check (offset_px >= 0 and offset_px <= 5000000),
  constraint reading_places_ratio_check check (ratio >= 0 and ratio <= 10000)
);

alter table public.reading_places enable row level security;

revoke all on public.reading_places from anon, authenticated;
grant select on public.reading_places to authenticated;
grant all on public.reading_places to service_role;

create policy reading_places_select_own
  on public.reading_places
  for select
  to authenticated
  using (user_id = auth.uid());
