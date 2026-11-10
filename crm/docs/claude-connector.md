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

1. Stay signed in at [aimtheory.org](https://aimtheory.org) as the administrator. That site login is what lets the approval page open. It is a different step from Claude's first connection check.
2. Open claude.ai → Settings → Connectors → Add custom connector.
3. Paste the connector URL above.
4. Claude first checks the server with no login. That check is a 401. It means "sign-in is required," and it is the expected answer. It is not a rejection of your aimtheory session.
5. The browser should then open `https://aimtheory.org/admin#/oauth/consent`. Click Approve. Until that button is clicked, Claude has nothing to finish and reports that the connection timed out.

The approval page is `src/components/supabase/oauth-consent-page.tsx`. The hosted consent address is `https://aimtheory.org/admin#/oauth/consent`. A slash before the hash (`/admin/#/...`) makes the site redirect and drop the approval id, which is what made the connection time out.

## What Claude can do

`upsert_outreach_contact` writes one outreach contact, its history notes, and its deal. It matches `external_id` first, and matches an email only when `email_holder` is `self`. An assistant or agent address is stored with that holder and is not the person's own email.

`log_contact_event` adds one history note. When the kind is `email-sent` or `reply`, `last_contacted_at` moves later. It never moves earlier.

Both tools run as the signed-in user, under the same row-level security as the CRM. Fields listed in `locked_fields` are left as the CRM user edited them. `first_contacted_at` only moves earlier and `last_contacted_at` only moves later.

## Hosted project

The CRM project is `szwxjzzyfevvnpaewyph` in `ap-southeast-2`. The `mcp` function is deployed there with JWT verification off. An unauthenticated request gets `401` and a `WWW-Authenticate` header. That is the discovery response, not a failed login. The OAuth server is enabled, with dynamic client registration. The consent address is `https://aimtheory.org/admin#/oauth/consent`. Signup stays closed. Tokens are signed with an ES256 key. `SUPABASE_DB_URL` and `CRM_BASE_URL` (`https://aimtheory.org/admin`) are set on the function.
