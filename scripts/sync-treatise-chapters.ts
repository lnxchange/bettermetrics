/**
 * Upsert the current treatise chapters into treatise_chapters.
 * Chapter 2 is the glossary and is not stored.
 * Then embed the chapters and glossary for chat retrieval (needs OPENAI_API_KEY).
 *
 *   TREATISE_DIR="/path/to/CORPUS/TREATISE" npx tsx scripts/sync-treatise-chapters.ts
 *
 * The scheduled run is the GitHub Action in the aim-treatise repo
 * (.github/workflows/publish-to-website.yml): weekly, or when Run workflow
 * is pressed. It sets TREATISE_DIR to its checkout. Locally the default is
 * the git clone.
 */
import { createHash } from 'crypto'
import { config } from 'dotenv'
import { readdir, readFile } from 'fs/promises'
import path from 'path'
import { createClient } from '@supabase/supabase-js'
import { prepareTreatiseMarkdown } from '../lib/treatise-render'
import { indexTreatise } from '../lib/rag/treatise-index'
import { auditTreatiseDirectory } from './audit-treatise-citations'
import { Database, Json } from '../lib/db_types'

config({ path: path.join(process.cwd(), '.env.local') })

const DEFAULT_DIR =
  '/Users/yuleguttenbeil/Documents/Cursor/aim-treatise/aim-treatise/CORPUS/TREATISE'

const FILE_NAME = /^(\d{6}) - (Chapter|Appendix) ([0-9]+[A-Z]?|[A-Z]) - .+\.md$/

const APPENDIX_POSITION: Record<string, number> = {
  A: 101,
  B: 102,
  C: 103,
  '12A': 104,
  '18A': 105,
  '18B': 106
}

interface SourceFile {
  date: string
  kind: 'Chapter' | 'Appendix'
  code: string
  fullPath: string
}

