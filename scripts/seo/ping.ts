/**
 * scripts/seo/ping.ts
 *
 * Tells search engines what changed.
 *
 *  1. IndexNow (Bing, Yandex, Seznam, Naver share the index) – POSTs the URLs
 *     changed this run. Needs INDEXNOW_KEY; the site serves the key at
 *     /indexnow-key.txt (app/indexnow-key.txt/route.ts) so nothing is
 *     committed to the repo.
 *  2. Google Search Console sitemaps.submit – when GSC_SERVICE_ACCOUNT_JSON is
 *     set (service account must have Full permission on the property). Google
 *     retired the anonymous /ping?sitemap= endpoint in 2023, so this is the
 *     only supported way to nudge a sitemap re-read.
 *  3. Google Indexing API – optional, only when GSC_SERVICE_ACCOUNT_JSON is set
 *     AND SEO_GOOGLE_INDEXING=true. Google documents it for JobPosting /
 *     BroadcastEvent pages only, so it is off by default.
 *
 * "Changed URLs" = articles fixed by fix-articles.ts + sitemap entries whose
 * <lastmod> falls inside the last SEO_PING_WINDOW_DAYS (default 8) + any
 * pages that are new since the previous crawl.
 *
 * Output: seo-output/ping.json
 */
import type { ChecksOutput } from './lib'
import { GOOGLEBOT_UA, SITE_HOST, SITE_URL, daysAgo, decodeEntities, hasFlag, outPath, readJson, safeFetch, writeJson } from './lib'
import type { FixesOutput } from './fix-articles'
import { SCOPES, googleFetch, parseServiceAccount } from './google-auth'

export interface PingOutput {
  ranAt: string
  changedUrls: string[]
  indexNow: { attempted: boolean; status?: number; detail: string }
  googleSitemap: { attempted: boolean; status?: number; detail: string }
  googleIndexing: { attempted: boolean; submitted: number; detail: string }
}

function recentSitemapUrls(xml: string, since: Date): string[] {
  const urls: string[] = []
  for (const block of Array.from(xml.matchAll(/<url>([\s\S]*?)<\/url>/g))) {
    const loc = block[1].match(/<loc>\s*([^<\s]+)\s*<\/loc>/)
    const lastmod = block[1].match(/<lastmod>\s*([^<\s]+)\s*<\/lastmod>/)
    if (!loc || !lastmod) continue
    const date = new Date(lastmod[1])
    if (!Number.isNaN(date.getTime()) && date >= since) urls.push(decodeEntities(loc[1]))
  }
  return urls
}

