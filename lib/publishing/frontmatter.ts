import { createHash } from 'crypto'
import { MelbourneTime } from '@/lib/publishing/melbourne-time'
import { EditorialStatus } from '@/lib/publishing/types'

export interface ParsedArticle {
  title: string
  slug: string
  summary: string
  status: EditorialStatus
  publishAt: Date | null
  sourcePapers: string[]
  treatiseRefs: string[]
  tags: string[]
  featureImage: string | null
  imageAlt: string | null
  replaces: string[]
  body: string
}

export type ParseResult = { ok: true; article: ParsedArticle } | { ok: false; error: string }

/**
 * The aim-treatise article file. Markdown with YAML frontmatter.
 *
 * Required: title, slug, summary (160 characters or fewer), status
 * (draft, approved or retired).
 * Optional: publish_at, source_papers, treatise_refs, tags, feature_image,
 * image_alt.
 * Optional extension, ignored by writers who do not need it: replaces, a list
 * of legacy slugs this article supersedes. Unknown keys are ignored.
 */
export class ArticleFrontmatter {
  static readonly summaryLimit = 160

  static hash(raw: string) {
    return createHash('sha256').update(raw.replace(/\r\n/g, '\n')).digest('hex')
  }

  static parse(raw: string, filename?: string): ParseResult {
    try {
      const text = raw.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n')
      if (!text.startsWith('---\n')) return { ok: false, error: 'The file needs YAML frontmatter' }
      const end = text.indexOf('\n---\n', 4)
      if (end < 0) return { ok: false, error: 'The frontmatter is not closed' }
      const fields = ArticleFrontmatter.fields(text.slice(4, end))
      const body = text.slice(end + 5).replace(/^\n/, '')
      return { ok: true, article: ArticleFrontmatter.article(fields, body, filename) }
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : 'Could not read the file' }
    }
  }

  static publicImage(value: string | null) {
    if (!value) return null
    const trimmed = value.trim()
    if (/^https?:\/\//i.test(trimmed)) return trimmed
    if (trimmed.startsWith('/') && !trimmed.startsWith('//')) return trimmed
    return null
  }

  private static article(
    fields: Record<string, string | string[]>,
    body: string,
    filename?: string
  ): ParsedArticle {
    const title = ArticleFrontmatter.text(fields, 'title')
    const slug = ArticleFrontmatter.text(fields, 'slug')
    const summary = ArticleFrontmatter.text(fields, 'summary').replace(/\s+/g, ' ').trim()
    const status = ArticleFrontmatter.text(fields, 'status')
    if (!title) throw new Error('title is required')
    if (!slug) throw new Error('slug is required')
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error('slug must be lowercase words separated by hyphens')
    if (filename && filename !== `${slug}.md`) throw new Error(`filename must be ${slug}.md`)
    if (!summary) throw new Error('summary is required')
    if (summary.length > ArticleFrontmatter.summaryLimit) {
      throw new Error(`summary is ${summary.length} characters and the limit is ${ArticleFrontmatter.summaryLimit}`)
    }
    if (status !== 'draft' && status !== 'approved' && status !== 'retired') {
      throw new Error('status must be draft, approved or retired')
    }
    const publishRaw = ArticleFrontmatter.optional(fields, 'publish_at')
    let publishAt: Date | null = null
    if (publishRaw) {
      publishAt = ArticleFrontmatter.instant(publishRaw)
      if (!publishAt) throw new Error('publish_at is not a date')
    }
    return {
      title,
      slug,
      summary,
      status,
      publishAt,
      sourcePapers: ArticleFrontmatter.list(fields, 'source_papers'),
      treatiseRefs: ArticleFrontmatter.list(fields, 'treatise_refs'),
      tags: ArticleFrontmatter.list(fields, 'tags'),
      featureImage: ArticleFrontmatter.optional(fields, 'feature_image'),
      imageAlt: ArticleFrontmatter.optional(fields, 'image_alt'),
      replaces: ArticleFrontmatter.list(fields, 'replaces'),
      body: body.trim()
    }
  }

  private static instant(value: string) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [year, month, day] = value.split('-').map(Number)
      return MelbourneTime.fromLocal(year, month, day, 0, 0)
    }
    const parsed = new Date(value)
    return Number.isNaN(parsed.getTime()) ? null : parsed
  }

  private static text(fields: Record<string, string | string[]>, key: string) {
    const value = fields[key]
    return typeof value === 'string' ? value.trim() : ''
  }

  private static optional(fields: Record<string, string | string[]>, key: string) {
    const value = ArticleFrontmatter.text(fields, key)
    return value || null
  }

  private static list(fields: Record<string, string | string[]>, key: string) {
    const value = fields[key]
    if (Array.isArray(value)) return value.map(item => item.trim()).filter(Boolean)
    if (typeof value === 'string' && value.trim()) return [value.trim()]
    return []
  }

  private static fields(yaml: string) {
    const result: Record<string, string | string[]> = {}
    const lines = yaml.split('\n')
    let index = 0
    while (index < lines.length) {
      const line = lines[index]
      if (!line.trim() || line.trim().startsWith('#')) {
        index += 1
        continue
      }
      const match = line.match(/^([A-Za-z][A-Za-z0-9_]*):\s*(.*)$/)
      if (!match) throw new Error(`Cannot read "${line.trim()}"`)
      const key = match[1]
      const rest = match[2].trim()
      if (rest === '>' || rest === '|') {
        const block: string[] = []
        index += 1
        while (index < lines.length && (lines[index].startsWith('  ') || !lines[index].trim())) {
          if (lines[index].trim()) block.push(lines[index].trim())
          index += 1
        }
        result[key] = rest === '>' ? block.join(' ') : block.join('\n')
        continue
      }
      if (rest.startsWith('[')) {
        result[key] = ArticleFrontmatter.inlineList(rest)
        index += 1
        continue
      }
      if (rest === '') {
        const items: string[] = []
        let look = index + 1
        while (look < lines.length && (!lines[look].trim() || lines[look].trim().startsWith('#'))) look += 1
        if (look < lines.length && /^\s*-\s+/.test(lines[look])) {
          index = look
          while (index < lines.length && /^\s*-\s+/.test(lines[index])) {
            items.push(ArticleFrontmatter.scalar(lines[index].replace(/^\s*-\s+/, '')))
            index += 1
          }
          result[key] = items
          continue
        }
        result[key] = ''
        index += 1
        continue
      }
      result[key] = ArticleFrontmatter.scalar(rest)
      index += 1
    }
    return result
  }

  private static inlineList(value: string) {
    const inner = value.replace(/^\[/, '').replace(/\]$/, '')
    if (!inner.trim()) return []
    const items: string[] = []
    let current = ''
    let quote: string | null = null
    for (const char of inner) {
      if (quote) {
        if (char === quote) quote = null
        else current += char
        continue
      }
      if (char === '"' || char === "'") {
        quote = char
        continue
      }
      if (char === ',') {
        if (current.trim()) items.push(current.trim())
        current = ''
        continue
      }
      current += char
    }
    if (current.trim()) items.push(current.trim())
    return items
  }

  private static scalar(value: string) {
    const trimmed = value.trim()
    if (trimmed.length >= 2 && trimmed.startsWith('"') && trimmed.endsWith('"')) {
      return trimmed.slice(1, -1).replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\')
    }
    if (trimmed.length >= 2 && trimmed.startsWith("'") && trimmed.endsWith("'")) {
      return trimmed.slice(1, -1).replace(/''/g, "'")
    }
    return trimmed
  }
}
