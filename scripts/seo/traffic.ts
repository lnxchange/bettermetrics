/**
 * scripts/seo/traffic.ts
 *
 * Week-over-week organic traffic for the report.
 *
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │ VERCEL WEB ANALYTICS: USE THE CLI / REST API, NOT THE VERCEL MCP.        │
 * │                                                                          │
 * │ The Vercel MCP tools (aggregate_pageviews, count_pageviews,              │
 * │ observability queries) return "404 Web Analytics not found" for this     │
 * │ project even though analytics is enabled and populated. Do not infer     │
 * │ from that error that analytics is off. The REST endpoint below is the    │
 * │ same one `vercel api` uses and works with a plain bearer token:          │
 * │                                                                          │
 * │   vercel api "/v1/query/web-analytics/visits/aggregate?projectId=...     │
 * │     &teamId=...&by=referrerHostname&since=...&until=..." --method GET    │
 * │                                                                          │
 * │ Project prj_xIOsq7oNKYobDGdBEG5L3Q7vsC0A, team team_T6k1ldIUXFXt6J1HsBksNBzy │
 * └──────────────────────────────────────────────────────────────────────────┘
 *
 * Sources (each optional; the script reports what it could reach):
 *   - Vercel Web Analytics  VERCEL_TOKEN (+ VERCEL_PROJECT_ID / VERCEL_TEAM_ID overrides)
 *   - Google Search Console GSC_SERVICE_ACCOUNT_JSON (+ GSC_PROPERTY, default sc-domain:aimtheory.org)
 *   - GA4 Data API          GA4_SERVICE_ACCOUNT_JSON (or GSC_SERVICE_ACCOUNT_JSON) + GA4_PROPERTY_ID
 *
 * Output: seo-output/traffic.json
 */
import { SITE_HOST, daysAgo, isoDate, safeFetch, writeJson } from './lib'
import { SCOPES, googleFetch, parseServiceAccount } from './google-auth'

const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID || 'prj_xIOsq7oNKYobDGdBEG5L3Q7vsC0A'
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID || 'team_T6k1ldIUXFXt6J1HsBksNBzy'

const SEARCH_ENGINE = /(^|\.)(google|bing|duckduckgo|yahoo|ecosia|brave|yandex|baidu|startpage|qwant|perplexity|chatgpt|openai|anthropic|claude)\./i

interface Totals {
  visitors: number
  pageviews: number
}

interface Row {
  key: string
  visitors: number
  pageviews: number
}

export interface TrafficOutput {
  ranAt: string
  window: { thisWeek: [string, string]; lastWeek: [string, string] }
  vercel: {
    available: boolean
    detail?: string
    total: { thisWeek: Totals; lastWeek: Totals }
    search: { thisWeek: Totals; lastWeek: Totals }
    referrers: Row[]
    searchLandingPages: Row[]
    topPages: Row[]
  } | null
  searchConsole: {
    available: boolean
    detail?: string
    window: [string, string]
    thisWeek: { clicks: number; impressions: number; ctr: number; position: number }
    lastWeek: { clicks: number; impressions: number; ctr: number; position: number }
    topQueries: { query: string; clicks: number; impressions: number; position: number }[]
    topPages: { page: string; clicks: number; impressions: number; position: number }[]
  } | null
  ga4: {
    available: boolean
    detail?: string
    channels: { channel: string; thisWeek: number; lastWeek: number }[]
    organicLandingPages: { page: string; sessions: number }[]
  } | null
}

// ---------------------------------------------------------------------------
// Vercel Web Analytics (REST, not MCP)
// ---------------------------------------------------------------------------

async function vercelQuery(token: string, path: string, params: Record<string, string>) {
  const query = new URLSearchParams({ projectId: VERCEL_PROJECT_ID, teamId: VERCEL_TEAM_ID, ...params })
  const response = await safeFetch(`https://api.vercel.com/v1/query/web-analytics/${path}?${query}`, {
    headers: { authorization: `Bearer ${token}` }
  })
  if (!response) throw new Error(`Vercel analytics ${path}: network error`)
  if (!response.ok) throw new Error(`Vercel analytics ${path}: ${response.status} ${(await response.text()).slice(0, 200)}`)
  return (await response.json()) as { data: any }
}

function sumRows(rows: Row[]): Totals {
  return rows.reduce((acc, row) => ({ visitors: acc.visitors + row.visitors, pageviews: acc.pageviews + row.pageviews }), { visitors: 0, pageviews: 0 })
}

