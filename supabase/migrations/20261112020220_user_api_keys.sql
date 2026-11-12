-- A signed-in reader's own Anthropic API key.
--
-- Chat bills this key instead of the site key. The ciphertext is AES-256-GCM
-- from lib/byok.ts and is decrypted only on the server. The Data API cannot
-- read this table: there are no policies for anon or authenticated, and those
-- roles have no grants. The service role, used by the Next.js routes, bypasses
-- row level security.

create table public.user_api_keys (
  user_id uuid not null references auth.users (id) on delete cascade,
  provider text not null default 'anthropic' check (provider = 'anthropic'),
  ciphertext text not null check (length(ciphertext) > 0),
  hint text not null check (length(hint) between 4 and 8),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, provider)
);

alter table public.user_api_keys enable row level security;

revoke all on public.user_api_keys from anon, authenticated;
grant all on public.user_api_keys to service_role;
