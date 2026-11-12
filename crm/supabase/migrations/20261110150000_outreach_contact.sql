-- Outreach fields, and one function that records a full outreach contact.
-- upsert_synced_contact keeps its signature and its service-role grant. The
-- match and the company/tag lookup now live in private, which PostgREST does
-- not expose. Signup stays closed: handle_new_user is unchanged.

alter table public.contacts
  add column if not exists outreach_status text,
  add column if not exists first_contacted_at timestamptz,
  add column if not exists last_contacted_at timestamptz,
  add column if not exists email_holder text,
  add column if not exists contact_via text,
  add column if not exists list text;

alter table public.contacts
  drop constraint if exists contacts_outreach_status_check;

alter table public.contacts
  add constraint contacts_outreach_status_check check (
    outreach_status is null
    or outreach_status in (
      'identified',
      'researched',
      'drafted',
      'in-outlook',
      'sent',
      'replied',
      'engaged',
      'declined',
      'no-response',
      'holding'
    )
  );

alter table public.contacts
  drop constraint if exists contacts_email_holder_check;

alter table public.contacts
  add constraint contacts_email_holder_check check (
    email_holder is null
    or email_holder in ('self', 'assistant', 'agent')
  );

alter table public.contacts
  drop constraint if exists contacts_list_check;

alter table public.contacts
  add constraint contacts_list_check check (
    list is null or list in ('primary', 'secondary')
  );

alter table public.deals
  add column if not exists synced_stage text;

-- An address held by an assistant or an agent is not the person's own email.
-- The avatar lookup skips it, and so does contact matching.
create or replace function public.handle_contact_saved()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  contact_avatar text;
  emails_length int8;
  item jsonb;
begin
  if new.avatar is not null then
    return new;
  end if;

  if tg_op = 'UPDATE' and new.email_jsonb is not distinct from old.email_jsonb then
    return new;
  end if;

  select coalesce(jsonb_array_length(new.email_jsonb), 0) into emails_length;

  if emails_length = 0 then
    return new;
  end if;

  for item in select jsonb_array_elements(new.email_jsonb)
  loop
    if coalesce(item->>'type', '') in ('Assistant', 'Agent') then
      continue;
    end if;
    select public.get_avatar_for_email(item->>'email') into contact_avatar;
    if contact_avatar is not null then
      exit;
    end if;
  end loop;

  if contact_avatar is null then
    return new;
  end if;

  new.avatar = concat('{"src":"', contact_avatar, '"}');
  return new;
end;
$$;

-- A CRM edit locks the scalar it changed. Sync sets app.contact_sync so its
-- own writes are not treated as edits. last_seen, sales_id, and avatar are
-- maintained by other triggers and are not locked.
create or replace function public.lock_edited_contact_fields()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  fields text[] := coalesce(new.locked_fields, '{}'::text[]);
begin
  if coalesce(current_setting('app.contact_sync', true), '') = 'on' then
    return new;
  end if;

  if new.first_name is distinct from old.first_name then
    fields := fields || array['first_name'];
  end if;
  if new.last_name is distinct from old.last_name then
    fields := fields || array['last_name'];
  end if;
  if new.title is distinct from old.title then
    fields := fields || array['title'];
  end if;
  if new.email_jsonb is distinct from old.email_jsonb then
    fields := fields || array['email'];
  end if;
  if new.company_id is distinct from old.company_id then
    fields := fields || array['company'];
  end if;
  if new.tags is distinct from old.tags then
    fields := fields || array['tags'];
  end if;
  if new.external_id is distinct from old.external_id then
    fields := fields || array['external_id'];
  end if;
  if new.ask_policy is distinct from old.ask_policy then
    fields := fields || array['ask_policy'];
  end if;
  if new.background is distinct from old.background then
    fields := fields || array['background'];
  end if;
  if new.source is distinct from old.source then
    fields := fields || array['source'];
  end if;
  if new.linkedin_url is distinct from old.linkedin_url then
    fields := fields || array['linkedin_url'];
  end if;
  if new.outreach_status is distinct from old.outreach_status then
    fields := fields || array['outreach_status'];
  end if;
  if new.first_contacted_at is distinct from old.first_contacted_at then
    fields := fields || array['first_contacted_at'];
  end if;
  if new.last_contacted_at is distinct from old.last_contacted_at then
    fields := fields || array['last_contacted_at'];
  end if;
  if new.email_holder is distinct from old.email_holder then
    fields := fields || array['email_holder'];
  end if;
  if new.contact_via is distinct from old.contact_via then
    fields := fields || array['contact_via'];
  end if;
  if new.list is distinct from old.list then
    fields := fields || array['list'];
  end if;
  if new.status is distinct from old.status then
    fields := fields || array['status'];
  end if;

  select coalesce(array_agg(distinct value), '{}'::text[])
    into fields
  from unnest(fields) as value;

  new.locked_fields := fields;
  return new;