async function vercelTraffic(thisWeek: [Date, Date], lastWeek: [Date, Date]): Promise<TrafficOutput['vercel']> {
  const token = process.env.VERCEL_TOKEN
  if (!token) {
    return { available: false, detail: 'VERCEL_TOKEN not set', total: emptyWeeks(), search: emptyWeeks(), referrers: [], searchLandingPages: [], topPages: [] }
  }
  try {
    const range = (week: [Date, Date]) => ({ since: week[0].toISOString(), until: week[1].toISOString() })
    const rows = (data: any[], key: string): Row[] =>
      (data || []).map(item => ({ key: item[key] === '' ? '(direct)' : String(item[key]), visitors: item.visitors ?? 0, pageviews: item.pageviews ?? 0 }))

    const [totalThis, totalLast, refThis, refLast, landing, pages] = await Promise.all([
      vercelQuery(token, 'visits/count', range(thisWeek)),
      vercelQuery(token, 'visits/count', range(lastWeek)),
      vercelQuery(token, 'visits/aggregate', { ...range(thisWeek), by: 'referrerHostname', limit: '100' }),
      vercelQuery(token, 'visits/aggregate', { ...range(lastWeek), by: 'referrerHostname', limit: '100' }),
      vercelQuery(token, 'visits/aggregate', {
        ...range(thisWeek),
        by: 'requestPath',
        limit: '25',
        filter: "referrerHostname in ('google.com','www.google.com','google.com.au','www.google.com.au','bing.com','www.bing.com','duckduckgo.com','search.yahoo.com','ecosia.org','www.ecosia.org','search.brave.com')"
      }),
      vercelQuery(token, 'visits/aggregate', { ...range(thisWeek), by: 'requestPath', limit: '15' })
    ])

    const referrersThis = rows(refThis.data, 'referrerHostname')
    const referrersLast = rows(refLast.data, 'referrerHostname')
    const isSearch = (row: Row) => SEARCH_ENGINE.test(`${row.key}.`) || /^(google|bing|duckduckgo)\.com$/i.test(row.key)

    return {
      available: true,
      total: {
        thisWeek: { visitors: totalThis.data?.visitors ?? 0, pageviews: totalThis.data?.pageviews ?? 0 },
        lastWeek: { visitors: totalLast.data?.visitors ?? 0, pageviews: totalLast.data?.pageviews ?? 0 }
      },
      search: { thisWeek: sumRows(referrersThis.filter(isSearch)), lastWeek: sumRows(referrersLast.filter(isSearch)) },
      referrers: referrersThis.sort((a, b) => b.visitors - a.visitors).slice(0, 15),
      searchLandingPages: rows(landing.data, 'requestPath'),
      topPages: rows(pages.data, 'requestPath')
    }
  } catch (err) {
    return {
      available: false,
      detail: err instanceof Error ? err.message : String(err),
      total: emptyWeeks(),
      search: emptyWeeks(),
      referrers: [],
      searchLandingPages: [],
      topPages: []
    }
  }
}

function emptyWeeks() {
  return { thisWeek: { visitors: 0, pageviews: 0 }, lastWeek: { visitors: 0, pageviews: 0 } }
}

// ---------------------------------------------------------------------------
// Google Search Console (optional)
// ---------------------------------------------------------------------------