async function main() {
  const dryRun = hasFlag('--dry-run')
  const windowDays = Number(process.env.SEO_PING_WINDOW_DAYS || 8)

  const fixes = readJson<FixesOutput>(outPath('fixes.json'))
  const checks = readJson<ChecksOutput>(outPath('checks.json'))

  const changed = new Set<string>()
  for (const record of fixes?.records ?? []) if (record.applied) changed.add(record.url)
  for (const url of checks?.newPages ?? []) changed.add(url)

  const sitemapResponse = await safeFetch(`${SITE_URL}/sitemap.xml`, { headers: { 'user-agent': GOOGLEBOT_UA } })
  if (sitemapResponse?.ok) {
    const xml = await sitemapResponse.text()
    // Static routes carry "now" as lastmod and would always look changed; keep
    // only database-backed sections.
    for (const url of recentSitemapUrls(xml, daysAgo(windowDays))) {
      if (/\/(articles|treatise|glossary)\/[^/]+$/.test(url)) changed.add(url)
    }
  }

  // Only ever submit production URLs.
  const changedUrls = Array.from(changed).filter(url => url.startsWith(`https://${SITE_HOST}/`)).slice(0, 10_000)

  const output: PingOutput = {
    ranAt: new Date().toISOString(),
    changedUrls,
    indexNow: { attempted: false, detail: 'skipped' },
    googleSitemap: { attempted: false, detail: 'skipped' },
    googleIndexing: { attempted: false, submitted: 0, detail: 'skipped' }
  }

  console.log(`${changedUrls.length} changed URL(s) in the last ${windowDays} days${dryRun ? ' (dry run)' : ''}`)

  // 1. IndexNow
  const indexNowKey = process.env.INDEXNOW_KEY?.trim()
  if (!indexNowKey) {
    output.indexNow.detail = 'INDEXNOW_KEY not set'
  } else if (changedUrls.length === 0) {
    output.indexNow.detail = 'nothing changed'
  } else if (dryRun) {
    output.indexNow.detail = `would submit ${changedUrls.length} URL(s)`
  } else {
    const keyCheck = await safeFetch(`${SITE_URL}/indexnow-key.txt`)
    const servedKey = keyCheck?.ok ? (await keyCheck.text()).trim() : ''
    if (servedKey !== indexNowKey) {
      output.indexNow.detail = `site serves ${keyCheck?.status ?? 'ERR'} at /indexnow-key.txt and the key does not match INDEXNOW_KEY; set INDEXNOW_KEY in Vercel`
    } else {
      output.indexNow.attempted = true
      const response = await safeFetch('https://api.indexnow.org/indexnow', {
        method: 'POST',
        headers: { 'content-type': 'application/json; charset=utf-8' },
        body: JSON.stringify({
          host: SITE_HOST,
          key: indexNowKey,
          keyLocation: `${SITE_URL}/indexnow-key.txt`,
          urlList: changedUrls
        })
      })
      output.indexNow.status = response?.status
      output.indexNow.detail = response
        ? response.status === 200 || response.status === 202
          ? `accepted ${changedUrls.length} URL(s)`
          : `rejected: ${response.status} ${(await response.text()).slice(0, 200)}`
        : 'network error'
    }
  }
  console.log(`IndexNow: ${output.indexNow.detail}`)

  // 2 & 3. Google via service account
  const account = parseServiceAccount(process.env.GSC_SERVICE_ACCOUNT_JSON)
  if (!account) {
    output.googleSitemap.detail = 'GSC_SERVICE_ACCOUNT_JSON not set'
    output.googleIndexing.detail = 'GSC_SERVICE_ACCOUNT_JSON not set'
  } else {
    const siteUrlParam = encodeURIComponent(process.env.GSC_PROPERTY || `sc-domain:${SITE_HOST}`)
    const feed = encodeURIComponent(`${SITE_URL}/sitemap.xml`)
    if (dryRun) {
      output.googleSitemap.detail = 'would submit sitemap'
    } else {
      output.googleSitemap.attempted = true
      try {
        const response = await googleFetch(
          account,
          SCOPES.searchConsole,
          `https://www.googleapis.com/webmasters/v3/sites/${siteUrlParam}/sitemaps/${feed}`,
          { method: 'PUT' }
        )
        output.googleSitemap.status = response.status
        output.googleSitemap.detail = response.ok ? 'sitemap submitted' : `failed: ${response.status} ${(await response.text()).slice(0, 200)}`
      } catch (err) {
        output.googleSitemap.detail = err instanceof Error ? err.message : String(err)
      }
    }

    if (process.env.SEO_GOOGLE_INDEXING === 'true' && changedUrls.length > 0 && !dryRun) {
      output.googleIndexing.attempted = true
      let submitted = 0
      const errors: string[] = []
      for (const url of changedUrls.slice(0, 180)) {
        try {
          const response = await googleFetch(account, SCOPES.indexing, 'https://indexing.googleapis.com/v3/urlNotifications:publish', {
            method: 'POST',
            body: JSON.stringify({ url, type: 'URL_UPDATED' })
          })
          if (response.ok) submitted++
          else errors.push(`${url}: ${response.status}`)
        } catch (err) {
          errors.push(`${url}: ${err instanceof Error ? err.message : String(err)}`)
        }
      }
      output.googleIndexing.submitted = submitted
      output.googleIndexing.detail = errors.length ? `${submitted} ok, ${errors.length} failed (${errors[0]})` : `${submitted} submitted`
    } else if (process.env.SEO_GOOGLE_INDEXING !== 'true') {
      output.googleIndexing.detail = 'disabled (set SEO_GOOGLE_INDEXING=true to enable)'
    }
  }
  console.log(`Google sitemap: ${output.googleSitemap.detail}`)
  console.log(`Google Indexing API: ${output.googleIndexing.detail}`)

  writeJson('ping.json', output)
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