end;
$$;

drop trigger if exists "00_lock_edited_contact_fields" on public.contacts;

create trigger "00_lock_edited_contact_fields"
  before update on public.contacts
  for each row execute function public.lock_edited_contact_fields();

create or replace view public.contacts_summary with (security_invoker = on) as
select
    co.id,
    co.first_name,
    co.last_name,
    co.gender,
    co.title,
    co.background,
    co.avatar,
    co.first_seen,
    co.last_seen,
    co.has_newsletter,
    co.status,
    co.tags,
    co.company_id,
    co.sales_id,
    co.linkedin_url,
    co.email_jsonb,
    co.phone_jsonb,
    (jsonb_path_query_array(co.email_jsonb, '$[*]."email"'))::text as email_fts,
    (jsonb_path_query_array(co.phone_jsonb, '$[*]."number"'))::text as phone_fts,
    c.name as company_name,
    count(distinct t.id) filter (where t.done_date is null) as nb_tasks,
    co.external_id,
    co.source,
    co.ask_policy,
    co.site_user_id,
    co.locked_fields,
    co.outreach_status,
    co.first_contacted_at,
    co.last_contacted_at,
    co.email_holder,
    co.contact_via,
    co.list
from public.contacts co
    left join public.tasks t on co.id = t.contact_id
    left join public.companies c on co.company_id = c.id
group by co.id, c.name;

-- Rebuild the contact search document so the new text fields are indexed.
-- Dates stay ordinary columns and are filtered, not searched as text.
alter table public.contacts drop column if exists fts;

alter table public.contacts add column fts tsvector generated always as (
    setweight(public.search_document(first_name, last_name), 'A')
    || public.search_document(
        title,
        background,
        outreach_status,
        email_holder,
        contact_via,
        list,
        jsonb_path_query_array(email_jsonb, '$[*]."email"')::text,
        jsonb_path_query_array(phone_jsonb, '$[*]."number"')::text
    )
) stored;

create index contacts_fts_idx on public.contacts using gin (fts);

alter table public.contacts alter column fts set statistics 10000;

create or replace function public.global_search(
  query text,
  resources text[] default null::text[],
  max_results integer default 50
) returns table(
  resource text,
  record_id bigint,
  title text,
  subtitle text,
  contact_id bigint,
  deal_id bigint,
  date timestamp with time zone,
  content text
)
language plpgsql
stable
set search_path to ''
set plan_cache_mode to 'force_custom_plan'
as $function$
#variable_conflict use_column
declare
    tsq tsquery := public.search_query(query);
    row_limit constant integer := least(coalesce(max_results, 50), 200);