async function searchConsoleTraffic(): Promise<TrafficOutput['searchConsole']> {
  const account = parseServiceAccount(process.env.GSC_SERVICE_ACCOUNT_JSON)
  if (!account) return { available: false, detail: 'GSC_SERVICE_ACCOUNT_JSON not set', ...emptyGsc() }

  // Search Console data lags by about three days.
  const end = daysAgo(3)
  const thisWeek: [string, string] = [isoDate(daysAgo(6, end)), isoDate(end)]
  const lastWeek: [string, string] = [isoDate(daysAgo(13, end)), isoDate(daysAgo(7, end))]
  const property = process.env.GSC_PROPERTY || `sc-domain:${SITE_HOST}`
  const endpoint = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(property)}/searchAnalytics/query`

  const query = async (body: Record<string, unknown>) => {
    const response = await googleFetch(account, SCOPES.searchConsoleReadonly, endpoint, { method: 'POST', body: JSON.stringify(body) })
    if (!response.ok) throw new Error(`Search Console ${response.status}: ${(await response.text()).slice(0, 200)}`)
    return ((await response.json()) as { rows?: any[] }).rows ?? []
  }
  const totals = (rows: any[]) => {
    const row = rows[0] ?? {}
    return { clicks: row.clicks ?? 0, impressions: row.impressions ?? 0, ctr: row.ctr ?? 0, position: row.position ?? 0 }
  }

  try {
    const [thisRows, lastRows, queries, pages] = await Promise.all([
      query({ startDate: thisWeek[0], endDate: thisWeek[1] }),
      query({ startDate: lastWeek[0], endDate: lastWeek[1] }),
      query({ startDate: thisWeek[0], endDate: thisWeek[1], dimensions: ['query'], rowLimit: 20 }),
      query({ startDate: thisWeek[0], endDate: thisWeek[1], dimensions: ['page'], rowLimit: 20 })
    ])
    return {
      available: true,
      window: thisWeek,
      thisWeek: totals(thisRows),
      lastWeek: totals(lastRows),
      topQueries: queries.map(row => ({ query: row.keys[0], clicks: row.clicks, impressions: row.impressions, position: Math.round(row.position * 10) / 10 })),
      topPages: pages.map(row => ({ page: row.keys[0], clicks: row.clicks, impressions: row.impressions, position: Math.round(row.position * 10) / 10 }))
    }
  } catch (err) {
    return { available: false, detail: err instanceof Error ? err.message : String(err), ...emptyGsc() }
  }
}

function emptyGsc() {
  const zero = { clicks: 0, impressions: 0, ctr: 0, position: 0 }
  return { window: ['', ''] as [string, string], thisWeek: zero, lastWeek: zero, topQueries: [], topPages: [] }
}

// ---------------------------------------------------------------------------
// GA4 Data API (optional)
// ---------------------------------------------------------------------------

async function ga4Traffic(): Promise<TrafficOutput['ga4']> {
  const propertyId = process.env.GA4_PROPERTY_ID
  const account = parseServiceAccount(process.env.GA4_SERVICE_ACCOUNT_JSON || process.env.GSC_SERVICE_ACCOUNT_JSON)
  if (!propertyId || !account) {
    return { available: false, detail: 'GA4_PROPERTY_ID / service account not set', channels: [], organicLandingPages: [] }
  }
  const endpoint = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId.replace(/^properties\//, '')}:runReport`
  const run = async (body: Record<string, unknown>) => {
    const response = await googleFetch(account, SCOPES.analyticsReadonly, endpoint, { method: 'POST', body: JSON.stringify(body) })
    if (!response.ok) throw new Error(`GA4 ${response.status}: ${(await response.text()).slice(0, 200)}`)
    return ((await response.json()) as { rows?: any[] }).rows ?? []
  }
  try {
    const channelRows = await run({
      dateRanges: [
        { startDate: '7daysAgo', endDate: 'yesterday' },
        { startDate: '14daysAgo', endDate: '8daysAgo' }
      ],
      dimensions: [{ name: 'sessionDefaultChannelGroup' }],
      metrics: [{ name: 'sessions' }]
    })
    const channels = new Map<string, { thisWeek: number; lastWeek: number }>()
    for (const row of channelRows) {
      const channel = row.dimensionValues[0].value
      const range = row.dimensionValues[1]?.value ?? 'date_range_0'
      const entry = channels.get(channel) ?? { thisWeek: 0, lastWeek: 0 }
      if (range === 'date_range_0') entry.thisWeek += Number(row.metricValues[0].value)
      else entry.lastWeek += Number(row.metricValues[0].value)
      channels.set(channel, entry)
    }
    const landingRows = await run({
      dateRanges: [{ startDate: '7daysAgo', endDate: 'yesterday' }],
      dimensions: [{ name: 'landingPage' }],
      metrics: [{ name: 'sessions' }],
      dimensionFilter: { filter: { fieldName: 'sessionDefaultChannelGroup', stringFilter: { value: 'Organic Search' } } },
      limit: 15
    })
    return {
      available: true,
      channels: Array.from(channels.entries()).map(([channel, v]) => ({ channel, ...v })).sort((a, b) => b.thisWeek - a.thisWeek),
      organicLandingPages: landingRows.map(row => ({ page: row.dimensionValues[0].value, sessions: Number(row.metricValues[0].value) }))
    }
  } catch (err) {
    return { available: false, detail: err instanceof Error ? err.message : String(err), channels: [], organicLandingPages: [] }
  }
}

async function main() {
  const now = new Date()
  const thisWeek: [Date, Date] = [daysAgo(7, now), now]
  const lastWeek: [Date, Date] = [daysAgo(14, now), daysAgo(7, now)]

  const [vercel, searchConsole, ga4] = await Promise.all([vercelTraffic(thisWeek, lastWeek), searchConsoleTraffic(), ga4Traffic()])

  const output: TrafficOutput = {
    ranAt: now.toISOString(),
    window: { thisWeek: [isoDate(thisWeek[0]), isoDate(thisWeek[1])], lastWeek: [isoDate(lastWeek[0]), isoDate(lastWeek[1])] },
    vercel,
    searchConsole,
    ga4
  }
  writeJson('traffic.json', output)

  if (vercel?.available) {
    console.log(`Vercel: ${vercel.total.thisWeek.visitors} visitors this week (${vercel.total.lastWeek.visitors} last week); search ${vercel.search.thisWeek.visitors} (${vercel.search.lastWeek.visitors})`)
  } else {
    console.log(`Vercel: unavailable - ${vercel?.detail}`)
  }
  console.log(`Search Console: ${searchConsole?.available ? `${searchConsole.thisWeek.clicks} clicks / ${searchConsole.thisWeek.impressions} impressions` : `unavailable - ${searchConsole?.detail}`}`)
  console.log(`GA4: ${ga4?.available ? `${ga4.channels.length} channels` : `unavailable - ${ga4?.detail}`}`)
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
