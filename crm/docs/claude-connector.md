# Claude connector for the AIM CRM

Claude connects to the CRM as a custom connector. The connector talks to the MCP server, and the MCP server runs as the CRM user who approves it.

## Connector URL

```
https://szwxjzzyfevvnpaewyph.supabase.co/functions/v1/mcp
```

Store this as the CRM project URL for the GitHub Action in `lnxchange/aim-treatise`:

```
CRM_SUPABASE_URL=https://szwxjzzyfevvnpaewyph.supabase.co
```

The outreach record is `public.upsert_outreach_contact(p jsonb) returns jsonb`. The Action calls it with the service-role key:

```
POST /rest/v1/rpc/upsert_outreach_contact
```

## Who signs in

Sign in as the aimtheory.org administrator. That person is the CRM staff user. The CRM does not accept public signup: `handle_new_user` still rejects a new account once a staff row exists, unless the account was invited.

Do this while already signed in at [aimtheory.org](https://aimtheory.org) as that administrator. The CRM is served at `/admin`, and the site asks for an administrator session before the page loads. The consent address lives in the URL hash, which a sign-in redirect would drop.

## Add the connector

1. Open claude.ai → Settings → Connectors → Add custom connector.
2. Paste the connector URL above.
3. When the browser opens, you land on `https://aimtheory.org/admin#/oauth/consent`.
4. Sign in to the CRM if it asks, then approve access.
5. Ask Claude to run `get_schema`, then a read-only `query` against `contacts_summary`.

The CRM consent screen is the page in `src/components/supabase/oauth-consent-page.tsx`. The authorization path configured for local development is `/#/oauth/consent`. On the hosted project the site URL must be `https://aimtheory.org/admin`, so the full consent address is `https://aimtheory.org/admin#/oauth/consent`.

## What Claude can do

`upsert_outreach_contact` writes one outreach contact, its history notes, and its deal. It matches `external_id` first, and matches an email only when `email_holder` is `self`. An assistant or agent address is stored with that holder and is not the person's own email.

`log_contact_event` adds one history note. When the kind is `email-sent` or `reply`, `last_contacted_at` moves later. It never moves earlier.

Both tools run as the signed-in user, under the same row-level security as the CRM. Fields listed in `locked_fields` are left as the CRM user edited them. `first_contacted_at` only moves earlier and `last_contacted_at` only moves later.

## Hosted project

The CRM project is `szwxjzzyfevvnpaewyph` in `ap-southeast-2`.

As of this change the hosted OAuth server answers `OAuth server is disabled`, and `POST /functions/v1/mcp` answers 404 because the function has not been deployed yet. Turn the OAuth server on in Authentication → OAuth Server, with dynamic client registration enabled and the authorization path `/#/oauth/consent`. Set the auth site URL to `https://aimtheory.org/admin`. Leave signup closed. The project must sign tokens with an asymmetric key, because the MCP server verifies the user JWT against the project JWKS.

Deploy the function from `crm/` with JWT verification off, matching `supabase/config.toml`:

```
supabase link --project-ref szwxjzzyfevvnpaewyph
supabase db push
supabase functions deploy mcp --no-verify-jwt
supabase secrets set CRM_BASE_URL=https://aimtheory.org/admin
```

`CRM_BASE_URL` is what the task list uses to link back to a contact. Confirm the function can read `SUPABASE_DB_URL`. If the platform does not inject it, set that secret from the project's database URL.