begin
    if tsq is null or row_limit < 1 then
        return;
    end if;

    return query
    select resource, record_id, title, subtitle, contact_id, deal_id, date, content
    from (
        (select 'companies' as resource, c.id as record_id, c.name as title, c.sector as subtitle,
            null::bigint as contact_id, null::bigint as deal_id, c.created_at as date,
            concat_ws(' · ', c.sector, c.description, c.website::text, c.phone_number, c.zipcode, c.city, c.state_abbr) as content,
            ts_rank(c.fts, tsq) as rank
        from public.companies c
        where (resources is null or 'companies' = any(resources)) and c.fts @@ tsq
        order by rank desc, c.created_at desc
        limit row_limit)
        union all
        (select 'contacts', co.id, concat_ws(' ', co.first_name, co.last_name),
            (select cc.name from public.companies cc where cc.id = co.company_id), co.id, null::bigint, co.first_seen,
            concat_ws(' · ', co.title, co.background, co.outreach_status, co.email_holder, co.contact_via, co.list,
                (select string_agg(e ->> 'email', ' ') from jsonb_array_elements(co.email_jsonb) e),
                (select string_agg(p ->> 'number', ' ') from jsonb_array_elements(co.phone_jsonb) p)),
            ts_rank(co.fts, tsq) as rank
        from public.contacts co
        where (resources is null or 'contacts' = any(resources)) and co.fts @@ tsq
        order by rank desc, co.first_seen desc nulls last
        limit row_limit)
        union all
        (select 'deals', d.id, d.name,
            (select dc.name from public.companies dc where dc.id = d.company_id), null::bigint, d.id, d.created_at,
            concat_ws(' · ', variadic d.categories || d.description),
            ts_rank(d.fts, tsq) as rank
        from public.deals d
        where (resources is null or 'deals' = any(resources)) and d.archived_at is null and d.fts @@ tsq
        order by rank desc, d.created_at desc
        limit row_limit)
        union all
        (select 'tasks', t.id, left(t.text, 200),
            (select concat_ws(' ', tc.first_name, tc.last_name) from public.contacts tc where tc.id = t.contact_id),
            t.contact_id, null::bigint, t.created_at,
            concat_ws(' · ', t.text, t.type),
            0
        from public.tasks t
        where (resources is null or 'tasks' = any(resources)) and t.done_date is null and t.fts @@ tsq
        order by t.created_at desc
        limit row_limit)
        union all
        (select 'contact_notes', cn.id, left(cn.text, 200),
            (select concat_ws(' ', nc.first_name, nc.last_name) from public.contacts nc where nc.id = cn.contact_id),
            cn.contact_id, null::bigint, cn.date,
            concat_ws(' · ', cn.text, public.search_attachment_titles(cn.attachments)),
            0
        from public.contact_notes cn
        where (resources is null or 'contact_notes' = any(resources)) and cn.fts @@ tsq
        order by cn.date desc nulls last
        limit row_limit)
        union all
        (select 'deal_notes', dn.id, left(dn.text, 200), nd.name, null::bigint, dn.deal_id, dn.date,
            concat_ws(' · ', dn.text, public.search_attachment_titles(dn.attachments)),
            0
        from public.deal_notes dn
            join public.deals nd on nd.id = dn.deal_id
        where (resources is null or 'deal_notes' = any(resources)) and nd.archived_at is null and dn.fts @@ tsq
        order by dn.date desc nulls last
        limit row_limit)
    ) results
    order by rank desc, date desc nulls last;
end
$function$;

revoke execute on function public.global_search(text, text[], integer) from public, anon;
grant execute on function public.global_search(text, text[], integer) to authenticated, service_role;

-- Shared lookup. Own emails are Work, Home, or Other. Assistant and Agent
-- addresses never match, including for the website signup sync.
create or replace function private.find_synced_contact(
  p_external_id text,
  p_email text,
  p_match_email boolean
) returns table (id bigint, locked text[])
language plpgsql
stable
security invoker
set search_path = public
as $$
begin
  if p_external_id is not null and length(trim(p_external_id)) > 0 then
    return query
      select c.id, coalesce(c.locked_fields, '{}'::text[])
      from public.contacts c
      where c.external_id = p_external_id
      order by c.id
      limit 1;
    if found then
      return;
    end if;
  end if;

  if p_match_email and p_email is not null and length(trim(p_email)) > 0 then
    return query
      select c.id, coalesce(c.locked_fields, '{}'::text[])
      from public.contacts c
      where exists (
        select 1
        from jsonb_array_elements(coalesce(c.email_jsonb, '[]'::jsonb)) entry
        where lower(entry->>'email') = lower(trim(p_email))
          and coalesce(entry->>'type', 'Work') not in ('Assistant', 'Agent')
      )
      order by c.id
      limit 1;
  end if;