function titleFromMarkdown(markdown: string, fallback: string) {
  const line = markdown.split('\n').find(entry => entry.startsWith('# '))
  if (!line) return fallback
  const text = line.replace(/^#\s+/, '').replace(/\*\*/g, '').trim()
  const stripped = text.replace(/^(?:chapter|appendix)\s+[0-9A-Za-z]+\s*[:—–-]\s*/i, '')
  return stripped.trim() || fallback
}

function describe(file: SourceFile) {
  if (file.kind === 'Chapter') {
    const number = Number(file.code)
    if (number === 2) return null
    return {
      slug: String(number),
      label: `Chapter ${number}`,
      part: number <= 14 ? 'I' : 'II',
      position: number
    }
  }
  const code = file.code.toUpperCase()
  return {
    slug: `appendix-${code.toLowerCase()}`,
    label: `Appendix ${code}`,
    part: 'appendix',
    position: APPENDIX_POSITION[code] ?? 180
  }
}

async function latestFiles(directory: string) {
  const names = await readdir(directory)
  const chosen = new Map<string, SourceFile>()
  for (const name of names) {
    const match = name.match(FILE_NAME)
    if (!match) continue
    const file: SourceFile = {
      date: match[1],
      kind: match[2] as 'Chapter' | 'Appendix',
      code: match[3],
      fullPath: path.join(directory, name)
    }
    const described = describe(file)
    if (!described) continue
    const current = chosen.get(described.slug)
    if (!current || file.date > current.date) chosen.set(described.slug, file)
  }
  return chosen
}

const LETTER_HEADING = /^[—–-]\s*.\s*[—–-]$/
const EXEMPT_HEADING =
  /^(Nomenclature|Reading Paths|How to Use|Common Confusions|Disaggregation Conventions|Epistemic Status Guide|USER GUIDE)\b/i

function collapse(value: string) {
  return value.replace(/\s+/g, ' ').trim()
}

function glossarySlug(term: string) {
  return term
    .toLowerCase()
    .replace(/[()]/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

interface GlossaryDraft {
  term: string
  definition: string
  explanation: string
  derivation: string
  epistemic_status: string | null
  cross_references: string[]
}

function parseGlossaryEntries(markdown: string): GlossaryDraft[] {
  const entries: GlossaryDraft[] = []
  const parts = markdown.split(/^### /m).slice(1)
  for (const part of parts) {
    const newline = part.indexOf('\n')
    const heading = (newline === -1 ? part : part.slice(0, newline)).trim()
    if (!heading || LETTER_HEADING.test(heading) || EXEMPT_HEADING.test(heading)) continue
    const body = newline === -1 ? '' : part.slice(newline + 1)
    const stop = body.search(
      /^\*\*Explanation\.?\*\*|^\*Derivation:|^\*Epistemic Status:|^\*Cross-references:|^\*\*\*\s*$/m
    )
    const definition = collapse(stop === -1 ? body : body.slice(0, stop)).replace(/^\*\*[^*]+\*\*\s*/, '')
    const explanationMatch = body.match(
      /^\*\*Explanation\.?\*\*\s*([\s\S]*?)(?=^\*Derivation:|^\*Epistemic Status:|^\*Cross-references:|^\*\*\*\s*$)/m
    )
    const derivation = body.match(/^\*Derivation:\*\s*(.+)$/m)
    const status = body.match(/^\*Epistemic Status:\*\s*(.+)$/m)
    const refs = body.match(/^\*Cross-references:\*\s*(.+)$/m)
    entries.push({
      term: heading,
      definition,
      explanation: explanationMatch ? collapse(explanationMatch[1]) : '',
      derivation: derivation ? derivation[1].trim() : '',
      epistemic_status: status ? status[1].trim() : null,
      cross_references: refs
        ? refs[1]
            .replace(/\.$/, '')
            .split(',')
            .map(item => item.trim())
            .filter(Boolean)
        : []
    })
  }
  return entries
}

async function latestChapterTwo(directory: string) {
  const names = await readdir(directory)
  let chosen: SourceFile | null = null
  for (const name of names) {
    const match = name.match(FILE_NAME)
    if (!match || match[2] !== 'Chapter' || Number(match[3]) !== 2) continue
    const file: SourceFile = {
      date: match[1],
      kind: 'Chapter',
      code: match[3],
      fullPath: path.join(directory, name)
    }
    if (!chosen || file.date > chosen.date) chosen = file
  }
  return chosen
}

async function syncGlossaryDerivations(
  supabase: ReturnType<typeof createClient<Database>>,
  directory: string
) {
  const file = await latestChapterTwo(directory)
  if (!file) {
    console.log('glossary: no Chapter 2 file')
    return
  }
  const markdown = await readFile(file.fullPath, 'utf8')
  const source_sha = createHash('sha256').update(markdown).digest('hex')
  const parsed = parseGlossaryEntries(markdown)
  const { data, error } = await supabase
    .from('glossary_entries')
    .select('slug, term, derivation, position')
  if (error) throw new Error(`glossary: ${error.message}`)

  const byTerm = new Map<string, { slug: string; derivation: string | null; position: number }>()
  const bySlug = new Map<string, { slug: string; derivation: string | null; position: number }>()
  const occupied: { slug: string; term: string; position: number }[] = []
  for (const row of data ?? []) {
    const stored = { slug: row.slug, derivation: row.derivation, position: row.position }
    byTerm.set(row.term.trim().toLowerCase(), stored)
    bySlug.set(row.slug, stored)
    occupied.push({ slug: row.slug, term: row.term, position: row.position })
  }

  let updated = 0
  let inserted = 0
  const now = new Date().toISOString()
  for (const entry of parsed) {
    if (!entry.derivation) continue
    const stripped = entry.term.replace(/\s*\([^)]*\)\s*$/, '').trim().toLowerCase()
    const row = byTerm.get(entry.term.toLowerCase()) ?? byTerm.get(stripped)
    if (!row) continue
    if ((row.derivation ?? '').trim() === entry.derivation) continue
    const { error: updateError } = await supabase
      .from('glossary_entries')
      .update({ derivation: entry.derivation, updated_at: now })
      .eq('slug', row.slug)
    if (updateError) throw new Error(`glossary ${row.slug}: ${updateError.message}`)
    updated += 1
  }

  const missing = parsed.filter(entry => {
    const stripped = entry.term.replace(/\s*\([^)]*\)\s*$/, '').trim().toLowerCase()
    return !byTerm.has(entry.term.toLowerCase()) && !byTerm.has(stripped) && entry.definition
  })
  for (const entry of missing) {
    const letter = (entry.term.match(/[A-Za-z]/)?.[0] ?? '#').toUpperCase()
    const slug = glossarySlug(entry.term)
    occupied.sort((a, b) => a.position - b.position)
    const index = parsed.findIndex(item => item.term === entry.term)
    const later = parsed.slice(index + 1).find(item => {
      const stripped = item.term.replace(/\s*\([^)]*\)\s*$/, '').trim().toLowerCase()
      return byTerm.has(item.term.toLowerCase()) || byTerm.has(stripped)
    })
    const laterRow = later
      ? byTerm.get(later.term.toLowerCase()) ??
        byTerm.get(later.term.replace(/\s*\([^)]*\)\s*$/, '').trim().toLowerCase())
      : undefined
    const position = laterRow ? laterRow.position : (occupied[occupied.length - 1]?.position ?? 0) + 1
    if (laterRow) {
      const shifting = occupied
        .filter(row => row.position >= position)
        .sort((a, b) => b.position - a.position)
      for (let index = 0; index < shifting.length; index += 25) {
        const batch = shifting.slice(index, index + 25)
        await Promise.all(
          batch.map(async row => {
            row.position += 1
            const stored = bySlug.get(row.slug)
            if (stored) stored.position = row.position
            const { error: shiftError } = await supabase
              .from('glossary_entries')
              .update({ position: row.position })
              .eq('slug', row.slug)
            if (shiftError) throw new Error(`glossary position ${row.slug}: ${shiftError.message}`)
          })
        )
      }
    }
    const { error: insertError } = await supabase.from('glossary_entries').insert({
      slug,
      term: entry.term,
      letter,
      definition: entry.definition,
      explanation: entry.explanation,
      derivation: entry.derivation || null,
      epistemic_status: entry.epistemic_status,
      cross_references: entry.cross_references,
      notes: null,
      source_sha,
      position
    })
    if (insertError) throw new Error(`glossary insert ${entry.term}: ${insertError.message}`)
    const stored = { slug, derivation: entry.derivation, position }
    occupied.push({ slug, term: entry.term, position })
    byTerm.set(entry.term.toLowerCase(), stored)
    bySlug.set(slug, stored)
    inserted += 1
    console.log(`glossary added: ${entry.term}`)
  }

  console.log(
    `glossary  ${file.date}  ${updated} derivations updated, ${inserted} entries added, ${parsed.length} in Chapter 2`
  )
}

