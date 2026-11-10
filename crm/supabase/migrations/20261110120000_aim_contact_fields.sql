-- Site admins are created with user_metadata.crm_staff. Public signup stays
-- closed once any staff row exists, unless the account was invited.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  sales_count int;
  staff boolean;
begin
  select count(id) into sales_count
  from public.sales;

  staff := coalesce(new.raw_user_meta_data->>'crm_staff' = 'true', false);

  delete from public.user_invitations where user_id = new.id;
  if sales_count > 0 and not found and not new.is_sso_user and not staff then
    raise exception 'Sign up is not allowed';
  end if;

  insert into public.sales (first_name, last_name, email, user_id, administrator)
  values (
    coalesce(new.raw_user_meta_data ->> 'first_name', new.raw_user_meta_data -> 'custom_claims' ->> 'first_name', 'Pending'),
    coalesce(new.raw_user_meta_data ->> 'last_name', new.raw_user_meta_data -> 'custom_claims' ->> 'last_name', 'Pending'),
    new.email,
    new.id,
    sales_count = 0 or staff
  );
  return new;
end;
$$;

-- AIM contact fields. The treatise list, the site, and the contact form
-- upsert through upsert_synced_contact. Relationship fields edited in the CRM
-- are listed in locked_fields and are left alone.

alter table public.contacts
  add column if not exists external_id text,
  add column if not exists source text,
  add column if not exists ask_policy text,
  add column if not exists site_user_id uuid,
  add column if not exists locked_fields text[] not null default '{}'::text[];

alter table public.contacts
  drop constraint if exists contacts_ask_policy_check;

alter table public.contacts
  add constraint contacts_ask_policy_check check (
    ask_policy is null
    or ask_policy in ('may-ask-to-validate', 'do-not-ask')
  );

create unique index if not exists contacts_external_id_key
  on public.contacts (external_id)
  where external_id is not null;

create unique index if not exists tags_name_key
  on public.tags (name);

insert into public.tags (name, color)
values
  ('reviewer', '#3b82f6'),
  ('ally', '#16a34a'),
  ('press', '#d97706'),
  ('site-user', '#64748b'),
  ('inbound', '#7c3aed')
on conflict (name) do nothing;

insert into public.configuration (id, config)
values (
  1,
  jsonb_build_object(
    'title', 'AIM',
    'currency', 'AUD',
    'companySectors', jsonb_build_array(
      jsonb_build_object('value', 'university', 'label', 'University'),
      jsonb_build_object('value', 'research-lab', 'label', 'Research lab'),
      jsonb_build_object('value', 'press', 'label', 'Press'),
      jsonb_build_object('value', 'think-tank', 'label', 'Think tank'),
      jsonb_build_object('value', 'public-institution', 'label', 'Public institution'),
      jsonb_build_object('value', 'independent', 'label', 'Independent')
    ),
    'dealCategories', jsonb_build_array(
      jsonb_build_object('value', 'validation', 'label', 'Validation'),
      jsonb_build_object('value', 'promotion', 'label', 'Promotion'),
      jsonb_build_object('value', 'coverage', 'label', 'Coverage')
    ),
    'dealPipelineStatuses', jsonb_build_array('endorsed', 'amplifying', 'published'),
    'dealStages', jsonb_build_array(
      jsonb_build_object('value', 'identified', 'label', 'Identified'),
      jsonb_build_object('value', 'invited', 'label', 'Invited'),
      jsonb_build_object('value', 'reading', 'label', 'Reading'),
      jsonb_build_object('value', 'responded', 'label', 'Responded'),
      jsonb_build_object('value', 'briefed', 'label', 'Briefed'),
      jsonb_build_object('value', 'interested', 'label', 'Interested'),
      jsonb_build_object('value', 'pitched', 'label', 'Pitched'),
      jsonb_build_object('value', 'endorsed', 'label', 'Endorsed'),
      jsonb_build_object('value', 'amplifying', 'label', 'Amplifying'),
      jsonb_build_object('value', 'published', 'label', 'Published'),
      jsonb_build_object('value', 'passed', 'label', 'Passed'),
      jsonb_build_object('value', 'declined', 'label', 'Declined')
    ),
    'noteStatuses', jsonb_build_array(
      jsonb_build_object('value', 'not-contacted', 'label', 'Not contacted', 'color', '#94a3b8'),
      jsonb_build_object('value', 'in-conversation', 'label', 'In conversation', 'color', '#7dbde8'),
      jsonb_build_object('value', 'supportive', 'label', 'Supportive', 'color', '#a4e87d'),
      jsonb_build_object('value', 'declined', 'label', 'Declined', 'color', '#e88b7d')
    ),
    'taskTypes', jsonb_build_array(
      jsonb_build_object('value', 'none', 'label', 'None'),
      jsonb_build_object('value', 'send-treatise', 'label', 'Send treatise'),
      jsonb_build_object('value', 'follow-up', 'label', 'Follow up'),
      jsonb_build_object('value', 'introduction', 'label', 'Introduction'),
      jsonb_build_object('value', 'pitch', 'label', 'Pitch'),
      jsonb_build_object('value', 'thank', 'label', 'Thank'),
      jsonb_build_object('value', 'log-response', 'label', 'Log response'),
      jsonb_build_object('value', 'email', 'label', 'Email'),
      jsonb_build_object('value', 'call', 'label', 'Call')
    )
  )
)
on conflict (id) do nothing;

