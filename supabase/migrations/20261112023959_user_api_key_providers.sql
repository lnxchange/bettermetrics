-- Readers can bill chat to Anthropic, OpenAI, Google Gemini, or OpenRouter.
-- OpenRouter is the key for other model hosts. An optional model id overrides
-- the default for that provider. The id is a request field, not part of a URL.

alter table public.user_api_keys drop constraint user_api_keys_provider_check;

alter table public.user_api_keys
  add constraint user_api_keys_provider_check
  check (provider in ('anthropic', 'openai', 'google', 'openrouter'));

alter table public.user_api_keys
  add column model text;

alter table public.user_api_keys
  add constraint user_api_keys_model_check
  check (model is null or model ~ '^[A-Za-z0-9._:/-]{1,80}$');