async function main() {
  const directory = process.env.TREATISE_DIR || DEFAULT_DIR
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase URL and service role key are required')

  const files = await latestFiles(directory)
  if (files.size === 0) throw new Error(`No treatise chapters in ${directory}`)

  const supabase = createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false }
  })

  const { data: stored, error: storedError } = await supabase
    .from('treatise_chapters')
    .select('slug, source_sha, source_date')
  if (storedError) throw new Error(storedError.message)
  const current = new Map(
    (stored ?? []).map(row => [row.slug, { sha: row.source_sha, date: row.source_date }])
  )

  const slugs: string[] = []
  for (const [slug, file] of Array.from(files.entries())) {
    const described = describe(file)
    if (!described) continue
    const markdown = await readFile(file.fullPath, 'utf8')
    const source_sha = createHash('sha256').update(markdown).digest('hex')
    const existing = current.get(slug)
    slugs.push(slug)
    if (existing && existing.sha === source_sha && existing.date === file.date) {
      console.log(`${described.label}  ${file.date}  unchanged`)
      continue
    }
    const prepared = prepareTreatiseMarkdown(markdown)
    const row = {
      slug,
      title: titleFromMarkdown(markdown, described.label),
      label: described.label,
      part: described.part,
      markdown,
      headings: prepared.headings as unknown as Json,
      source_sha,
      source_date: file.date,
      position: described.position,
      updated_at: new Date().toISOString()
    }
    const { error } = await supabase.from('treatise_chapters').upsert(row, { onConflict: 'slug' })
    if (error) throw new Error(`${slug}: ${error.message}`)
    console.log(`${described.label}  ${file.date}  ${prepared.headings.length} headings`)
  }

  await syncGlossaryDerivations(supabase, directory)

  const { data: existing, error: listError } = await supabase.from('treatise_chapters').select('slug')
  if (listError) throw new Error(listError.message)
  const stale = (existing ?? []).map(row => row.slug).filter(slug => !slugs.includes(slug))
  if (stale.length > 0) {
    const { error } = await supabase.from('treatise_chapters').delete().in('slug', stale)
    if (error) throw new Error(error.message)
    console.log('removed', stale.join(', '))
  }
  console.log(`synced ${slugs.length} chapters`)
  await auditTreatiseDirectory(directory)

  if (!process.env.OPENAI_API_KEY) {
    console.log('chat index: OPENAI_API_KEY not set, skipped')
    return
  }
  const index = await indexTreatise(supabase)
  console.log(
    `chat index  ${index.indexed.length} embedded, ${index.unchanged.length} unchanged, ${index.removed.length} removed`
  )
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