end;
$$;

create or replace function private.field_locked(locked text[], field text)
returns boolean
language sql
immutable
as $$
  select field = any (coalesce(locked, '{}'::text[]))
$$;

create or replace function private.earlier_timestamp(
  current_value timestamptz,
  incoming timestamptz
) returns timestamptz
language sql
immutable
as $$
  select case
    when incoming is null then current_value
    when current_value is null or incoming < current_value then incoming
    else current_value
  end
$$;

create or replace function private.later_timestamp(
  current_value timestamptz,
  incoming timestamptz
) returns timestamptz
language sql
immutable
as $$
  select case
    when incoming is null then current_value
    when current_value is null or incoming > current_value then incoming
    else current_value
  end
$$;

-- p_fill_sector fills an empty sector only. A sector a person already set stays.
create or replace function private.resolve_company(
  p_name text,
  p_sector text,
  p_fill_sector boolean
) returns bigint
language plpgsql
security invoker
set search_path = public
as $$
declare
  company bigint;
  v_sector text := nullif(trim(coalesce(p_sector, '')), '');
begin
  if p_name is null or length(trim(p_name)) = 0 then
    return null;
  end if;

  select id into company
    from public.companies
    where lower(name) = lower(p_name)
    order by id
    limit 1;

  if company is null then
    insert into public.companies (name, sector)
    values (p_name, case when p_fill_sector then v_sector else null end)
    returning id into company;
  elsif p_fill_sector and v_sector is not null then
    update public.companies
      set sector = v_sector
      where id = company
        and (sector is null or length(trim(sector)) = 0);
  end if;

  return company;
end;
$$;

create or replace function private.resolve_tag_ids(p_tag_names text[])
returns bigint[]
language plpgsql
security invoker
set search_path = public
as $$
declare
  tag_name text;
  tag_id bigint;
  tag_ids bigint[] := '{}'::bigint[];
begin
  if p_tag_names is null then
    return tag_ids;
  end if;

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

  return tag_ids;
end;
$$;

-- Note text is the kind, the subject, then the body, one per line.
-- A repeat of the same contact, date, kind, and subject inserts nothing.
create or replace function private.append_contact_history(
  p_contact_id bigint,
  p_history jsonb
) returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  item jsonb;
  item_date timestamptz;
  kind text;
  subject text;
  body text;
  note text;
begin
  if p_history is null or jsonb_typeof(p_history) <> 'array' then
    return;
  end if;

  for item in select value from jsonb_array_elements(p_history)
  loop
    kind := coalesce(item->>'kind', '');
    subject := coalesce(item->>'subject', '');
    body := coalesce(item->>'text', '');
    if kind = '' and subject = '' and body = '' then
      continue;
    end if;
    if nullif(trim(coalesce(item->>'date', '')), '') is null then
      item_date := now();
    else
      item_date := (item->>'date')::timestamptz;
    end if;
    note := kind || E'\n' || subject || E'\n' || body;
    if exists (
      select 1
      from public.contact_notes
      where contact_id = p_contact_id
        and date = item_date
        and split_part(text, E'\n', 1) = kind
        and split_part(text, E'\n', 2) = subject
    ) then
      continue;
    end if;
    insert into public.contact_notes (contact_id, text, date)
    values (p_contact_id, note, item_date);
  end loop;
end;
$$;

