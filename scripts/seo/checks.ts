/**
 * scripts/seo/checks.ts
 *
 * Evaluates seo-output/crawl.json against the on-page rules below, verifies
 * robots.txt, sitemap.xml and the duplicate/legacy hosts, then diffs the
 * findings against the previous run (seo-output/previous/checks.json) to
 * surface regressions, resolved issues and pages that appeared/disappeared.
 *
 * Severity:
 *   fail – blocks indexing or ranking (non-200, noindex, bad canonical, H1
 *          count != 1, invalid JSON-LD, HTML > 500 KB, broken og:image)
 *   warn – worth fixing (title/description length, missing og:image, redirect
 *          inside the sitemap)
 *
 * Output: seo-output/checks.json. Exit code is always 0; the workflow reads
 * `status` from the JSON so one failing page does not abort the pipeline.
 */
import {
  ChecksOutput,
  CrawlOutput,
  Finding,
  GOOGLEBOT_UA,
  SITE_HOST,
  SITE_URL,
  mapLimit,
  outPath,
  prevPath,
  readJson,
  safeFetch,
  writeJson
} from './lib'

const PRODUCTION_HOST = 'aimtheory.org'
const MAX_HTML_BYTES = 500 * 1024
// Long-form treatise chapters are whole book chapters (plus formulae) and the
// RSC flight payload repeats the content, so they get a higher ceiling.
const MAX_TREATISE_HTML_BYTES = 2500 * 1024
const TITLE_RANGE: [number, number] = [30, 60]
const DESCRIPTION_RANGE: [number, number] = [70, 160]

function normaliseUrl(url: string) {
  try {
    const parsed = new URL(url)
    parsed.hash = ''
    parsed.search = ''
    let pathname = parsed.pathname.replace(/\/+$/, '')
    if (pathname === '') pathname = '/'
    return `${parsed.origin}${pathname}`
  } catch {
    return url
  }
}

function pageFindings(crawl: CrawlOutput): Finding[] {
  const findings: Finding[] = []
  const add = (url: string, rule: string, severity: Finding['severity'], detail: string) =>
    findings.push({ url, rule, severity, detail })

  for (const page of crawl.pages) {
    if (page.status !== 200) {
      add(page.url, 'status', 'fail', `HTTP ${page.status ?? 'ERR'} ${page.error ?? ''}`.trim())
      continue
    }
    if (page.redirects.length > 0) {
      add(page.url, 'redirect-in-sitemap', 'warn', page.redirects.join(' ; '))
    }
    if (!page.contentType || !page.contentType.includes('text/html')) {
      add(page.url, 'content-type', 'fail', `content-type ${page.contentType ?? 'missing'}`)
      continue
    }

    const robots = `${page.robotsMeta ?? ''} ${page.xRobotsTag ?? ''}`.toLowerCase()
    if (robots.includes('noindex')) {
      add(page.url, 'noindex', 'fail', `robots="${page.robotsMeta ?? ''}" x-robots-tag="${page.xRobotsTag ?? ''}"`)
    }

    if (!page.canonical) {
      add(page.url, 'canonical-missing', 'fail', 'no <link rel="canonical">')
    } else {
      const canonicalUrl = new URL(page.canonical, SITE_URL)
      const pageUrl = new URL(page.finalUrl)
      const samePath = normaliseUrl(canonicalUrl.toString()).replace(canonicalUrl.origin, '') === normaliseUrl(pageUrl.toString()).replace(pageUrl.origin, '')
      // A localhost or preview build legitimately declares the production
      // canonical; on production the host must match exactly.
      const hostOk = pageUrl.host !== PRODUCTION_HOST || canonicalUrl.host === PRODUCTION_HOST
      if (!samePath || !hostOk) {
        add(page.url, 'canonical-mismatch', 'fail', `canonical ${page.canonical}`)
      }
    }

    if (!page.title) {
      add(page.url, 'title-missing', 'fail', 'no <title>')
    } else if (page.title.length < TITLE_RANGE[0] || page.title.length > TITLE_RANGE[1]) {
      add(page.url, 'title-length', 'warn', `${page.title.length} chars: "${page.title}"`)
    }

    if (!page.description) {
      add(page.url, 'description-missing', 'fail', 'no meta description')
    } else if (page.description.length < DESCRIPTION_RANGE[0] || page.description.length > DESCRIPTION_RANGE[1]) {
      add(page.url, 'description-length', 'warn', `${page.description.length} chars`)
    }

    if (page.h1Count !== 1) {
      add(page.url, 'h1-count', 'fail', `${page.h1Count} <h1> elements`)
    }

    if (page.jsonLdBlocks === 0) {
      add(page.url, 'jsonld-missing', 'fail', 'no application/ld+json block')
    }
    if (page.jsonLdInvalid > 0) {
      add(page.url, 'jsonld-invalid', 'fail', `${page.jsonLdInvalid} block(s) failed JSON.parse`)
    }

    if (!page.ogImage) {
      add(page.url, 'og-image-missing', 'warn', 'no og:image')
    }

    const isTreatiseChapter = /\/treatise\/[^/]+$/.test(new URL(page.finalUrl).pathname)
    const limit = isTreatiseChapter ? MAX_TREATISE_HTML_BYTES : MAX_HTML_BYTES
    if (page.bytes > limit) {
      add(page.url, 'html-size', 'fail', `${Math.round(page.bytes / 1024)} KB HTML (limit ${limit / 1024} KB)`)
    } else if (isTreatiseChapter && page.bytes > MAX_HTML_BYTES) {
      add(page.url, 'html-size', 'warn', `${Math.round(page.bytes / 1024)} KB HTML (long-form chapter; gzip transfer is roughly a fifth)`)
    } else if (page.bytes > MAX_HTML_BYTES * 0.8) {
      add(page.url, 'html-size', 'warn', `${Math.round(page.bytes / 1024)} KB HTML (approaching limit)`)
    }

    if (page.ttfbMs !== null && page.ttfbMs > 3000) {
      add(page.url, 'ttfb', 'warn', `${page.ttfbMs} ms to first byte`)
    }
  }
  return findings
}

