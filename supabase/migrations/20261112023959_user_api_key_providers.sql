-- Readers can keep one key for each of Anthropic, OpenAI, Google, and OpenRouter.
-- `active` is the provider chat uses. A reader with one key uses that key.

alter table public.user_api_keys drop constraint if exists user_api_keys_provider_check;

alter table public.user_api_keys
  add constraint user_api_keys_provider_check
  check (provider in ('anthropic', 'openai', 'google', 'openrouter'));

alter table public.user_api_keys
  add column if not exists active boolean not null default false;