create or replace function private.outreach_deal_stage(p_status text)
returns text
language sql
immutable
as $$
  select case p_status
    when 'identified' then 'identified'
    when 'researched' then 'identified'
    when 'drafted' then 'identified'
    when 'in-outlook' then 'identified'
    when 'holding' then 'identified'
    when 'sent' then 'invited'
    when 'replied' then 'responded'
    when 'engaged' then 'interested'
    when 'declined' then 'declined'
    when 'no-response' then 'passed'
    else null
  end
$$;

-- Prefer the order stored in configuration. Stages that are not listed there
-- use the AIM board order, so an empty configuration still advances.
create or replace function private.deal_stage_rank(p_stage text)
returns integer
language plpgsql
stable
security invoker
set search_path = public
as $$
declare
  configured jsonb;
  rank integer;
  fallback text[] := array[
    'identified', 'invited', 'reading', 'responded', 'briefed', 'interested',
    'pitched', 'endorsed', 'amplifying', 'published', 'passed', 'declined'
  ];
begin
  select config->'dealStages' into configured
    from public.configuration
    where id = 1;

  if configured is not null
     and jsonb_typeof(configured) = 'array'
     and jsonb_array_length(configured) > 0 then
    select (ordinality - 1)::int into rank
      from jsonb_array_elements(configured) with ordinality
      where value->>'value' = p_stage
      limit 1;
    if rank is not null then
      return rank;
    end if;
  end if;

  return array_position(fallback, p_stage) - 1;
end;
$$;

create or replace function private.sync_outreach_deal(
  p_contact_id bigint,
  p_deal jsonb,
  p_outreach_status text
) returns bigint
language plpgsql
security invoker
set search_path = public
as $$
declare
  deal_id bigint;
  deal_category text;
  deal_name text;
  mapped_stage text;
  current_stage text;
  current_synced text;
  current_rank integer;
  target_rank integer;
begin
  if p_deal is null or jsonb_typeof(p_deal) <> 'object' then
    return null;
  end if;

  deal_category := nullif(p_deal->>'category', '');
  deal_name := nullif(p_deal->>'name', '');
  if deal_category is null then
    return null;
  end if;

  mapped_stage := coalesce(private.outreach_deal_stage(p_outreach_status), 'identified');

  select d.id, d.stage, d.synced_stage
    into deal_id, current_stage, current_synced
  from public.deals d
  where d.archived_at is null
    and d.contact_ids @> array[p_contact_id]::bigint[]
    and d.categories @> array[deal_category]::text[]
  order by d.id
  limit 1;

  if deal_id is null then
    insert into public.deals (
      name,
      company_id,
      contact_ids,
      categories,
      stage,
      synced_stage,
      index
    )
    values (
      coalesce(deal_name, 'Outreach'),
      (select company_id from public.contacts where id = p_contact_id),
      array[p_contact_id]::bigint[],
      array[deal_category]::text[],
      mapped_stage,
      mapped_stage,
      0
    )
    returning id into deal_id;
    return deal_id;
  end if;

  -- A deal this sync did not create has no synced_stage. Leave it alone.
  -- A stage that no longer matches synced_stage was changed after the last
  -- sync. Leave that deal alone as well, including its name.
  if current_synced is null or current_stage is distinct from current_synced then
    return deal_id;
  end if;

  current_rank := private.deal_stage_rank(current_stage);
  target_rank := private.deal_stage_rank(mapped_stage);
  if mapped_stage is distinct from current_stage and (
    mapped_stage in ('declined', 'passed')
    or (
      target_rank is not null
      and current_rank is not null
      and target_rank > current_rank
    )
  ) then
    update public.deals
      set stage = mapped_stage,
          synced_stage = mapped_stage,
          updated_at = now()
      where id = deal_id;
  end if;

  return deal_id;
end;
$$;

