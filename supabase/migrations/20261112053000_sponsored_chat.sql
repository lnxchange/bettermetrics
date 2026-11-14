-- Sponsored Ask the AI. Site database only (mlwjklukwwaljtwysmna).
-- Service role only. No policies for anon or authenticated.

alter table public.chat_settings
  add column if not exists sponsored_daily_questions integer not null default 15,
  add column if not exists sponsored_monthly_usd numeric not null default 5,
  add column if not exists site_monthly_cap_usd numeric not null default 40,
  add column if not exists site_paid_model text not null default 'claude-sonnet-5-5',
  add column if not exists site_paid_max_output_tokens integer not null default 2000;

alter table public.chat_settings drop constraint if exists chat_settings_site_cap_check;
alter table public.chat_settings
  add constraint chat_settings_site_cap_check check (site_monthly_cap_usd >= 0 and site_monthly_cap_usd <= 50);

alter table public.chat_usage
  add column if not exists cost_usd numeric,
  add column if not exists paid_by text,
  add column if not exists cache_write_tokens integer;

create table if not exists public.chat_model_prices (
  model text primary key,
  input_usd_per_mtok numeric not null,
  output_usd_per_mtok numeric not null,
  cache_write_5m_usd_per_mtok numeric not null,
  cache_write_1h_usd_per_mtok numeric not null,
  cache_read_usd_per_mtok numeric not null
);

alter table public.chat_model_prices enable row level security;
revoke all on public.chat_model_prices from anon, authenticated;
grant all on public.chat_model_prices to service_role;

-- Published prices, 12 Nov 2026:
-- https://platform.claude.com/docs/en/about-claude/pricing
insert into public.chat_model_prices (
  model, input_usd_per_mtok, output_usd_per_mtok,
  cache_write_5m_usd_per_mtok, cache_write_1h_usd_per_mtok, cache_read_usd_per_mtok
) values
  ('claude-sonnet-5-5', 2, 10, 2.5, 4, 0.10),
  ('claude-opus-5-5', 4, 20, 5, 8, 0.20)
on conflict (model) do nothing;

create table if not exists public.chat_invites (
  id bigint generated always as identity primary key,
  crm_contact_id text not null,
  email text not null,
  token_hash text not null unique,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  redeemed_at timestamptz,
  redeemed_user_id uuid,
  revoked_at timestamptz
);

create index if not exists chat_invites_contact_idx on public.chat_invites (crm_contact_id);

alter table public.chat_invites enable row level security;
revoke all on public.chat_invites from anon, authenticated;
grant all on public.chat_invites to service_role;

create table if not exists public.chat_spend_reservations (
  id uuid primary key default gen_random_uuid(),
  month date not null,
  user_id uuid,
  estimated_usd numeric not null,
  actual_usd numeric,
  status text not null check (status in ('reserved', 'settled', 'released')),
  created_at timestamptz not null default now()
);

create index if not exists chat_spend_reservations_month_idx on public.chat_spend_reservations (month, status);

alter table public.chat_spend_reservations enable row level security;
revoke all on public.chat_spend_reservations from anon, authenticated;
grant all on public.chat_spend_reservations to service_role;

create table if not exists public.chat_budget_alerts (
  month date not null,
  threshold text not null check (threshold in ('50', '80', '100')),
  sent_at timestamptz not null default now(),
  primary key (month, threshold)
);

alter table public.chat_budget_alerts enable row level security;
revoke all on public.chat_budget_alerts from anon, authenticated;
grant all on public.chat_budget_alerts to service_role;

create table if not exists public.invite_rate_limits (
  bucket text not null,
  window_start timestamptz not null,
  count integer not null default 0,
  primary key (bucket, window_start)
);

alter table public.invite_rate_limits enable row level security;
revoke all on public.invite_rate_limits from anon, authenticated;
grant all on public.invite_rate_limits to service_role;

-- One transaction. Refuses when this reservation would take the UTC month past the cap.
create or replace function public.reserve_site_chat_spend(
  p_user_id uuid,
  p_estimated numeric,
  p_cap numeric
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_month date := (date_trunc('month', now() at time zone 'utc'))::date;
  v_spent numeric;
  v_id uuid;
begin
  if p_cap < 0 or p_cap > 50 then
    return jsonb_build_object('ok', false, 'reason', 'cap');
  end if;
  if p_estimated < 0 then
    return jsonb_build_object('ok', false, 'reason', 'estimate');
  end if;

  perform pg_advisory_xact_lock(hashtext('site-chat-spend-' || v_month::text));

  select coalesce(sum(case when status = 'settled' then actual_usd else estimated_usd end), 0)
    into v_spent
  from chat_spend_reservations
  where month = v_month and status in ('reserved', 'settled');

  if v_spent + p_estimated > p_cap then
    return jsonb_build_object('ok', false, 'reason', 'cap', 'spent', v_spent);
  end if;

  insert into chat_spend_reservations (month, user_id, estimated_usd, status)
  values (v_month, p_user_id, p_estimated, 'reserved')
  returning id into v_id;

  return jsonb_build_object('ok', true, 'id', v_id, 'spent', v_spent);
end;
$$;

revoke all on function public.reserve_site_chat_spend(uuid, numeric, numeric) from public, anon, authenticated;
grant execute on function public.reserve_site_chat_spend(uuid, numeric, numeric) to service_role;

create or replace function public.settle_site_chat_spend(p_id uuid, p_actual numeric)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update chat_spend_reservations
  set status = 'settled', actual_usd = greatest(p_actual, 0)
  where id = p_id and status = 'reserved';
end;
$$;

revoke all on function public.settle_site_chat_spend(uuid, numeric) from public, anon, authenticated;
grant execute on function public.settle_site_chat_spend(uuid, numeric) to service_role;

create or replace function public.release_site_chat_spend(p_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update chat_spend_reservations
  set status = 'released', actual_usd = 0
  where id = p_id and status = 'reserved';
end;
$$;

revoke all on function public.release_site_chat_spend(uuid) from public, anon, authenticated;
grant execute on function public.release_site_chat_spend(uuid) to service_role;
