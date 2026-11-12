import 'server-only'
import { Resend } from 'resend'

import { chatStore } from '@/lib/chat-store'
import { crmConfig } from '@/lib/crm/config'
import { createClient } from '@supabase/supabase-js'
import {
  ModelPrice,
  PUBLISHED_PRICES,
  READER_LIMIT_MESSAGE,
  SITE_CAP_MESSAGE,
  callCostUsd,
  estimateReserveUsd,
  priceFor,
  readerWithinLimits
} from '@/lib/sponsored-budget'

const ALERT_TO = 'yule@attune.legal'
const ALERT_FROM = 'Use Better Metrics <notifications@lexnova.com.au>'

export async function loadPrices(): Promise<ModelPrice[]> {
  const store = chatStore()
  if (!store) return PUBLISHED_PRICES
  const { data, error } = await store
    .from('chat_model_prices')
    .select('model, input_usd_per_mtok, output_usd_per_mtok, cache_write_5m_usd_per_mtok, cache_write_1h_usd_per_mtok, cache_read_usd_per_mtok')
  if (error || !data?.length) return PUBLISHED_PRICES
  return data.map(row => ({
    model: String(row.model),
    inputUsdPerMtok: Number(row.input_usd_per_mtok),
    outputUsdPerMtok: Number(row.output_usd_per_mtok),
    cacheWrite5mUsdPerMtok: Number(row.cache_write_5m_usd_per_mtok),
    cacheWrite1hUsdPerMtok: Number(row.cache_write_1h_usd_per_mtok),
    cacheReadUsdPerMtok: Number(row.cache_read_usd_per_mtok)
  }))
}

function monthStart() {
  const now = new Date()
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString()
}

function dayStart() {
  const now = new Date()
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())).toISOString()
}

export async function readerSpend(userId: string) {
  const store = chatStore()
  if (!store) return { questionsToday: 0, spentThisMonthUsd: 0 }
  const [day, month] = await Promise.all([
    store
      .from('chat_usage')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('paid_by', 'site')
      .eq('outcome', 'answered')
      .gte('created_at', dayStart()),
    store
      .from('chat_usage')
      .select('cost_usd')
      .eq('user_id', userId)
      .eq('paid_by', 'site')
      .gte('created_at', monthStart())
  ])
  const spent = (month.data ?? []).reduce((sum, row) => sum + (Number(row.cost_usd) || 0), 0)
  return { questionsToday: day.count ?? 0, spentThisMonthUsd: spent }
}

export async function reserveSiteSpend(input: {
  userId: string
  requestChars: number
  maxOutputTokens: number
  ttl: '5m' | '1h'
  capUsd: number
  model: string
  skipReaderLimits: boolean
  dailyQuestions: number
  monthlyUsd: number
}): Promise<{ ok: true; id: string; estimateUsd: number } | { ok: false; status: number; message: string; reason: string }> {
  const prices = await loadPrices()
  const price = priceFor(input.model, prices)
  if (!price) {
    return { ok: false, status: 503, message: 'This model has no price, so the site will not pay for it.', reason: 'no_price' }
  }
  if (!input.skipReaderLimits) {
    const spend = await readerSpend(input.userId)
    const limit = readerWithinLimits({
      questionsToday: spend.questionsToday,
      spentThisMonthUsd: spend.spentThisMonthUsd,
      dailyQuestions: input.dailyQuestions,
      monthlyUsd: input.monthlyUsd
    })
    if (!limit.allowed) {
      return { ok: false, status: 429, message: READER_LIMIT_MESSAGE, reason: limit.reason }
    }
  }
  const estimateUsd = estimateReserveUsd({
    requestChars: input.requestChars,
    maxOutputTokens: input.maxOutputTokens,
    ttl: input.ttl,
    price
  })
  const store = chatStore()
  if (!store) return { ok: false, status: 503, message: 'Spend tracking is not configured.', reason: 'store' }
  await store
    .from('chat_spend_reservations')
    .update({ status: 'released', actual_usd: 0 })
    .eq('status', 'reserved')
    .lt('created_at', new Date(Date.now() - 15 * 60 * 1000).toISOString())
  const { data, error } = await store.rpc('reserve_site_chat_spend', {
    p_user_id: input.userId,
    p_estimated: estimateUsd,
    p_cap: Math.min(50, input.capUsd)
  })
  if (error) {
    console.error('Site spend reservation failed')
    return { ok: false, status: 503, message: 'Site-paid chat is unavailable until the budget migration is applied.', reason: 'reservation' }
  }
  const result = data as { ok?: boolean; id?: string; reason?: string }
  if (!result?.ok || !result.id) {
    return { ok: false, status: 429, message: SITE_CAP_MESSAGE, reason: 'cap' }
  }
  return { ok: true, id: result.id, estimateUsd }
}

export async function settleSiteSpend(id: string, actualUsd: number) {
  const store = chatStore()
  if (!store) return
  await store.rpc('settle_site_chat_spend', { p_id: id, p_actual: actualUsd })
}

export async function releaseSiteSpend(id: string) {
  const store = chatStore()
  if (!store) return
  await store.rpc('release_site_chat_spend', { p_id: id })
}