revoke all on function private.find_synced_contact(text, text, boolean) from public, anon;
revoke all on function private.field_locked(text[], text) from public, anon;
revoke all on function private.earlier_timestamp(timestamptz, timestamptz) from public, anon;
revoke all on function private.later_timestamp(timestamptz, timestamptz) from public, anon;
revoke all on function private.resolve_company(text, text, boolean) from public, anon;
revoke all on function private.resolve_tag_ids(text[]) from public, anon;
revoke all on function private.append_contact_history(bigint, jsonb) from public, anon;
revoke all on function private.outreach_deal_stage(text) from public, anon;
revoke all on function private.deal_stage_rank(text) from public, anon;
revoke all on function private.sync_outreach_deal(bigint, jsonb, text) from public, anon;

grant usage on schema private to authenticated, service_role;
grant execute on function private.find_synced_contact(text, text, boolean) to authenticated, service_role;
grant execute on function private.field_locked(text[], text) to authenticated, service_role;
grant execute on function private.earlier_timestamp(timestamptz, timestamptz) to authenticated, service_role;
grant execute on function private.later_timestamp(timestamptz, timestamptz) to authenticated, service_role;
grant execute on function private.resolve_company(text, text, boolean) to authenticated, service_role;
grant execute on function private.resolve_tag_ids(text[]) to authenticated, service_role;
grant execute on function private.append_contact_history(bigint, jsonb) to authenticated, service_role;
grant execute on function private.outreach_deal_stage(text) to authenticated, service_role;
grant execute on function private.deal_stage_rank(text) to authenticated, service_role;
grant execute on function private.sync_outreach_deal(bigint, jsonb, text) to authenticated, service_role;

-- Same signature and grant as before. Email matching now ignores assistant
-- and agent addresses. The writes are marked as sync so they do not lock fields.
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
  tag_ids bigint[];
  policy text;
begin
  perform set_config('app.contact_sync', 'on', true);

  select f.id, f.locked into cid, locked
    from private.find_synced_contact(p_external_id, p_email, true) f;

  locked := coalesce(locked, '{}'::text[]);

  if not private.field_locked(locked, 'company') then
    company := private.resolve_company(p_company_name, null, false);
  end if;

  tag_ids := private.resolve_tag_ids(p_tag_names);

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
      first_name = case when private.field_locked(locked, 'first_name') then first_name else coalesce(nullif(p_first_name, ''), first_name) end,
      last_name = case when private.field_locked(locked, 'last_name') then last_name else coalesce(nullif(p_last_name, ''), last_name) end,
      title = case when private.field_locked(locked, 'title') then title else coalesce(nullif(p_title, ''), title) end,
      email_jsonb = case
        when private.field_locked(locked, 'email') or p_email is null or length(trim(p_email)) = 0 then email_jsonb
        when email_jsonb @> jsonb_build_array(jsonb_build_object('email', lower(p_email))) then email_jsonb
        else coalesce(email_jsonb, '[]'::jsonb) || jsonb_build_array(jsonb_build_object('email', lower(p_email), 'type', 'Work'))
      end,
      company_id = case when private.field_locked(locked, 'company') then company_id else coalesce(company, company_id) end,
      tags = case
        when private.field_locked(locked, 'tags') or cardinality(tag_ids) = 0 then tags
        else (
          select coalesce(array_agg(distinct value), '{}'::bigint[])
          from unnest(coalesce(tags, '{}'::bigint[]) || tag_ids) value
        )
      end,
      external_id = case
        when private.field_locked(locked, 'external_id') then external_id
        else coalesce(nullif(p_external_id, ''), external_id)
      end,
      ask_policy = case when private.field_locked(locked, 'ask_policy') then ask_policy else coalesce(policy, ask_policy) end,
      site_user_id = coalesce(p_site_user_id, site_user_id),
      background = case when private.field_locked(locked, 'background') then background else coalesce(nullif(p_background, ''), background) end,
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

create or replace function public.upsert_outreach_contact(p jsonb)
returns jsonb
language plpgsql
security invoker
set search_path = public
as $$
declare
  cid bigint;
  created boolean := false;
  locked text[];
  email text;
  holder text;
  email_type text;
  v_external_id text;
  company bigint;
  tag_names text[];
  tag_ids bigint[];
  policy text;
  incoming_first timestamptz;
  incoming_last timestamptz;
  derived_status text;
  v_outreach_status text;
  deal_id bigint;
