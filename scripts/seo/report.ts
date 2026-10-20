/**
 * scripts/seo/report.ts
 *
 * Assembles the weekly SEO report from the JSON written by crawl.ts,
 * checks.ts, fix-articles.ts, ping.ts, traffic.ts and Lighthouse CI, writes
 * it as Markdown, and emails it with Resend when RESEND_API_KEY and
 * SEO_REPORT_TO are set.
 *
 * Outputs:
 *   seo-output/report.md     full report (also the GitHub issue body)
 *   seo-output/summary.json  { status, title, headline, counts } for the workflow
 *   $GITHUB_STEP_SUMMARY     the report, when running in Actions
 */
import fs from 'node:fs'
import path from 'node:path'
import { Resend } from 'resend'
import type { ChecksOutput, CrawlOutput, Finding } from './lib'
import { IS_CI, SITE_URL, hasFlag, isoDate, outPath, readJson, writeJson, writeText } from './lib'
import type { FixesOutput } from './fix-articles'
import type { PingOutput } from './ping'
import type { TrafficOutput } from './traffic'

const REPORT_FROM = process.env.SEO_REPORT_FROM || 'AIM Theory SEO monitor <notifications@lexnova.com.au>'

interface LighthouseRun {
  url: string
  summary: { performance: number; accessibility: number; 'best-practices': number; seo: number }
}

function readLighthouse(): LighthouseRun[] {
  const manifest = path.join(process.cwd(), '.lighthouseci', 'manifest.json')
  const runs = readJson<any[]>(manifest)
  if (!runs) return []
  // One representative run per URL (LHCI marks it).
  return runs
    .filter(run => run.isRepresentativeRun !== false)
    .map(run => ({ url: run.url, summary: run.summary }))
}

function pct(value: number) {
  return `${Math.round(value * 100)}`
}

function delta(current: number, previous: number) {
  if (previous === 0) return current === 0 ? '±0' : `+${current}`
  const diff = current - previous
  const sign = diff > 0 ? '+' : ''
  return `${sign}${diff} (${sign}${Math.round((diff / previous) * 100)}%)`
}

function groupFindings(findings: Finding[]) {
  const groups = new Map<string, Finding[]>()
  for (const finding of findings) groups.set(finding.rule, [...(groups.get(finding.rule) ?? []), finding])
  return Array.from(groups.entries()).sort((a, b) => {
    const severity = (rule: Finding[]) => (rule[0].severity === 'fail' ? 0 : 1)
    return severity(a[1]) - severity(b[1]) || b[1].length - a[1].length
  })
}

function shortUrl(url: string) {
  return url.replace(SITE_URL, '') || '/'
}

