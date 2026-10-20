/**
 * Shared helpers for the SEO monitor scripts (scripts/seo/*).
 *
 * All scripts write to and read from `seo-output/` (gitignored). In GitHub
 * Actions the previous run's output is restored into `seo-output/previous/`
 * so checks.ts can diff against it.
 */
import fs from 'node:fs'
import path from 'node:path'
import dotenv from 'dotenv'

const envPath = path.join(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath })
}

export const SITE_URL = (process.env.SEO_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://aimtheory.org').replace(/\/$/, '')
export const SITE_HOST = new URL(SITE_URL).host

export const OUT_DIR = path.join(process.cwd(), 'seo-output')
export const PREV_DIR = path.join(OUT_DIR, 'previous')

export const GOOGLEBOT_UA =
  'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Googlebot/2.1; +http://www.google.com/bot.html) Chrome/125.0.0.0 Safari/537.36 aimtheory-seo-monitor'

export const IS_CI = process.env.GITHUB_ACTIONS === 'true' || process.env.CI === 'true'

export function ensureOutDir() {
  fs.mkdirSync(OUT_DIR, { recursive: true })
}

export function outPath(name: string) {
  return path.join(OUT_DIR, name)
}

export function prevPath(name: string) {
  return path.join(PREV_DIR, name)
}

export function writeJson(name: string, value: unknown) {
  ensureOutDir()
  fs.writeFileSync(outPath(name), JSON.stringify(value, null, 2))
}

export function readJson<T>(file: string): T | null {
  try {
    if (!fs.existsSync(file)) return null
    return JSON.parse(fs.readFileSync(file, 'utf8')) as T
  } catch {
    return null
  }
}

export function writeText(name: string, value: string) {
  ensureOutDir()
  fs.writeFileSync(outPath(name), value)
}

export function hasFlag(flag: string) {
  return process.argv.includes(flag)
}

export function argValue(name: string): string | undefined {
  const index = process.argv.indexOf(name)
  if (index === -1) return undefined
  return process.argv[index + 1]
}

export function isoDate(date = new Date()) {
  return date.toISOString().slice(0, 10)
}

export function daysAgo(days: number, from = new Date()) {
  return new Date(from.getTime() - days * 86_400_000)
}

export async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T, index: number) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length)
  let next = 0
  async function worker() {
    while (next < items.length) {
      const index = next++
      results[index] = await fn(items[index], index)
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker))
  return results
}

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/** Fetch with a timeout; never throws, returns null on network failure. */
export async function safeFetch(url: string, init: RequestInit = {}, timeoutMs = 20_000): Promise<Response | null> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, { ...init, signal: controller.signal })
  } catch {
    return null
  } finally {
    clearTimeout(timer)
  }
}

export function decodeEntities(text: string) {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
}

// ---------------------------------------------------------------------------
// Shared result types
// ---------------------------------------------------------------------------

export interface CrawlPage {
  url: string
  status: number | null
  finalUrl: string
  redirects: string[]
  ttfbMs: number | null
  bytes: number
  title: string | null
  description: string | null
  canonical: string | null
  robotsMeta: string | null
  xRobotsTag: string | null
  h1Count: number
  h1Text: string | null
  ogImage: string | null
  jsonLdBlocks: number
  jsonLdInvalid: number
  jsonLdTypes: string[]
  contentType: string | null
  error?: string
}

export interface CrawlOutput {
  site: string
  startedAt: string
  finishedAt: string
  sitemapStatus: number | null
  sitemapUrlCount: number
  robotsStatus: number | null
  robotsHasSitemap: boolean
  pages: CrawlPage[]
}

export type Severity = 'fail' | 'warn'

export interface Finding {
  url: string
  rule: string
  severity: Severity
  detail: string
}

export interface ChecksOutput {
  site: string
  checkedAt: string
  pageCount: number
  passCount: number
  findings: Finding[]
  regressions: Finding[]
  resolved: Finding[]
  missingPages: string[]
  newPages: string[]
  hostChecks: { name: string; ok: boolean; detail: string }[]
  status: 'ok' | 'warn' | 'fail'
}