begin
  perform set_config('app.contact_sync', 'on', true);

  email := nullif(trim(coalesce(p->>'email', '')), '');
  holder := nullif(trim(coalesce(p->>'email_holder', '')), '');
  v_external_id := nullif(trim(coalesce(p->>'external_id', '')), '');
  v_outreach_status := nullif(p->>'outreach_status', '');

  select f.id, f.locked into cid, locked
    from private.find_synced_contact(v_external_id, email, holder = 'self') f;

  locked := coalesce(locked, '{}'::text[]);

  if not private.field_locked(locked, 'company') then
    company := private.resolve_company(p->>'company', p->>'company_sector', true);
  end if;

  if p->'tags' is null or jsonb_typeof(p->'tags') <> 'array' then
    tag_names := null;
  else
    tag_names := array(select jsonb_array_elements_text(p->'tags'));
  end if;
  tag_ids := private.resolve_tag_ids(tag_names);

  policy := nullif(p->>'ask_policy', '');
  if policy is null and 'ally' = any (coalesce(tag_names, '{}'::text[])) then
    policy := 'do-not-ask';
  end if;

  email_type := case holder
    when 'assistant' then 'Assistant'
    when 'agent' then 'Agent'
    when 'self' then 'Work'
    else null
  end;

  incoming_first := nullif(p->>'first_contacted_at', '')::timestamptz;
  incoming_last := nullif(p->>'last_contacted_at', '')::timestamptz;

  derived_status := case v_outreach_status
    when 'replied' then 'in-conversation'
    when 'engaged' then 'in-conversation'
    when 'declined' then 'declined'
    else null
  end;

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
      background,
      locked_fields,
      linkedin_url,
      outreach_status,
      first_contacted_at,
      last_contacted_at,
      email_holder,
      contact_via,
      "list"
    ) values (
      coalesce(nullif(p->>'first_name', ''), 'Unknown'),
      nullif(p->>'last_name', ''),
      nullif(p->>'title', ''),
      case
        when email is null or email_type is null then '[]'::jsonb
        else jsonb_build_array(jsonb_build_object('email', lower(email), 'type', email_type))
      end,
      company,
      now(),
      now(),
      false,
      coalesce(derived_status, 'not-contacted'),
      coalesce(tag_ids, '{}'::bigint[]),
      nullif(p->>'source', ''),
      v_external_id,
      policy,
      nullif(p->>'background', ''),
      '{}'::text[],
      nullif(p->>'linkedin_url', ''),
      v_outreach_status,
      incoming_first,
      incoming_last,
      holder,
      nullif(p->>'contact_via', ''),
      nullif(p->>'list', '')
    )
    returning id into cid;
    created := true;
  else
    update public.contacts set
      first_name = case when private.field_locked(locked, 'first_name') then first_name else coalesce(nullif(p->>'first_name', ''), first_name) end,
      last_name = case when private.field_locked(locked, 'last_name') then last_name else coalesce(nullif(p->>'last_name', ''), last_name) end,
      title = case when private.field_locked(locked, 'title') then title else coalesce(nullif(p->>'title', ''), title) end,
      email_jsonb = case
        when private.field_locked(locked, 'email') or email is null or email_type is null then email_jsonb
        when email_jsonb @> jsonb_build_array(jsonb_build_object('email', lower(email), 'type', email_type)) then email_jsonb
        else coalesce(email_jsonb, '[]'::jsonb) || jsonb_build_array(jsonb_build_object('email', lower(email), 'type', email_type))
      end,
      company_id = case when private.field_locked(locked, 'company') then company_id else coalesce(company, company_id) end,
      tags = case
        when private.field_locked(locked, 'tags') or coalesce(cardinality(tag_ids), 0) = 0 then tags
        else (
          select coalesce(array_agg(distinct value), '{}'::bigint[])
          from unnest(coalesce(tags, '{}'::bigint[]) || tag_ids) value
        )
      end,
      external_id = case
        when private.field_locked(locked, 'external_id') then external_id
        else coalesce(v_external_id, external_id)
      end,
      ask_policy = case when private.field_locked(locked, 'ask_policy') then ask_policy else coalesce(policy, ask_policy) end,
      background = case when private.field_locked(locked, 'background') then background else coalesce(nullif(p->>'background', ''), background) end,
      source = case when private.field_locked(locked, 'source') then source else coalesce(nullif(p->>'source', ''), source) end,
      linkedin_url = case when private.field_locked(locked, 'linkedin_url') then linkedin_url else coalesce(nullif(p->>'linkedin_url', ''), linkedin_url) end,
      outreach_status = case when private.field_locked(locked, 'outreach_status') then outreach_status else coalesce(v_outreach_status, outreach_status) end,
      first_contacted_at = case
        when private.field_locked(locked, 'first_contacted_at') then first_contacted_at
        else private.earlier_timestamp(first_contacted_at, incoming_first)
      end,
      last_contacted_at = case
        when private.field_locked(locked, 'last_contacted_at') then last_contacted_at
        else private.later_timestamp(last_contacted_at, incoming_last)
      end,
      email_holder = case when private.field_locked(locked, 'email_holder') then email_holder else coalesce(holder, email_holder) end,
      contact_via = case when private.field_locked(locked, 'contact_via') then contact_via else coalesce(nullif(p->>'contact_via', ''), contact_via) end,
      "list" = case when private.field_locked(locked, 'list') then "list" else coalesce(nullif(p->>'list', ''), "list") end,
      status = case
        when private.field_locked(locked, 'status') or derived_status is null then status
        else derived_status
      end
    where id = cid;
  end if;

  perform private.append_contact_history(cid, p->'history');
  deal_id := private.sync_outreach_deal(cid, p->'deal', v_outreach_status);

  return jsonb_build_object(
    'contact_id', cid,
    'deal_id', deal_id,
    'created', created
  );
