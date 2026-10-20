import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/lib/db_types'
import { SITE_URL } from '@/lib/site'

/**
 * Sitemap as an explicit route handler rather than `app/sitemap.ts`.
 * Next 13.4's metadata-route wrapper ignores `revalidate` and freezes the file
 * at build time, which would hide articles published and treatise chapters
 * synced between deploys. This handler is dynamic and sets its own CDN cache.
 */
export const dynamic = 'force-dynamic'

const CACHE_SECONDS = 3600

const STATIC_ROUTES = [
  '/',
  '/theory',
  '/axioms',
  '/glossary',
  '/treatise',
  '/articles',
  '/about',
  '/diagnostic',
  '/contact'
]

interface Entry {
  url: string
  lastModified?: string | Date
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
  return new Date(Date.UTC(year, Number(yymmdd.slice(2, 4)) - 1, Number(yymmdd.slice(4, 6)))).toISOString()
}

function escapeXml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
}

function toIso(value: string | Date | undefined): string | undefined {
  if (!value) return undefined
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString()
}

async function collectSitemapEntries(): Promise<Entry[]> {
  const now = new Date()
  const entries: Entry[] = STATIC_ROUTES.map(path => ({
    url: `${SITE_URL}${path}`,
    lastModified: now
  }))

  const supabase = anonClient()
  if (!supabase) return entries

  const [articles, chapters, terms] = await Promise.all([
    supabase
      .from('articles')
      .select('slug, updated_at, published_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false }),
    supabase
      .from('treatise_chapters')
      .select('slug, updated_at, source_date')
      .order('position', { ascending: true }),
    supabase
      .from('glossary_entries')
      .select('slug, updated_at')
      .order('position', { ascending: true })
      .limit(1000)
  ])

  for (const article of articles.data ?? []) {
    // Redirected to /glossary in next.config.js.
    if (article.slug === '260106-chapter-2') continue
    entries.push({
      url: `${SITE_URL}/articles/${article.slug}`,
      lastModified: article.updated_at || article.published_at || now
    })
  }

  for (const chapter of chapters.data ?? []) {
    // Chapter 2 is served at /glossary (already listed above).
    if (chapter.slug === '2') continue
    entries.push({
      url: `${SITE_URL}/treatise/${chapter.slug}`,
      lastModified: chapter.updated_at || sourceDateToIso(chapter.source_date) || now
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
        return `  <url>\n    <loc>${escapeXml(entry.url)}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}\n  </url>`
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