export function actualCost(input: {
  model: string
  inputTokens: number
  outputTokens: number
  cacheReadTokens: number
  cacheWriteTokens: number
  ttl: '5m' | '1h'
  prices: ModelPrice[]
}): number {
  const price = priceFor(input.model, input.prices)
  if (!price) return 0
  return callCostUsd({ ...input, price })
}

export async function maybeAlert(capUsd: number) {
  const store = chatStore()
  if (!store || !process.env.RESEND_API_KEY) return
  const month = monthStart().slice(0, 10)
  const { data: rows } = await store
    .from('chat_spend_reservations')
    .select('actual_usd, status')
    .eq('month', month)
    .eq('status', 'settled')
  const spent = (rows ?? []).reduce((sum, row) => sum + (Number(row.actual_usd) || 0), 0)
  const ratio = capUsd > 0 ? spent / capUsd : 0
  const hit = ratio >= 1 ? '100' : ratio >= 0.8 ? '80' : ratio >= 0.5 ? '50' : null
  if (!hit) return
  const { data: existing } = await store.from('chat_budget_alerts').select('threshold').eq('month', month).eq('threshold', hit).maybeSingle()
  if (existing) return
  const { error } = await store.from('chat_budget_alerts').insert({ month, threshold: hit })
  if (error) return
  const { data: usage } = await store
    .from('chat_usage')
    .select('user_id, cost_usd')
    .eq('paid_by', 'site')
    .gte('created_at', monthStart())
  const totals = new Map<string, number>()
  for (const row of usage ?? []) {
    if (!row.user_id) continue
    totals.set(row.user_id, (totals.get(row.user_id) || 0) + (Number(row.cost_usd) || 0))
  }
  const top = Array.from(totals.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5)
  const names = await readerNames(top.map(([id]) => id))
  const lines = top.map(([id, usd]) => `${names.get(id) || id}: US$${usd.toFixed(2)}`).join('\n')
  const resend = new Resend(process.env.RESEND_API_KEY)
  await resend.emails.send({
    from: ALERT_FROM,
    to: ALERT_TO,
    subject: `Ask the AI has used ${hit}% of this month's site budget`,
    text: `Site-paid Ask the AI is at US$${spent.toFixed(2)} of the US$${capUsd.toFixed(2)} cap.\n\nTop readers:\n${lines || 'None yet.'}\n\nhttps://aimtheory.org/admin#/ai`
  })
}

async function readerNames(userIds: string[]) {
  const names = new Map<string, string>()
  const config = crmConfig()
  if (!config || userIds.length === 0) return names
  const client = createClient(config.url, config.serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } })
  const { data } = await client.from('contacts').select('site_user_id, first_name, last_name').in('site_user_id', userIds)
  for (const row of data ?? []) {
    if (row.site_user_id) names.set(row.site_user_id, `${row.first_name || ''} ${row.last_name || ''}`.trim())
  }
  return names
}

export async function sponsoredSummary(capUsd: number) {
  const store = chatStore()
  if (!store) return null
  const month = monthStart()
  const [{ data: reservations }, { data: usage }, { data: invites }] = await Promise.all([
    store.from('chat_spend_reservations').select('estimated_usd, actual_usd, status, created_at').gte('created_at', month),
    store.from('chat_usage').select('created_at, user_id, cost_usd, outcome, paid_by').eq('paid_by', 'site').gte('created_at', month),
    store.from('chat_invites').select('redeemed_at, revoked_at, expires_at')
  ])
  let settled = 0
  let reserved = 0
  for (const row of reservations ?? []) {
    if (row.status === 'settled') settled += Number(row.actual_usd) || 0
    if (row.status === 'reserved') reserved += Number(row.estimated_usd) || 0
  }
  const byDay = new Map<string, number>()
  const byUser = new Map<string, { questions: number; usd: number; last: string }>()
  for (const row of usage ?? []) {
    const day = String(row.created_at).slice(0, 10)
    byDay.set(day, (byDay.get(day) || 0) + (Number(row.cost_usd) || 0))
    if (!row.user_id) continue
    const current = byUser.get(row.user_id) || { questions: 0, usd: 0, last: row.created_at }
    if (row.outcome === 'answered') current.questions += 1
    current.usd += Number(row.cost_usd) || 0
    if (row.created_at > current.last) current.last = row.created_at
    byUser.set(row.user_id, current)
  }
  const names = await readerNames(Array.from(byUser.keys()))
  const now = Date.now()
  let sent = 0
  let redeemed = 0
  let expired = 0
  for (const row of invites ?? []) {
    if (row.redeemed_at) redeemed += 1
    else if (!row.revoked_at && new Date(row.expires_at).getTime() <= now) expired += 1
    else if (!row.revoked_at) sent += 1
  }
  return {
    capUsd,
    settled,
    reserved,
    days: Array.from(byDay.entries()).sort(([a], [b]) => a.localeCompare(b)).map(([day, usd]) => ({ day, usd })),
    readers: Array.from(byUser.entries()).map(([id, value]) => ({
      id,
      name: names.get(id) || id,
      questions: value.questions,
      usd: value.usd,
      last: value.last
    })),
    invites: { sent, redeemed, expired }
  }
}