async function ogImageFindings(crawl: CrawlOutput): Promise<Finding[]> {
  const images = new Map<string, string[]>()
  for (const page of crawl.pages) {
    if (!page.ogImage || page.status !== 200) continue
    const absolute = new URL(page.ogImage, page.finalUrl).toString()
    images.set(absolute, [...(images.get(absolute) ?? []), page.url])
  }
  const findings: Finding[] = []
  await mapLimit(Array.from(images.entries()), 4, async ([image, pages]) => {
    const response = await safeFetch(image, { method: 'GET', headers: { 'user-agent': GOOGLEBOT_UA } })
    const ok = Boolean(response && response.ok && (response.headers.get('content-type') || '').startsWith('image/'))
    if (!ok) {
      for (const url of pages) {
        findings.push({
          url,
          rule: 'og-image-broken',
          severity: 'fail',
          detail: `${image} -> ${response?.status ?? 'ERR'} ${response?.headers.get('content-type') ?? ''}`.trim()
        })
      }
    }
  })
  return findings
}

interface HostCheck {
  name: string
  ok: boolean
  detail: string
}

async function hostChecks(crawl: CrawlOutput): Promise<HostCheck[]> {
  const results: HostCheck[] = []

  results.push({
    name: 'robots.txt returns 200 and lists the sitemap',
    ok: crawl.robotsStatus === 200 && crawl.robotsHasSitemap,
    detail: `status ${crawl.robotsStatus}, sitemap line ${crawl.robotsHasSitemap ? 'present' : 'missing'}`
  })
  results.push({
    name: 'sitemap.xml returns 200 with URLs',
    ok: crawl.sitemapStatus === 200 && crawl.sitemapUrlCount > 0,
    detail: `status ${crawl.sitemapStatus}, ${crawl.sitemapUrlCount} URLs`
  })

  // Unknown URLs must be real 404s (Next 13.4 used to return 500 here).
  for (const probe of ['/articles/seo-monitor-missing-page', '/glossary/seo-monitor-missing-term', '/treatise/9999']) {
    const response = await safeFetch(`${SITE_URL}${probe}`, { redirect: 'manual', headers: { 'user-agent': GOOGLEBOT_UA } })
    results.push({
      name: `${probe} returns 404`,
      ok: response?.status === 404,
      detail: `status ${response?.status ?? 'ERR'}`
    })
  }

  // Legacy file-style article URLs redirect to the slug.
  {
    const response = await safeFetch(`${SITE_URL}/articles/Some_Legacy_Report.md`, {
      redirect: 'manual',
      headers: { 'user-agent': GOOGLEBOT_UA }
    })
    const location = response?.headers.get('location') ?? ''
    results.push({
      name: 'legacy .md article URL redirects 301 to slug',
      ok: response?.status === 301 && location.includes('/articles/some-legacy-report'),
      detail: `status ${response?.status ?? 'ERR'} location ${location || '-'}`
    })
  }

  // Only check the duplicate/legacy hosts when auditing production.
  if (SITE_HOST === PRODUCTION_HOST) {
    for (const host of ['bettermetrics.vercel.app', 'bettermetrics-2sbc.vercel.app']) {
      const response = await safeFetch(`https://${host}/theory`, { redirect: 'manual', headers: { 'user-agent': GOOGLEBOT_UA } })
      if (!response) {
        results.push({ name: `${host} resolves`, ok: true, detail: 'host not reachable (deleted or no DNS) - fine' })
        continue
      }
      const location = response.headers.get('location') ?? ''
      const xRobots = response.headers.get('x-robots-tag') ?? ''
      const redirected = response.status >= 300 && response.status < 400 && location.startsWith(SITE_URL)
      const noindexed = /noindex/i.test(xRobots)
      results.push({
        name: `${host} redirects to ${SITE_HOST} or is noindexed`,
        ok: redirected || noindexed,
        detail: `status ${response.status} location ${location || '-'} x-robots-tag ${xRobots || '-'}`
      })
    }
    for (const host of ['usebettermetrics.com', 'www.usebettermetrics.com']) {
      const response = await safeFetch(`https://${host}/`, { redirect: 'manual', headers: { 'user-agent': GOOGLEBOT_UA } }, 10_000)
      if (!response) {
        results.push({ name: `${host} legacy domain`, ok: true, detail: 'not reachable - no duplicate content served' })
        continue
      }
      const location = response.headers.get('location') ?? ''
      results.push({
        name: `${host} redirects to ${SITE_HOST}`,
        ok: response.status >= 300 && response.status < 400 && location.startsWith(SITE_URL),
        detail: `status ${response.status} location ${location || '-'}`
      })
    }
  }

  return results
}

