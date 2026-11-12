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

Do this while already signed in at [aimtheory.org](https://aimtheory.org) as that administrator. The approval page is part of the site, and the site asks for an administrator session before it loads.

## Add the connector

1. Stay signed in at [aimtheory.org](https://aimtheory.org) as the administrator.
2. Open claude.ai → Settings → Connectors → Add custom connector.
3. Paste the connector URL above. Do not open the approval address yourself.
4. Claude first checks the server with no login. That check is a 401. It means "sign-in is required," and it is the expected answer.
5. The browser then opens `https://aimtheory.org/admin/oauth/consent?authorization_id=...`. The approval id is in that address, before any `#`. Click **Approve**. The connection is not finished until that button is clicked.

The approval page is `app/admin/oauth/consent/page.tsx`. It reads `authorization_id` from the query string and approves as the signed-in administrator. An address with the id only after `#` loses it when the site sends the browser to sign-in, and the CRM then reports that the approval id is missing.

## What Claude can do

`upsert_outreach_contact` writes one outreach contact, its history notes, and its deal. It matches `external_id` first, and matches an email only when `email_holder` is `self`. An assistant or agent address is stored with that holder and is not the person's own email.

`log_contact_event` adds one history note. When the kind is `email-sent` or `reply`, `last_contacted_at` moves later. It never moves earlier.

Both tools run as the signed-in user, under the same row-level security as the CRM. Fields listed in `locked_fields` are left as the CRM user edited them. `first_contacted_at` only moves earlier and `last_contacted_at` only moves later.

## Hosted project

The CRM project is `szwxjzzyfevvnpaewyph` in `ap-southeast-2`. The `mcp` function is deployed there with JWT verification off. An unauthenticated request gets `401` and a `WWW-Authenticate` header. That is the discovery response, not a failed login. The OAuth server is enabled, with dynamic client registration. The consent address is `https://aimtheory.org/admin/oauth/consent`. Signup stays closed. Tokens are signed with an ES256 key. `SUPABASE_DB_URL` and `CRM_BASE_URL` (`https://aimtheory.org/admin`) are set on the function.
