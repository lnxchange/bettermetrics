-- Admin controls for Ask the AI, an audit of those changes, and usage counts.
-- The Data API cannot read these tables. The Next.js routes use the service role.

create table public.chat_settings (
  id integer primary key default 1 check (id = 1),
  paused boolean not null default false,
  paused_message text not null,
  providers jsonb not null,
  models jsonb not null,
  max_output_tokens integer not null,
  treatise_context_max_chars integer not null,
  max_messages integer not null,
  max_conversation_chars integer not null,
  questions_per_user_hour integer not null,
  questions_per_user_day integer not null,
  questions_per_ip_day integer not null,
  guest_chat boolean not null default false,
  guest_daily_per_ip integer not null default 5,
  guest_daily_global integer not null default 100,
  cache jsonb not null,
  anthropic_cache_ttl text not null default '5m' check (anthropic_cache_ttl in ('5m', '1h')),
  notice_markdown text not null,
  updated_at timestamptz not null default now()
);

alter table public.chat_settings enable row level security;
revoke all on public.chat_settings from anon, authenticated;
grant all on public.chat_settings to service_role;

create table public.chat_settings_log (
  id bigint generated always as identity primary key,
  user_id uuid,
  email text,
  setting text not null,
  old_value jsonb,
  new_value jsonb,
  created_at timestamptz not null default now()
);

alter table public.chat_settings_log enable row level security;
revoke all on public.chat_settings_log from anon, authenticated;
grant all on public.chat_settings_log to service_role;

create table public.chat_usage (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  user_id uuid,
  provider text,
  model text,
  input_tokens integer,
  output_tokens integer,
  cached_tokens integer,
  context_chars integer,
  outcome text not null,
  ip_hash text
);

create index chat_usage_created_idx on public.chat_usage (created_at);
create index chat_usage_user_idx on public.chat_usage (user_id, created_at);

alter table public.chat_usage enable row level security;
revoke all on public.chat_usage from anon, authenticated;
grant all on public.chat_usage to service_role;

create table public.api_key_save_attempts (
  bucket text not null,
  window_start timestamptz not null,
  count integer not null default 0,
  primary key (bucket, window_start)
);

alter table public.api_key_save_attempts enable row level security;
revoke all on public.api_key_save_attempts from anon, authenticated;
grant all on public.api_key_save_attempts to service_role;