function findingKey(finding: Finding) {
  return `${finding.url}::${finding.rule}`
}

async function main() {
  const crawl = readJson<CrawlOutput>(outPath('crawl.json'))
  if (!crawl) {
    console.error('seo-output/crawl.json not found. Run `npm run seo:crawl` first.')
    process.exit(1)
  }

  const findings = [...pageFindings(crawl), ...(await ogImageFindings(crawl))]
  const hosts = await hostChecks(crawl)

  for (const host of hosts.filter(h => !h.ok)) {
    findings.push({ url: SITE_URL, rule: `host:${host.name}`, severity: 'fail', detail: host.detail })
  }

  const previous = readJson<ChecksOutput>(prevPath('checks.json'))
  const previousKeys = new Set((previous?.findings ?? []).map(findingKey))
  const currentKeys = new Set(findings.map(findingKey))
  const regressions = previous ? findings.filter(f => !previousKeys.has(findingKey(f))) : []
  const resolved = previous ? previous.findings.filter(f => !currentKeys.has(findingKey(f))) : []

  const previousCrawl = readJson<CrawlOutput>(prevPath('crawl.json'))
  const previousUrls = new Set((previousCrawl?.pages ?? []).map(p => normaliseUrl(p.url)))
  const currentUrls = new Set(crawl.pages.map(p => normaliseUrl(p.url)))
  const missingPages = previousCrawl ? Array.from(previousUrls).filter(u => !currentUrls.has(u)) : []
  const newPages = previousCrawl ? Array.from(currentUrls).filter(u => !previousUrls.has(u)) : []

  const failingUrls = new Set(findings.filter(f => f.severity === 'fail').map(f => f.url))
  const hasFail = findings.some(f => f.severity === 'fail')
  const hasWarn = findings.some(f => f.severity === 'warn')

  const output: ChecksOutput = {
    site: SITE_URL,
    checkedAt: new Date().toISOString(),
    pageCount: crawl.pages.length,
    passCount: crawl.pages.filter(p => !failingUrls.has(p.url)).length,
    findings,
    regressions,
    resolved,
    missingPages,
    newPages,
    hostChecks: hosts,
    status: hasFail ? 'fail' : hasWarn ? 'warn' : 'ok'
  }
  writeJson('checks.json', output)

  const byRule = new Map<string, number>()
  for (const finding of findings) byRule.set(`${finding.severity} ${finding.rule}`, (byRule.get(`${finding.severity} ${finding.rule}`) ?? 0) + 1)

  console.log(`Checked ${output.pageCount} pages: ${output.passCount} pass, status ${output.status.toUpperCase()}`)
  for (const [rule, count] of Array.from(byRule.entries()).sort()) console.log(`  ${count.toString().padStart(4)}  ${rule}`)
  for (const host of hosts) console.log(`  ${host.ok ? 'ok  ' : 'FAIL'}  ${host.name} (${host.detail})`)
  if (previous) {
    console.log(`Regressions: ${regressions.length}, resolved: ${resolved.length}, missing pages: ${missingPages.length}, new pages: ${newPages.length}`)
  } else {
    console.log('No previous run to diff against.')
  }
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
