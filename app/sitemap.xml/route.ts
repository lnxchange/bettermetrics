import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/lib/db_types'
import { PublicArticles } from '@/lib/publishing/public'
import { PublishingSettings } from '@/lib/publishing/settings'
import { SITE_URL } from '@/lib/site'
import { TreatiseAddress } from '@/lib/treatise-address'
import { TreatisePlacement } from '@/lib/treatise-placement'

/**
 * Sitemap as an explicit route handler rather than `app/sitemap.ts`.
 * Next 13.4's metadata-route wrapper ignores `revalidate` and freezes the file
 * at build time, which would hide articles published and treatise chapters
 * synced between deploys. This handler is dynamic and sets its own CDN cache.
 */
export const dynamic = 'force-dynamic'

const CACHE_SECONDS = 3600

const STATIC_ROUTES: { path: string; changefreq?: 'weekly' }[] = [
  { path: '/' },
  { path: '/theory' },
  { path: '/architecture' },
  { path: '/glossary' },
  { path: '/treatise' },
  { path: '/testing', changefreq: 'weekly' },
  { path: '/articles' },
  { path: '/articles/feed.xml' },
  { path: '/articles/atom.xml' },
  { path: '/about' },
  { path: '/diagnostic' },
  { path: '/contact' },
  { path: '/terms' }
]

interface Entry {
  url: string
  lastModified?: string | Date
  changefreq?: 'weekly'
}

function anonClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false }
  })
}

function sourceDateToIso(yymmdd: string | null): string | undefined {
  if (!yymmdd || !/^\d{6}$/.test(yymmdd)) return undefined
  const year = 2000 + Number(yymmdd.slice(0, 2))
  return new Date(
    Date.UTC(year, Number(yymmdd.slice(2, 4)) - 1, Number(yymmdd.slice(4, 6)))
  ).toISOString()
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function toIso(value: string | Date | undefined): string | undefined {
  if (!value) return undefined
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString()
}

async function collectSitemapEntries(): Promise<Entry[]> {
  const now = new Date()
  const entries: Entry[] = STATIC_ROUTES.map(route => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: now,
    changefreq: route.changefreq
  }))

  const supabase = anonClient()
  if (!supabase) return entries

  const [articles, chapters, terms] = await Promise.all([
    PublicArticles.list(await PublishingSettings.gate()).catch(() => []),
    supabase
      .from('treatise_chapters')
      .select('slug, title, updated_at, source_date')
      .order('position', { ascending: true }),
    supabase
      .from('glossary_entries')
      .select('slug, updated_at')
      .order('position', { ascending: true })
      .limit(1000)
  ])

  for (const article of articles) {
    // Redirected to /glossary in next.config.js.
    if (article.slug === '260106-chapter-2') continue
    entries.push({
      url: `${SITE_URL}/articles/${article.slug}`,
      lastModified: article.updated_at || article.published_at || now
    })
  }

  const seen = new Set<string>()
  for (const chapter of chapters.data ?? []) {
    // Chapter 2 is served at /glossary (already listed above).
    if (chapter.slug === '2') continue
    const placed = TreatisePlacement.present({
      slug: chapter.slug,
      title: chapter.title,
      label: chapter.slug,
      part: 'I',
      position: 0,
      href: TreatiseAddress.publicPath(chapter.slug)
    })
    const url = `${SITE_URL}${placed.href}`
    if (seen.has(url)) continue
    seen.add(url)
    entries.push({
      url,
      lastModified:
        chapter.updated_at || sourceDateToIso(chapter.source_date) || now
    })
  }

  for (const term of terms.data ?? []) {
    entries.push({
      url: `${SITE_URL}/glossary/${term.slug}`,
      lastModified: term.updated_at || now
    })
  }

  return entries
}

export async function GET() {
  const entries = await collectSitemapEntries()
  const body =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    entries
      .map(entry => {
        const lastmod = toIso(entry.lastModified)
        const changefreq = entry.changefreq
          ? `\n    <changefreq>${entry.changefreq}</changefreq>`
          : ''
        return `  <url>\n    <loc>${escapeXml(entry.url)}</loc>${
          lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''
        }${changefreq}\n  </url>`
      })
      .join('\n') +
    '\n</urlset>\n'

  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': `public, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=${CACHE_SECONDS}`
    }
  })
}