create or replace function public.upsert_synced_contact(
  p_email text,
  p_first_name text,
  p_last_name text,
  p_company_name text,
  p_source text,
  p_external_id text,
  p_tag_names text[],
  p_site_user_id uuid,
  p_ask_policy text,
  p_note text,
  p_title text,
  p_background text
) returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  cid bigint;
  locked text[];
  company bigint;
  tag_name text;
  tag_id bigint;
  tag_ids bigint[] := '{}'::bigint[];
  policy text;
begin
  if p_external_id is not null and length(trim(p_external_id)) > 0 then
    select id, coalesce(locked_fields, '{}'::text[])
      into cid, locked
      from public.contacts
      where external_id = p_external_id;
  end if;

  if cid is null and p_email is not null and length(trim(p_email)) > 0 then
    select id, coalesce(locked_fields, '{}'::text[])
      into cid, locked
      from public.contacts
      where exists (
        select 1
        from jsonb_array_elements(coalesce(email_jsonb, '[]'::jsonb)) entry
        where lower(entry->>'email') = lower(p_email)
      )
      order by id
      limit 1;
  end if;

  locked := coalesce(locked, '{}'::text[]);

  if p_company_name is not null and length(trim(p_company_name)) > 0
     and not ('company' = any (locked)) then
    select id into company
      from public.companies
      where lower(name) = lower(p_company_name)
      order by id
      limit 1;
    if company is null then
      insert into public.companies (name)
      values (p_company_name)
      returning id into company;
    end if;
  end if;

  if p_tag_names is not null then
    foreach tag_name in array p_tag_names loop
      if tag_name is null or length(trim(tag_name)) = 0 then
        continue;
      end if;
      select id into tag_id from public.tags where name = tag_name;
      if tag_id is null then
        insert into public.tags (name, color)
        values (tag_name, '#64748b')
        on conflict (name) do update set name = excluded.name
        returning id into tag_id;
      end if;
      tag_ids := tag_ids || tag_id;
    end loop;
  end if;

  policy := p_ask_policy;
  if policy is null and 'ally' = any (coalesce(p_tag_names, '{}'::text[])) then
    policy := 'do-not-ask';
  end if;

  if cid is null then
    insert into public.contacts (
      first_name,
      last_name,
      title,
      email_jsonb,
      company_id,
      first_seen,
      last_seen,
      has_newsletter,
      status,
      tags,
      source,
      external_id,
      ask_policy,
      site_user_id,
      background,
      locked_fields
    ) values (
      coalesce(nullif(p_first_name, ''), 'Unknown'),
      nullif(p_last_name, ''),
      nullif(p_title, ''),
      case
        when p_email is null or length(trim(p_email)) = 0 then '[]'::jsonb
        else jsonb_build_array(jsonb_build_object('email', lower(p_email), 'type', 'Work'))
      end,
      company,
      now(),
      now(),
      false,
      'not-contacted',
      tag_ids,
      p_source,
      nullif(p_external_id, ''),
      policy,
      p_site_user_id,
      nullif(p_background, ''),
      '{}'::text[]
    )
    returning id into cid;
  else
    update public.contacts set
      first_name = case when 'first_name' = any (locked) then first_name else coalesce(nullif(p_first_name, ''), first_name) end,
      last_name = case when 'last_name' = any (locked) then last_name else coalesce(nullif(p_last_name, ''), last_name) end,
      title = case when 'title' = any (locked) then title else coalesce(nullif(p_title, ''), title) end,
      email_jsonb = case
        when 'email' = any (locked) or p_email is null or length(trim(p_email)) = 0 then email_jsonb
        when email_jsonb @> jsonb_build_array(jsonb_build_object('email', lower(p_email))) then email_jsonb
        else coalesce(email_jsonb, '[]'::jsonb) || jsonb_build_array(jsonb_build_object('email', lower(p_email), 'type', 'Work'))
      end,
      company_id = case when 'company' = any (locked) then company_id else coalesce(company, company_id) end,
      tags = case
        when 'tags' = any (locked) or cardinality(tag_ids) = 0 then tags
        else (
          select coalesce(array_agg(distinct value), '{}'::bigint[])
          from unnest(coalesce(tags, '{}'::bigint[]) || tag_ids) value
        )
      end,
      external_id = case
        when 'external_id' = any (locked) then external_id
        else coalesce(nullif(p_external_id, ''), external_id)
      end,
      ask_policy = case when 'ask_policy' = any (locked) then ask_policy else coalesce(policy, ask_policy) end,
      site_user_id = coalesce(p_site_user_id, site_user_id),
      background = case when 'background' = any (locked) then background else coalesce(nullif(p_background, ''), background) end,
      source = coalesce(source, p_source),
      last_seen = now()
    where id = cid;
  end if;

  if p_note is not null and length(trim(p_note)) > 0 then
    if not exists (
      select 1 from public.contact_notes
      where contact_id = cid and text = p_note
    ) then
      insert into public.contact_notes (contact_id, text, date)
      values (cid, p_note, now());
    end if;
  end if;

  return cid;
end;
$$;

revoke all on function public.upsert_synced_contact(
  text, text, text, text, text, text, text[], uuid, text, text, text, text
) from public, anon, authenticated;

grant execute on function public.upsert_synced_contact(
  text, text, text, text, text, text, text[], uuid, text, text, text, text
) to service_role;
