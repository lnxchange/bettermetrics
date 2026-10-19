-- Public drafts of the treatise ebook. The sync writes with the service role.
-- Anyone can download the current draft.

insert into storage.buckets (id, name, public)
values ('treatise-ebooks', 'treatise-ebooks', true)
on conflict (id) do update set public = true;

create policy "Treatise ebooks are public"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'treatise-ebooks');