end;
$$;

revoke all on function public.upsert_outreach_contact(jsonb) from public, anon;
grant execute on function public.upsert_outreach_contact(jsonb) to service_role, authenticated;

create or replace function public.log_contact_event(p jsonb)
returns jsonb
language plpgsql
security invoker
set search_path = public
as $$
declare
  cid bigint;
  locked text[];
  kind text;
  event_date timestamptz;
  history jsonb;
begin
  perform set_config('app.contact_sync', 'on', true);

  if nullif(p->>'contact_id', '') is not null then
    select id, coalesce(locked_fields, '{}'::text[])
      into cid, locked
    from public.contacts
    where id = (p->>'contact_id')::bigint;
  end if;

  if cid is null and nullif(trim(coalesce(p->>'external_id', '')), '') is not null then
    select f.id, f.locked into cid, locked
      from private.find_synced_contact(p->>'external_id', null, false) f;
  end if;

  if cid is null then
    raise exception 'contact not found';
  end if;

  locked := coalesce(locked, '{}'::text[]);
  kind := coalesce(p->>'kind', '');
  if nullif(trim(coalesce(p->>'date', '')), '') is null then
    event_date := now();
  else
    event_date := (p->>'date')::timestamptz;
  end if;

  history := jsonb_build_array(jsonb_build_object(
    'date', event_date,
    'kind', kind,
    'subject', p->>'subject',
    'text', p->>'text'
  ));
  perform private.append_contact_history(cid, history);

  if kind in ('email-sent', 'reply')
     and not private.field_locked(locked, 'last_contacted_at') then
    update public.contacts
      set last_contacted_at = private.later_timestamp(last_contacted_at, event_date)
      where id = cid;
  end if;

  return jsonb_build_object('contact_id', cid);
end;
$$;

revoke all on function public.log_contact_event(jsonb) from public, anon;
grant execute on function public.log_contact_event(jsonb) to service_role, authenticated;
