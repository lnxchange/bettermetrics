# SEO monitor (`scripts/seo`)

Weekly, automated SEO health check for **aimtheory.org**, run by
`.github/workflows/seo-monitor.yml` (Mondays 07:00 Sydney, plus manual
dispatch). It crawls the live site as Googlebot, checks every page against
the rules below, fills missing article metadata, tells search engines what
changed, pulls organic-traffic numbers, and emails a Markdown report. A GitHub
issue is opened when anything fails or regresses. Only the weekly scheduled
run sends email; tick `send_email` when dispatching manually to get one.

> **Vercel Web Analytics: use the CLI / REST API, never the Vercel MCP.**
> The MCP tools (`aggregate_pageviews`, `count_pageviews`, observability
> queries) return `404 Web Analytics not found` for this project even though
> analytics is enabled and populated. Do not conclude analytics is off from
> that error. `traffic.ts` calls `https://api.vercel.com/v1/query/web-analytics/...`
> with `VERCEL_TOKEN`, which is exactly what `vercel api ... --method GET` does:
>
> ```sh
> vercel api "/v1/query/web-analytics/visits/aggregate?projectId=prj_xIOsq7oNKYobDGdBEG5L3Q7vsC0A&teamId=team_T6k1ldIUXFXt6J1HsBksNBzy&by=referrerHostname&since=2026-10-13T00:00:00.000Z&until=2026-10-20T23:59:59.000Z" --method GET
> ```
>
> `by` accepts `hour day week month year country deviceType environment requestPath referrerHostname osName browserName route utm*`; `filter` is OData, e.g. `referrerHostname in ('google.com','bing.com')`.

## Pipeline

| Step | Script | Reads | Writes |
|---|---|---|---|
| 1 | `crawl.ts` | `/robots.txt`, `/sitemap.xml`, every sitemap URL | `seo-output/crawl.json` |
| 2 | `checks.ts` | `crawl.json`, `seo-output/previous/*` | `seo-output/checks.json` |
| 3 | `fix-articles.ts` | Supabase `articles` | Supabase (with `--apply`), `seo-output/fixes.json` |
| 4 | `ping.ts` | `fixes.json`, `checks.json`, sitemap | IndexNow, Search Console, `seo-output/ping.json` |
| 5 | `traffic.ts` | Vercel Analytics, Search Console, GA4 | `seo-output/traffic.json` |
| 6 | Lighthouse CI | `lighthouserc.json` | `.lighthouseci/` |
| 7 | `report.ts` | all of the above | `seo-output/report.md`, `summary.json`, email |

`seo-output/` and `.lighthouseci/` are gitignored. In Actions, the previous
run's `seo-output/` is restored into `seo-output/previous/` so `checks.ts`
can report regressions, resolved findings, and pages that appeared or
disappeared from the sitemap.

## Rules (`checks.ts`)

| Rule | Severity | Threshold |
|---|---|---|
| `status` | fail | every sitemap URL must return 200 |
| `noindex` | fail | no `noindex` in `<meta name="robots">` or `X-Robots-Tag` |
| `canonical-missing` / `canonical-mismatch` | fail | canonical present and equal to the page URL |
| `title-missing` / `title-length` | fail / warn | 30–60 characters |
| `description-missing` / `description-length` | fail / warn | 70–160 characters |
| `h1-count` | fail | exactly one `<h1>` |
| `jsonld-missing` / `jsonld-invalid` | fail | at least one parseable `application/ld+json` block |
| `og-image-missing` / `og-image-broken` | warn / fail | `og:image` present and fetchable as an image |
| `html-size` | fail / warn | HTML ≤ 500 KB (treatise chapters ≤ 2.5 MB; they are whole book chapters and the RSC payload repeats the content) |
| `ttfb` | warn | first byte within 3 s |
| `redirect-in-sitemap` | warn | sitemap URLs should not redirect |
| host checks | fail | `robots.txt` and `sitemap.xml` 200; unknown article/term/chapter URLs 404; legacy `.md` URLs 301; `*.vercel.app` hosts redirect or are noindexed; `usebettermetrics.com` redirects |

Exit codes are always 0; the workflow reads `status` from `summary.json`.

## Auto-fix policy (`fix-articles.ts`)

The only step that writes anything. It fills `meta_title`,
`meta_description`, `structured_data` and `seo_optimized_at` for published
articles where any of those is missing or the title is filename-like
(`report_6_1_...`). It uses `optimizeArticleSEO` from `lib/seo-optimizer.ts`
(model `SEO_CLAUDE_MODEL`, default `claude-opus-5-5`). It never changes
`title`, `content` or publication state, never persists the optimiser's
heuristic fallback, and processes at most `SEO_FIX_LIMIT` (15) articles per
run. Locally it is a dry run unless you pass `--apply`.

## Running locally

```sh
npm run seo:crawl          # production, or SEO_SITE_URL=http://localhost:3000 npm run seo:crawl
npm run seo:checks
npm run seo:fix            # dry run; add -- --apply to write
npm run seo:ping -- --dry-run
npm run seo:traffic        # needs VERCEL_TOKEN (vercel CLI login token works)
npm run seo:report         # add -- --email to send via Resend
npm run seo:monitor        # all of the above, fix in dry-run, ping in dry-run
npm run seo:lighthouse     # Lighthouse CI against production
```

`.env.local` is loaded automatically. Testing against a local `next start`
build: the sitemap lists production URLs, so `crawl.ts` rewrites them to
`SEO_SITE_URL`; canonical checks then compare paths only.

## Environment / GitHub secrets

| Variable | Used by | Required |
|---|---|---|
| `VERCEL_TOKEN` | traffic | yes (organic traffic is the headline metric) |
| `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | fix-articles | yes |
| `ANTHROPIC_API_KEY` | fix-articles | yes for `--apply` |
| `RESEND_API_KEY`, `SEO_REPORT_TO` | report | for the email |
| `INDEXNOW_KEY` | ping (and the site, to serve `/indexnow-key.txt`) | optional; must match in Vercel and GitHub |
| `GSC_SERVICE_ACCOUNT_JSON` | ping, traffic | optional; service account with Full permission on `sc-domain:aimtheory.org` |
| `GA4_SERVICE_ACCOUNT_JSON`, `GA4_PROPERTY_ID` | traffic | optional; Viewer on the GA4 property |
| `PAGESPEED_API_KEY` | (reserved) | optional |
| `SEO_SITE_URL` | all | override the site under test |
| `SEO_FIX_APPLY`, `SEO_FIX_LIMIT`, `SEO_CLAUDE_MODEL` | fix-articles | optional |
| `SEO_GOOGLE_INDEXING` | ping | set `true` to also call the Indexing API |
| `SEO_REPORT_FROM` | report | optional sender override |

Service-account JSON may be pasted raw or base64-encoded.
