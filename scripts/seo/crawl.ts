/**
 * scripts/seo/crawl.ts
 *
 * Fetches /robots.txt and /sitemap.xml, then GETs every sitemap URL with a
 * Googlebot user agent. For each page it records the HTTP status, redirect
 * chain, time to first byte, HTML size and the on-page SEO facts that
 * checks.ts evaluates (title, description, canonical, robots, H1s, og:image,
 * JSON-LD validity).
 *
 * Usage:
 *   npm run seo:crawl                 # crawl SEO_SITE_URL / NEXT_PUBLIC_SITE_URL / aimtheory.org
 *   npm run seo:crawl -- --limit 20   # first N sitemap URLs only
 *   SEO_SITE_URL=http://localhost:3000 npm run seo:crawl
 *
 * Output: seo-output/crawl.json
 */
import {
  CrawlOutput,
  CrawlPage,
  GOOGLEBOT_UA,
  SITE_URL,
  argValue,
  decodeEntities,
  mapLimit,
  safeFetch,
  writeJson
} from './lib'

const CONCURRENCY = Number(process.env.SEO_CRAWL_CONCURRENCY || 6)

function attr(tag: string, name: string): string | null {
  const match = tag.match(new RegExp(`\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, 'i'))
  if (!match) return null
  return decodeEntities(match[2] ?? match[3] ?? '')
}

function findMeta(html: string, key: 'name' | 'property', value: string): string | null {
  const tags = html.match(/<meta\s[^>]*>/gi) || []
  for (const tag of tags) {
    const keyValue = attr(tag, key)
    if (keyValue && keyValue.toLowerCase() === value.toLowerCase()) {
      return attr(tag, 'content')
    }
  }
  return null
}

function findCanonical(html: string): string | null {
  const tags = html.match(/<link\s[^>]*>/gi) || []
  for (const tag of tags) {
    if ((attr(tag, 'rel') || '').toLowerCase() === 'canonical') return attr(tag, 'href')
  }
  return null
}

function stripTags(fragment: string) {
  return decodeEntities(fragment.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim()
}

export function extractFacts(html: string): Pick<
  CrawlPage,
  'title' | 'description' | 'canonical' | 'robotsMeta' | 'h1Count' | 'h1Text' | 'ogImage' | 'jsonLdBlocks' | 'jsonLdInvalid' | 'jsonLdTypes'
> {
  // Only inspect the document itself, not the RSC flight payload that Next
  // appends in <script> tags (it repeats the markup as JSON strings).
  const withoutScripts = html.replace(/<script\b(?![^>]*application\/ld\+json)[^>]*>[\s\S]*?<\/script>/gi, '')

  const titleMatch = withoutScripts.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
  const h1s = withoutScripts.match(/<h1\b[^>]*>[\s\S]*?<\/h1>/gi) || []

  const jsonLdTypes: string[] = []
  let jsonLdInvalid = 0
  const ldBlocks = html.match(/<script[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) || []
  for (const block of ldBlocks) {
    const body = block.replace(/^<script[^>]*>/i, '').replace(/<\/script>$/i, '')
    try {
      const parsed = JSON.parse(body)
      const nodes = Array.isArray(parsed) ? parsed : parsed['@graph'] ? parsed['@graph'] : [parsed]
      for (const node of nodes) {
        const type = node?.['@type']
        if (Array.isArray(type)) jsonLdTypes.push(...type)
        else if (typeof type === 'string') jsonLdTypes.push(type)
      }
    } catch {
      jsonLdInvalid++
    }
  }

  return {
    title: titleMatch ? stripTags(titleMatch[1]) : null,
    description: findMeta(withoutScripts, 'name', 'description'),
    canonical: findCanonical(withoutScripts),
    robotsMeta: findMeta(withoutScripts, 'name', 'robots'),
    h1Count: h1s.length,
    h1Text: h1s[0] ? stripTags(h1s[0]) : null,
    ogImage: findMeta(withoutScripts, 'property', 'og:image'),
    jsonLdBlocks: ldBlocks.length,
    jsonLdInvalid,
    jsonLdTypes: Array.from(new Set(jsonLdTypes))
  }
}

async function fetchPage(url: string): Promise<CrawlPage> {
  const base: CrawlPage = {
    url,
    status: null,
    finalUrl: url,
    redirects: [],
    ttfbMs: null,
    bytes: 0,
    title: null,
    description: null,
    canonical: null,
    robotsMeta: null,
    xRobotsTag: null,
    h1Count: 0,
    h1Text: null,
    ogImage: null,
    jsonLdBlocks: 0,
    jsonLdInvalid: 0,
    jsonLdTypes: [],
    contentType: null
  }

  // Follow redirects manually so the chain is recorded.
  let current = url
  for (let hop = 0; hop < 6; hop++) {
    const started = performance.now()
    const response = await safeFetch(current, {
      redirect: 'manual',
      headers: { 'user-agent': GOOGLEBOT_UA, accept: 'text/html,application/xhtml+xml' }
    })
    if (!response) {
      return { ...base, finalUrl: current, error: 'network error or timeout' }
    }
    const ttfb = Math.round(performance.now() - started)
    if (response.status >= 300 && response.status < 400 && response.headers.get('location')) {
      const next = new URL(response.headers.get('location') as string, current).toString()
      base.redirects.push(`${response.status} -> ${next}`)
      current = next
      continue
    }

    const contentType = response.headers.get('content-type')
    const html = contentType && contentType.includes('text/html') ? await response.text() : ''
    return {
      ...base,
      ...(html ? extractFacts(html) : {}),
      status: response.status,
      finalUrl: current,
      ttfbMs: ttfb,
      bytes: Buffer.byteLength(html, 'utf8'),
      xRobotsTag: response.headers.get('x-robots-tag'),
      contentType
    }
  }
  return { ...base, finalUrl: current, error: 'too many redirects' }
}

export function parseSitemapUrls(xml: string): string[] {
  return Array.from(xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)).map(match => decodeEntities(match[1]))
}

async function main() {
  const startedAt = new Date().toISOString()
  console.log(`Crawling ${SITE_URL} as Googlebot (concurrency ${CONCURRENCY})`)

  const robotsResponse = await safeFetch(`${SITE_URL}/robots.txt`, { headers: { 'user-agent': GOOGLEBOT_UA } })
  const robotsText = robotsResponse?.ok ? await robotsResponse.text() : ''
  const robotsHasSitemap = /^sitemap:\s*\S+/im.test(robotsText)

  const sitemapResponse = await safeFetch(`${SITE_URL}/sitemap.xml`, { headers: { 'user-agent': GOOGLEBOT_UA } })
  const sitemapXml = sitemapResponse?.ok ? await sitemapResponse.text() : ''
  let urls = parseSitemapUrls(sitemapXml)

  const limit = Number(argValue('--limit') || 0)
  if (limit > 0) urls = urls.slice(0, limit)

  // When crawling a non-production host (local build, preview), the sitemap
  // still lists canonical production URLs; rewrite them to the host under test.
  const sitemapOrigin = urls[0] ? new URL(urls[0]).origin : SITE_URL
  if (sitemapOrigin !== SITE_URL) {
    urls = urls.map(u => u.replace(sitemapOrigin, SITE_URL))
  }

  console.log(`robots.txt ${robotsResponse?.status ?? 'unreachable'}, sitemap.xml ${sitemapResponse?.status ?? 'unreachable'} with ${urls.length} URLs`)

  let done = 0
  const pages = await mapLimit(urls, CONCURRENCY, async url => {
    const page = await fetchPage(url)
    done++
    if (done % 50 === 0 || done === urls.length) console.log(`  ${done}/${urls.length}`)
    return page
  })

  const output: CrawlOutput = {
    site: SITE_URL,
    startedAt,
    finishedAt: new Date().toISOString(),
    sitemapStatus: sitemapResponse?.status ?? null,
    sitemapUrlCount: urls.length,
    robotsStatus: robotsResponse?.status ?? null,
    robotsHasSitemap,
    pages
  }
  writeJson('crawl.json', output)

  const non200 = pages.filter(p => p.status !== 200)
  console.log(`Done. ${pages.length} pages, ${non200.length} non-200. Written to seo-output/crawl.json`)
  for (const page of non200.slice(0, 20)) {
    console.log(`  ${page.status ?? 'ERR'} ${page.url} ${page.error ?? ''}`)
  }
}

if (process.argv[1] && /crawl\.ts$/.test(process.argv[1])) {
  main().catch(error => {
    console.error(error)
    process.exit(1)
  })
}
