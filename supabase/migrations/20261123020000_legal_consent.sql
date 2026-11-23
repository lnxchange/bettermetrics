-- Acceptance of the Terms of Use and Privacy Policy, and the updates choice.
-- Existing accounts have no row, so the next sign-in asks them to accept.
-- Nothing here opts an existing account in to updates.

create table public.user_legal_consents (
  user_id uuid primary key references auth.users (id) on delete cascade,
  accepted_at timestamptz,
  terms_version text,
  privacy_version text,
  updates_opt_in boolean not null default false,
  updates_opt_in_at timestamptz
);

alter table public.user_legal_consents enable row level security;

revoke all on public.user_legal_consents from anon, authenticated;
grant select on public.user_legal_consents to authenticated;
grant all on public.user_legal_consents to service_role;

create policy user_legal_consents_select_own
  on public.user_legal_consents
  for select
  to authenticated
  using (user_id = auth.uid());

-- The chat notice is aligned with the Privacy Policy. Replace only the
-- previous default, which described the key without saying the site decrypts it.
update public.chat_settings
set notice_markdown = $notice$**Your key**

Your key is encrypted before it is stored. The site decrypts it in server memory only when it sends a question to your provider, and uses it only for your own questions. It is never shown again, and you can remove it at any time. Your provider bills you directly. The site charges nothing.$notice$,
    updated_at = now()
where notice_markdown like '%Ask the AI now runs on your own key%'
   or notice_markdown like '%I would rather offer it free%';
