# aimtheory.org

The site for the AIM Framework, a general theory of human motivation: Appetites, Intrinsic Motivation, and Mimetic Desire. It publishes the theory, the treatise, a glossary, and articles, and includes a chat for questions about the framework.

Next.js 13.4, npm, Node 22.

## Commands

```bash
npm install
npm run dev
npm run build
npm start
```

`npm run dev` serves the site at [http://localhost:3000](http://localhost:3000).

## Admin

`/admin` is the Atomic CRM. Only a signed-in user with `is_admin: true` in their Supabase user metadata can open it. See [docs/ADMIN_SETUP.md](docs/ADMIN_SETUP.md).

## Environment

Environment variables are documented in [`.env.example`](.env.example). Copy that file to `.env.local` and fill in the values.

## Migrations

SQL migrations live in `supabase/migrations`. Apply them with the Supabase CLI:

```bash
supabase db push
```
