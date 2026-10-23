/**
 * Check that section and chapter citations in the treatise resolve to a heading.
 * Citation links are applied when a chapter is shown, from the synced text,
 * so this report is the check that runs with every treatise deploy.
 *
 *   npm run audit-treatise-citations
 *   TREATISE_DIR="/path/to/CORPUS/TREATISE" npm run audit-treatise-citations
 *
 * The default directory is the local git clone. The publish Action passes
 * TREATISE_DIR for its own checkout.
 */
import { readdir, readFile } from 'fs/promises'
import path from 'path'
import { prepareTreatiseMarkdown } from '../lib/treatise-render'
import { unresolvedCitations } from '../lib/treatise-citations'

const DEFAULT_DIR =
  '/Users/yuleguttenbeil/Documents/Cursor/aim-treatise/aim-treatise/CORPUS/TREATISE'

const FILE_NAME = /^(\d{6}) - (Chapter|Appendix) ([0-9]+[A-Z]?|[A-Z]) - .+\.md$/

interface SourceFile {
  date: string
  kind: 'Chapter' | 'Appendix'
  code: string
  fullPath: string
}

function describe(file: SourceFile) {
  if (file.kind === 'Chapter') {
    const number = Number(file.code)
    if (number === 2) return null
    return { slug: String(number), label: `Chapter ${number}` }
  }
  const code = file.code.toUpperCase()
  return { slug: `appendix-${code.toLowerCase()}`, label: `Appendix ${code}` }
}

async function latestFiles(directory: string) {
  const names = await readdir(directory)
  const chosen = new Map<string, SourceFile & { slug: string; label: string }>()
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
    if (!current || file.date > current.date) {
      chosen.set(described.slug, { ...file, ...described })
    }
  }
  return chosen
}

export async function auditTreatiseDirectory(directory: string) {
  const files = await latestFiles(directory)
  const chapters: { label: string; slug: string; markdown: string; headings: Set<string> }[] = []
  for (const file of Array.from(files.values())) {
    const markdown = await readFile(file.fullPath, 'utf8')
    const prepared = prepareTreatiseMarkdown(markdown)
    chapters.push({
      label: file.label,
      slug: file.slug,
      markdown,
      headings: new Set(prepared.headings.map(heading => heading.id))
    })
  }

  const headingsBySlug = new Map(chapters.map(chapter => [chapter.slug, chapter.headings]))
  let unresolved = 0
  for (const chapter of chapters) {
    const misses = unresolvedCitations(chapter.markdown, headingsBySlug)
    const seen = new Set<string>()
    const list = misses.filter(miss => {
      if (seen.has(miss.href)) return false
      seen.add(miss.href)
      return true
    })
    unresolved += list.length
    if (list.length === 0) continue
    console.log(
      `${chapter.label}  ${list.length} citation${list.length === 1 ? '' : 's'} ${list.length === 1 ? 'does' : 'do'} not match a heading`
    )
    for (const miss of list.slice(0, 8)) {
      console.log(`  ${miss.text}  ${miss.href}`)
    }
    if (list.length > 8) console.log(`  … ${list.length - 8} more`)
  }
  console.log(
    unresolved === 0
      ? `citations  ${chapters.length} chapters, every recognised citation matches a heading`
      : `citations  ${unresolved} unresolved across ${chapters.length} chapters`
  )
  return unresolved
}

const entry = process.argv[1] || ''
if (entry.includes('audit-treatise-citations')) {
  const directory = process.env.TREATISE_DIR || DEFAULT_DIR
  auditTreatiseDirectory(directory).catch(error => {
    console.error(error instanceof Error ? error.message : error)
    process.exit(1)
  })
}
