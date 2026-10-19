import { createClient } from '@supabase/supabase-js'
import { Database } from '@/lib/db_types'
import { prepareTreatiseMarkdown } from '@/lib/treatise-render'
import { TreatiseHeading } from '@/lib/treatise-citations'

export type TreatisePart = 'I' | 'II' | 'appendix'

export interface TreatiseChapterSummary {
  slug: string
  title: string
  label: string
  part: TreatisePart
  source_date: string | null
  position: number
  href: string
}

export interface TreatiseChapter extends TreatiseChapterSummary {
  markdown: string
  headings: TreatiseHeading[]
  html: string
  source_sha: string
  updated_at: string
}

export const CHAPTER_TWO: TreatiseChapterSummary = {
  slug: '2',
  title: 'Definitions and Glossary',
  label: 'Chapter 2',
  part: 'I',
  source_date: null,
  position: 2,
  href: '/glossary'
}

export const TREATISE_PARTS: { id: TreatisePart; title: string }[] = [
  { id: 'I', title: 'Part I — Diagnosis' },
  { id: 'II', title: 'Part II — Response' },
  { id: 'appendix', title: 'Appendices' }
]

export interface TreatiseDraft {
  sourceDate: string
  filename: string
  url: string
}

export async function loadTreatiseDraft(): Promise<TreatiseDraft | null> {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!base) return null
  try {
    const response = await fetch(`${base}/storage/v1/object/public/treatise-ebooks/current.json`, {
      cache: 'no-store'
    })
    if (!response.ok) return null
    const data = await response.json()
    if (
      typeof data?.sourceDate !== 'string' ||
      typeof data?.filename !== 'string' ||
      typeof data?.url !== 'string'
    ) {
      return null
    }
    return { sourceDate: data.sourceDate, filename: data.filename, url: data.url }
  } catch {
    return null
  }
}

export function formatSourceDate(yymmdd: string) {
  if (!/^\d{6}$/.test(yymmdd)) return yymmdd
  const year = 2000 + Number(yymmdd.slice(0, 2))
  const month = Number(yymmdd.slice(2, 4))
  const day = Number(yymmdd.slice(4, 6))
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC'
  })
}

function anonClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false }
  })
}

function asPart(value: string): TreatisePart {
  if (value === 'I' || value === 'II' || value === 'appendix') return value
  return 'I'
}

function summaryFromRow(row: {
  slug: string
  title: string
  label: string
  part: string
  source_date: string | null
  position: number
}): TreatiseChapterSummary {
  return {
    slug: row.slug,
    title: row.title,
    label: row.label,
    part: asPart(row.part),
    source_date: row.source_date,
    position: row.position,
    href: `/treatise/${row.slug}`
  }
}

export function withChapterTwo(chapters: TreatiseChapterSummary[]) {
  if (chapters.some(chapter => chapter.slug === '2')) return chapters
  return [...chapters, CHAPTER_TWO].sort((a, b) => a.position - b.position || a.label.localeCompare(b.label))
}

export async function loadTreatiseChapters(): Promise<TreatiseChapterSummary[]> {
  const supabase = anonClient()
  if (!supabase) return withChapterTwo([])
  const { data, error } = await supabase
    .from('treatise_chapters')
    .select('slug, title, label, part, source_date, position')
    .order('position', { ascending: true })
  if (error) throw new Error(`Treatise query failed: ${error.message}`)
  return withChapterTwo((data ?? []).map(summaryFromRow))
}

export async function loadTreatiseChapter(slug: string): Promise<TreatiseChapter | null> {
  const supabase = anonClient()
  if (!supabase) return null
  const { data, error } = await supabase
    .from('treatise_chapters')
    .select('slug, title, label, part, markdown, headings, source_sha, source_date, position, updated_at')
    .eq('slug', slug)
    .maybeSingle()
  if (error) throw new Error(`Treatise query failed: ${error.message}`)
  if (!data) return null
  const prepared = prepareTreatiseMarkdown(data.markdown)
  return {
    ...summaryFromRow(data),
    markdown: data.markdown,
    headings: prepared.headings,
    html: prepared.html,
    source_sha: data.source_sha,
    updated_at: data.updated_at
  }
}