function buildReport() {
  const crawl = readJson<CrawlOutput>(outPath('crawl.json'))
  const checks = readJson<ChecksOutput>(outPath('checks.json'))
  const fixes = readJson<FixesOutput>(outPath('fixes.json'))
  const ping = readJson<PingOutput>(outPath('ping.json'))
  const traffic = readJson<TrafficOutput>(outPath('traffic.json'))
  const lighthouse = readLighthouse()

  const date = isoDate()
  const lines: string[] = []
  const status = checks?.status ?? (crawl ? 'warn' : 'fail')
  const fails = checks?.findings.filter(f => f.severity === 'fail') ?? []
  const warns = checks?.findings.filter(f => f.severity === 'warn') ?? []

  const headlineParts: string[] = []
  if (checks) headlineParts.push(`${checks.passCount}/${checks.pageCount} pages pass`)
  if (fails.length) headlineParts.push(`${fails.length} failures`)
  if (checks?.regressions.length) headlineParts.push(`${checks.regressions.length} regressions`)
  if (traffic?.vercel?.available) {
    headlineParts.push(`${traffic.vercel.search.thisWeek.visitors} search visitors (${delta(traffic.vercel.search.thisWeek.visitors, traffic.vercel.search.lastWeek.visitors)})`)
  }
  const headline = headlineParts.join(' · ') || 'no data'

  lines.push(`# SEO report ${date} — ${SITE_URL}`)
  lines.push('')
  lines.push(`**Status: ${status.toUpperCase()}** — ${headline}`)
  lines.push('')

  // Traffic
  lines.push('## Organic traffic (week over week)')
  lines.push('')
  if (traffic?.vercel?.available) {
    const v = traffic.vercel
    lines.push(`Source: Vercel Web Analytics (REST API). Window ${traffic.window.thisWeek[0]} → ${traffic.window.thisWeek[1]} vs the 7 days before.`)
    lines.push('')
    lines.push('| Metric | This week | Last week | Change |')
    lines.push('|---|---:|---:|---|')
    lines.push(`| All visitors | ${v.total.thisWeek.visitors} | ${v.total.lastWeek.visitors} | ${delta(v.total.thisWeek.visitors, v.total.lastWeek.visitors)} |`)
    lines.push(`| All pageviews | ${v.total.thisWeek.pageviews} | ${v.total.lastWeek.pageviews} | ${delta(v.total.thisWeek.pageviews, v.total.lastWeek.pageviews)} |`)
    lines.push(`| Search-engine visitors | ${v.search.thisWeek.visitors} | ${v.search.lastWeek.visitors} | ${delta(v.search.thisWeek.visitors, v.search.lastWeek.visitors)} |`)
    lines.push(`| Search-engine pageviews | ${v.search.thisWeek.pageviews} | ${v.search.lastWeek.pageviews} | ${delta(v.search.thisWeek.pageviews, v.search.lastWeek.pageviews)} |`)
    lines.push('')
    if (v.referrers.length) {
      lines.push('Top referrers this week: ' + v.referrers.slice(0, 8).map(r => `${r.key} (${r.visitors})`).join(', '))
      lines.push('')
    }
    if (v.searchLandingPages.length) {
      lines.push('Search landing pages this week:')
      lines.push('')
      for (const row of v.searchLandingPages.slice(0, 10)) lines.push(`- \`${row.key}\` — ${row.visitors} visitors`)
      lines.push('')
    }
  } else {
    lines.push(`Vercel Web Analytics unavailable: ${traffic?.vercel?.detail ?? 'traffic.ts did not run'}.`)
    lines.push('')
  }

  if (traffic?.searchConsole?.available) {
    const sc = traffic.searchConsole
    lines.push(`### Google Search Console (${sc.window[0]} → ${sc.window[1]})`)
    lines.push('')
    lines.push('| Metric | This week | Last week |')
    lines.push('|---|---:|---:|')
    lines.push(`| Clicks | ${sc.thisWeek.clicks} | ${sc.lastWeek.clicks} |`)
    lines.push(`| Impressions | ${sc.thisWeek.impressions} | ${sc.lastWeek.impressions} |`)
    lines.push(`| CTR | ${(sc.thisWeek.ctr * 100).toFixed(1)}% | ${(sc.lastWeek.ctr * 100).toFixed(1)}% |`)
    lines.push(`| Avg position | ${sc.thisWeek.position.toFixed(1)} | ${sc.lastWeek.position.toFixed(1)} |`)
    lines.push('')
    if (sc.topQueries.length) {
      lines.push('Top queries: ' + sc.topQueries.slice(0, 10).map(q => `"${q.query}" (${q.clicks}/${q.impressions}, pos ${q.position})`).join('; '))
      lines.push('')
    }
  } else if (traffic) {
    lines.push(`Search Console: ${traffic.searchConsole?.detail}. Impressions, queries and index coverage are only available once a service account is shared with the property.`)
    lines.push('')
  }

  if (traffic?.ga4?.available) {
    lines.push('### GA4 sessions by channel')
    lines.push('')
    lines.push('| Channel | This week | Last week |')
    lines.push('|---|---:|---:|')
    for (const row of traffic.ga4.channels) lines.push(`| ${row.channel} | ${row.thisWeek} | ${row.lastWeek} |`)
    lines.push('')
  }

  // Technical checks
  lines.push('## Technical checks')
  lines.push('')
  if (checks && crawl) {
    lines.push(`Crawled ${crawl.sitemapUrlCount} sitemap URLs as Googlebot. ${checks.passCount} pass all blocking rules; ${fails.length} failures, ${warns.length} warnings.`)
    lines.push('')
    if (checks.regressions.length) {
      lines.push(`### Regressions since last run (${checks.regressions.length})`)
      lines.push('')
      for (const f of checks.regressions.slice(0, 40)) lines.push(`- **${f.severity}** ${f.rule} — \`${shortUrl(f.url)}\` — ${f.detail}`)
      if (checks.regressions.length > 40) lines.push(`- … and ${checks.regressions.length - 40} more`)
      lines.push('')
    }
    if (checks.resolved.length) {
      lines.push(`Resolved since last run: ${checks.resolved.length}.`)
      lines.push('')
    }
    if (checks.missingPages.length) {
      lines.push(`### Pages missing from the sitemap since last run (${checks.missingPages.length})`)
      lines.push('')
      for (const url of checks.missingPages.slice(0, 30)) lines.push(`- \`${shortUrl(url)}\``)
      lines.push('')
    }
    if (checks.newPages.length) {
      lines.push(`New pages in the sitemap: ${checks.newPages.length}.`)
      lines.push('')
    }

    lines.push('### Findings by rule')
    lines.push('')
    if (checks.findings.length === 0) {
      lines.push('No findings.')
    } else {
      for (const [rule, findings] of groupFindings(checks.findings)) {
        lines.push(`<details><summary><strong>${findings[0].severity}</strong> ${rule} — ${findings.length} page(s)</summary>`)
        lines.push('')
        for (const f of findings.slice(0, 25)) lines.push(`- \`${shortUrl(f.url)}\` — ${f.detail}`)
        if (findings.length > 25) lines.push(`- … and ${findings.length - 25} more`)
        lines.push('')
        lines.push('</details>')
        lines.push('')
      }
    }

    lines.push('### Host and infrastructure checks')
    lines.push('')
    for (const host of checks.hostChecks) lines.push(`- ${host.ok ? '✅' : '❌'} ${host.name} — ${host.detail}`)
    lines.push('')
  } else {
    lines.push('crawl.json / checks.json not found; the crawl did not complete.')
    lines.push('')
  }

  // Lighthouse
  lines.push('## Lighthouse (mobile, lab)')
  lines.push('')
  if (lighthouse.length) {
    lines.push('| URL | Perf | A11y | Best practices | SEO |')
    lines.push('|---|---:|---:|---:|---:|')
    for (const run of lighthouse) {
      lines.push(`| \`${shortUrl(run.url)}\` | ${pct(run.summary.performance)} | ${pct(run.summary.accessibility)} | ${pct(run.summary['best-practices'])} | ${pct(run.summary.seo)} |`)
    }
    lines.push('')
  } else {
    lines.push('No Lighthouse results in this run.')
    lines.push('')
  }

  // Auto fixes
  lines.push('## Article metadata fixes')
  lines.push('')
  if (fixes) {
    lines.push(`Mode: ${fixes.mode} (model ${fixes.model}). ${fixes.candidates} article(s) needed metadata; ${fixes.applied} applied, ${fixes.skipped} skipped, ${fixes.failed} failed.`)
    lines.push('')
    for (const record of fixes.records) {
      const state = record.applied ? 'applied' : record.error ? `not applied: ${record.error}` : 'dry run'
      lines.push(`- \`${shortUrl(record.url)}\` — ${record.reason.join(', ')} — ${state}`)
      if (record.after) lines.push(`  - title: ${record.after.metaTitle}`)
    }
    lines.push('')
  } else {
    lines.push('fix-articles.ts did not run.')
    lines.push('')
  }

  // Pings
  lines.push('## Search engine notifications')
  lines.push('')
  if (ping) {
    lines.push(`- Changed URLs: ${ping.changedUrls.length}`)
    lines.push(`- IndexNow: ${ping.indexNow.detail}`)
    lines.push(`- Google sitemap submit: ${ping.googleSitemap.detail}`)
    lines.push(`- Google Indexing API: ${ping.googleIndexing.detail}`)
  } else {
    lines.push('ping.ts did not run.')
  }
  lines.push('')

  lines.push('---')
  lines.push(`Generated by \`scripts/seo/*\` via GitHub Actions. Vercel analytics read through the REST API (never the Vercel MCP).`)

  return {
    markdown: lines.join('\n'),
    summary: {
      date,
      status,
      title: `SEO report ${date}: ${status.toUpperCase()} — ${headline}`,
      headline,
      failures: fails.length,
      warnings: warns.length,
      regressions: checks?.regressions.length ?? 0,
      missingPages: checks?.missingPages.length ?? 0,
      pages: checks?.pageCount ?? 0,
      fixesApplied: fixes?.applied ?? 0,
      shouldOpenIssue: status === 'fail' || (checks?.regressions.length ?? 0) > 0 || (checks?.missingPages.length ?? 0) > 0
    }
  }
}

async function sendEmail(subject: string, markdown: string) {
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.SEO_REPORT_TO
  if (!apiKey || !to) {
    console.log('Email skipped: RESEND_API_KEY or SEO_REPORT_TO not set')
    return
  }
  const resend = new Resend(apiKey)
  const runUrl = process.env.GITHUB_SERVER_URL && process.env.GITHUB_REPOSITORY && process.env.GITHUB_RUN_ID
    ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
    : null
  const text = runUrl ? `${markdown}\n\nFull run: ${runUrl}` : markdown
  const { error } = await resend.emails.send({
    from: REPORT_FROM,
    to: to.split(',').map(s => s.trim()).filter(Boolean),
    subject,
    text
  })
  if (error) {
    console.error('Email failed:', error.message)
  } else {
    console.log(`Email sent to ${to}`)
  }
}

async function main() {
  const { markdown, summary } = buildReport()
  writeText('report.md', markdown)
  writeJson('summary.json', summary)
  console.log(summary.title)

  if (process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, markdown + '\n')
  }

  if (hasFlag('--email') || (IS_CI && !hasFlag('--no-email'))) {
    await sendEmail(summary.title, markdown)
  } else {
    console.log('Email not sent (pass --email to send locally). Report at seo-output/report.md')
  }
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
