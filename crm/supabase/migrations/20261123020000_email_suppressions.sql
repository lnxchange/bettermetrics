-- Opt-outs and account deletions. A row here is the only record kept after
-- an account is deleted, and it stops that address being added again.
-- An opt-out can be cleared when the person opts in. An account deletion cannot.

create table if not exists public.email_suppressions (
  email text primary key,
  reason text not null check (reason in ('opt-out', 'account-deleted')),
  created_at timestamptz not null default now()
);

alter table public.email_suppressions enable row level security;
revoke all on public.email_suppressions from anon, authenticated;
grant all on public.email_suppressions to service_role;

create or replace function public.block_suppressed_contact()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  addr text;
begin
  if new.email_jsonb is null then
    return new;
  end if;
  for addr in
    select lower(value->>'email')
    from jsonb_array_elements(new.email_jsonb) as value
    where coalesce(value->>'email', '') <> ''
  loop
    if exists (select 1 from public.email_suppressions where email = addr) then
      -- A suppression stops the mailing list. It does not block a message
      -- the person sends through the contact form.
      if tg_op = 'INSERT' and (
        new.source = 'website-signup' or coalesce(new.has_newsletter, false)
      ) then
        return null;
      end if;
      if tg_op = 'UPDATE' and coalesce(new.has_newsletter, false) then
        new.has_newsletter = false;
      end if;
    end if;
  end loop;
  return new;
end;
$$;

revoke all on function public.block_suppressed_contact() from public, anon;
grant execute on function public.block_suppressed_contact() to authenticated, service_role;

drop trigger if exists block_suppressed_contact on public.contacts;
create trigger block_suppressed_contact
  before insert or update of has_newsletter, source, email_jsonb on public.contacts
  for each row
  execute function public.block_suppressed_contact();

create or replace function public.remove_mailing_contact(
  p_email text,
  p_site_user_id uuid,
  p_reason text
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  addr text := lower(trim(coalesce(p_email, '')));
  cid bigint;
begin
  if addr = '' then
    return;
  end if;
  if p_reason not in ('opt-out', 'account-deleted') then
    raise exception 'invalid suppression reason';
  end if;

  if p_reason = 'opt-out' then
    update public.contacts
      set has_newsletter = false
      where email_jsonb @> jsonb_build_array(jsonb_build_object('email', addr));
  end if;

  insert into public.email_suppressions (email, reason, created_at)
  values (addr, p_reason, now())
  on conflict (email) do update
    set reason = case
          when public.email_suppressions.reason = 'account-deleted' then 'account-deleted'
          else excluded.reason
        end,
        created_at = now();

  for cid in
    select id from public.contacts c
    where (p_site_user_id is not null and c.site_user_id = p_site_user_id)
       or (p_site_user_id is not null and c.external_id = 'site-user:' || p_site_user_id::text)
       or (
         p_reason = 'account-deleted'
         and c.email_jsonb @> jsonb_build_array(jsonb_build_object('email', addr))
       )
       or (
         p_reason = 'opt-out'
         and c.source = 'website-signup'
         and c.email_jsonb @> jsonb_build_array(jsonb_build_object('email', addr))
       )
  loop
    update public.deals
      set contact_ids = array_remove(contact_ids, cid)
      where contact_ids @> array[cid]::bigint[];
    delete from public.contacts where id = cid;
  end loop;
end;
$$;

revoke all on function public.remove_mailing_contact(text, uuid, text) from public, anon, authenticated;
grant execute on function public.remove_mailing_contact(text, uuid, text) to service_role;
