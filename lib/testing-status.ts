import { z } from 'zod'
import { TestingDownload } from './testing-download'

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine(value => {
    const [year, month, day] = value.split('-').map(Number)
    const date = new Date(Date.UTC(year, month - 1, day))
    return (
      date.getUTCFullYear() === year &&
      date.getUTCMonth() === month - 1 &&
      date.getUTCDate() === day
    )
  }, 'Expected a real calendar date')

const word = z.string().min(1)
const counts = z.record(z.number().int().nonnegative())

/**
 * Version 1 of testing-status.json. An unknown schemaVersion, or any field
 * that does not match, fails the whole file. Callers then show the fallback
 * rather than a partial page. Extra fields are ignored so a later annotation
 * does not blank the page.
 */
const testingStatusSchema = z.object({
  schemaVersion: z.literal(1),
  lastUpdated: isoDate,
  latestChange: isoDate,
  page: z.object({
    title: word,
    summary: word,
    intro: word
  }),
  vocabulary: z.object({
    result_status: z.record(word),
    prediction_status: z.record(word),
    task_status: z.record(word)
  }),
  falsification: z.object({
    note: z.string(),
    predictions: z.array(
      z.object({
        id: word,
        prediction: z.string(),
        would_count_against: z.string(),
        basis: z.string(),
        derivation: word,
        status: word
      })
    )
  }),
  validation: z.object({
    internal: z.object({
      summary: z.string(),
      toolchain: z.string(),
      download: z.preprocess(value => {
        if (!value || typeof value !== 'object') return undefined
        const href = (value as { href?: unknown }).href
        return typeof href === 'string' && TestingDownload.safe(href)
          ? { href }
          : undefined
      }, z.object({ href: z.string() }).optional()),
      results: z.array(
        z.object({
          area: z.string(),
          claim: z.string(),
          basis: z.string(),
          status: word
        })
      )
    }),
    external: z.object({
      summary: z.string()
    })
  }),
  calibration: z.object({
    note: z.string(),
    tasks: z.array(
      z.object({
        title: z.string(),
        detail: z.string(),
        expertise: z.string(),
        status: word
      })
    )
  }),
  openProblems: z.object({
    note: z.string(),
    problems: z.array(
      z.object({
        title: z.string(),
        detail: z.string(),
        field: z.string()
      })
    )
  }),
  collaborators: z.array(
    z.object({
      name: word,
      affiliation: z.string().optional(),
      contribution: z.string(),
      consent: z.literal(true),
      consent_date: isoDate
    })
  ),
  log: z.array(
    z.object({
      date: isoDate,
      kind: z.enum([
        'proof',
        'correction',
        'evidence',
        'calibration',
        'collaboration',
        'page'
      ]),
      title: z.string(),
      detail: z.string()
    })
  ),
  derived: z.object({
    resultCounts: counts,
    predictionCounts: counts,
    taskCounts: counts,
    machineCheckedTheorems: z.number().int().nonnegative().optional()
  })
})

export type TestingStatusFile = z.infer<typeof testingStatusSchema>

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

export class TestingStatus {
  static readonly cacheTag = 'testing-status'
  static readonly revalidateSeconds = 3600
  static readonly path = '/testing'
  static readonly preparing =
    'The status of the framework is being prepared. It is published weekly.'
  static readonly logPreview = 10

  static parse(input: unknown): TestingStatusFile | null {
    const parsed = testingStatusSchema.safeParse(input)
    return parsed.success ? parsed.data : null
  }

  /** Long date, day month year, as en-AU writes it. */
  static formatDate(iso: string): string {
    const [year, month, day] = iso.split('-').map(Number)
    const formatted = new Date(
      Date.UTC(year, month - 1, day)
    ).toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC'
    })
    if (/^\d{1,2} [A-Z][a-z]+ \d{4}$/.test(formatted)) return formatted
    return `${day} ${MONTHS[month - 1]} ${year}`
  }

  static dateLine(status: TestingStatusFile): string {
    return `Last updated ${TestingStatus.formatDate(
      status.lastUpdated
    )} · Latest change ${TestingStatus.formatDate(status.latestChange)}`
  }

  /**
   * Theorems from machineCheckedTheorems, then each resultCounts entry.
   * The machine-checked result tally is omitted when the theorem count is
   * present, matching the published line (theorems, cited, open). Any other
   * word is included so a new status is not dropped.
   */
  static resultLine(derived: TestingStatusFile['derived']): string {
    const parts: string[] = []
    if (typeof derived.machineCheckedTheorems === 'number') {
      const count = derived.machineCheckedTheorems
      parts.push(
        `${count} ${count === 1 ? 'theorem' : 'theorems'} machine-checked`
      )
    }
    for (const [name, count] of Object.entries(derived.resultCounts)) {
      if (
        name === 'machine-checked' &&
        typeof derived.machineCheckedTheorems === 'number'
      ) {
        continue
      }
      parts.push(TestingStatus.resultPhrase(name, count))
    }
    return parts.join(' · ')
  }

  static taskLine(counts: Record<string, number>): string {
    return Object.entries(counts)
      .map(([name, count]) => {
        const task = count === 1 ? 'task' : 'tasks'
        return `${count} ${task} ${name}`
      })
      .join(' · ')
  }

  static splitLog<T>(entries: readonly T[]): { latest: T[]; earlier: T[] } {
    return {
      latest: entries.slice(0, TestingStatus.logPreview),
      earlier: entries.slice(TestingStatus.logPreview)
    }
  }

  static kindLabel(kind: string): string {
    if (!kind) return kind
    return kind.charAt(0).toLocaleUpperCase('en-AU') + kind.slice(1)
  }

  /** Weekly summary for the site chat. Names only, never consent fields. */
  static brief(status: TestingStatusFile): string {
    const lines = [
      'Testing status, republished weekly at /testing. Use this for where the framework stands. Do not describe a result with a stronger status than the words below.',
      TestingStatus.dateLine(status),
      status.page.intro,
      `Checked: ${TestingStatus.resultLine(status.derived)}`,
      status.validation.internal.summary,
      status.validation.internal.toolchain,
      status.validation.external.summary,
      'Predictions:',
      ...status.falsification.predictions.map(
        item =>
          `- ${item.prediction} Derivation: ${item.derivation}. Evidence: ${item.status}. ${item.basis}`
      ),
      `Still to measure: ${TestingStatus.taskLine(status.derived.taskCounts)}`,
      ...status.calibration.tasks.map(
        task =>
          `- ${task.title} (${task.status}; ${task.expertise}). ${task.detail}`
      ),
      'Open problems:',
      ...status.openProblems.problems.map(
        problem => `- ${problem.title} (${problem.field}). ${problem.detail}`
      )
    ]
    if (status.collaborators.length > 0) {
      lines.push('Collaborators:')
      for (const person of status.collaborators) {
        const affiliation = person.affiliation ? `, ${person.affiliation}` : ''
        lines.push(`- ${person.name}${affiliation}: ${person.contribution}`)
      }
    }
    return lines.join('\n')
  }

  static async forChat(): Promise<string> {
    const status = await TestingStatus.load()
    return status ? TestingStatus.brief(status) : ''
  }

  static url(): string | null {
    const base = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!base) return null
    return `${base.replace(
      /\/$/,
      ''
    )}/storage/v1/object/public/treatise-ebooks/testing-status.json`
  }

  /**
   * The published file. A network failure during revalidation is left to
   * Next's fetch cache, which keeps the last good response. A missing file,
   * or a body that is not version 1, returns null so the page shows the
   * fallback instead of a partial render. The fetch options are the cache
   * contract the publish workflow refreshes.
   */
  static async load(): Promise<TestingStatusFile | null> {
    const url = TestingStatus.url()
    if (!url) return null
    try {
      const response = await fetch(url, {
        next: {
          revalidate: TestingStatus.revalidateSeconds,
          tags: [TestingStatus.cacheTag]
        }
      })
      if (!response.ok) return null
      return TestingStatus.parse(await response.json())
    } catch {
      return null
    }
  }

  private static resultPhrase(name: string, count: number): string {
    if (name === 'cited') {
      return count === 1
        ? '1 result rests on a cited theorem'
        : `${count} results rest on a cited theorem`
    }
    if (name === 'open') return `${count} open`
    if (name === 'derived') return `${count} derived`
    return `${count} ${name}`
  }
}
