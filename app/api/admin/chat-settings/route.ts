import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

import { auth } from '@/auth'
import { chatStore } from '@/lib/chat-store'
import { loadPrices, sponsoredSummary } from '@/lib/chat-budget'
import { CHAT_PROVIDERS, isChatProvider } from '@/lib/chat-provider-ids'
import {
  ChatSettings,
  clearSettingsCache,
  settingsFromRow
} from '@/lib/chat-settings'

export const runtime = 'nodejs'

function service() {
  return chatStore()
}

async function admin() {
  const cookieStore = cookies()
  const session = await auth({ cookieStore })
  if (session?.user?.user_metadata?.is_admin !== true) return null
  return session
}

function rowFromSettings(settings: ChatSettings) {
  return {
    id: 1,
    paused: settings.paused,
    paused_message: settings.pausedMessage,
    providers: settings.providers,
    models: settings.models,
    max_output_tokens: settings.maxOutputTokens,
    treatise_context_max_chars: settings.treatiseContextMaxChars,
    max_messages: settings.maxMessages,
    max_conversation_chars: settings.maxConversationChars,
    questions_per_user_hour: settings.questionsPerUserHour,
    questions_per_user_day: settings.questionsPerUserDay,
    questions_per_ip_day: settings.questionsPerIpDay,
    guest_chat: settings.guestChat,
    guest_daily_per_ip: settings.guestDailyPerIp,
    guest_daily_global: settings.guestDailyGlobal,
    cache: settings.cache,
    anthropic_cache_ttl: settings.anthropicCacheTtl,
    notice_markdown: settings.noticeMarkdown,
    sponsored_daily_questions: settings.sponsoredDailyQuestions,
    sponsored_monthly_usd: settings.sponsoredMonthlyUsd,
    site_monthly_cap_usd: settings.siteMonthlyCapUsd,
    site_paid_model: settings.sitePaidModel,
    site_paid_max_output_tokens: settings.sitePaidMaxOutputTokens,
    updated_at: new Date().toISOString()
  }
}

export async function GET() {
  const session = await admin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const supabase = service()
  if (!supabase) return NextResponse.json({ error: 'Settings storage is not configured.' }, { status: 503 })
  const { data } = await supabase.from('chat_settings').select('*').eq('id', 1).maybeSingle()
  const settings = settingsFromRow((data as Record<string, unknown> | null) ?? null)
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const [{ data: log }, { data: usage }] = await Promise.all([
    supabase.from('chat_settings_log').select('id, email, setting, old_value, new_value, created_at').order('created_at', { ascending: false }).limit(50),
    supabase.from('chat_usage').select('created_at, user_id, provider, model, input_tokens, output_tokens, cached_tokens, outcome').gte('created_at', since).limit(5000)
  ])
  const sponsored = await sponsoredSummary(settings.siteMonthlyCapUsd).catch(() => null)
  const prices = await loadPrices().catch(() => [])
  return NextResponse.json({ settings, log: log ?? [], usage: usage ?? [], sponsored, prices })
}

export async function PUT(req: NextRequest) {
  const session = await admin()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const supabase = service()
  if (!supabase) return NextResponse.json({ error: 'Settings storage is not configured.' }, { status: 503 })
  const body = await req.json().catch(() => null)
  const currentRow = await supabase.from('chat_settings').select('*').eq('id', 1).maybeSingle()
  const previous = settingsFromRow((currentRow.data as Record<string, unknown> | null) ?? null)
  const next = sanitize(body, previous)
  if ('error' in next) return NextResponse.json({ error: next.error }, { status: 400 })
  const { error } = await supabase.from('chat_settings').upsert(rowFromSettings(next))
  if (error) return NextResponse.json({ error: 'Could not save settings. Apply the chat settings migration.' }, { status: 503 })
  const changes = diff(previous, next)
  if (changes.length) {
    await supabase.from('chat_settings_log').insert(
      changes.map(change => ({
        user_id: session.user.id,
        email: session.user.email,
        setting: change.setting,
        old_value: change.oldValue,
        new_value: change.newValue
      }))
    )
  }
  const prices = inputPrices(body)
  if (prices) {
    for (const price of prices) {
      await supabase.from('chat_model_prices').upsert({
        model: price.model,
        input_usd_per_mtok: price.inputUsdPerMtok,
        output_usd_per_mtok: price.outputUsdPerMtok,
        cache_write_5m_usd_per_mtok: price.cacheWrite5mUsdPerMtok,
        cache_write_1h_usd_per_mtok: price.cacheWrite1hUsdPerMtok,
        cache_read_usd_per_mtok: price.cacheReadUsdPerMtok
      })
    }
  }
  clearSettingsCache()
  return NextResponse.json({ settings: next })
}

function inputPrices(body: unknown) {
  if (!body || typeof body !== 'object' || !Array.isArray((body as { prices?: unknown }).prices)) return null
  return ((body as { prices: unknown[] }).prices).flatMap(item => {
    if (!item || typeof item !== 'object') return []
    const row = item as Record<string, unknown>
    if (typeof row.model !== 'string' || !/^[A-Za-z0-9._:/-]{1,80}$/.test(row.model)) return []
    const num = (value: unknown) => (typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : null)
    const input = num(row.inputUsdPerMtok)
    const output = num(row.outputUsdPerMtok)
    const write5 = num(row.cacheWrite5mUsdPerMtok)
    const write1 = num(row.cacheWrite1hUsdPerMtok)
    const read = num(row.cacheReadUsdPerMtok)
    if (input === null || output === null || write5 === null || write1 === null || read === null) return []
    return [{ model: row.model, inputUsdPerMtok: input, outputUsdPerMtok: output, cacheWrite5mUsdPerMtok: write5, cacheWrite1hUsdPerMtok: write1, cacheReadUsdPerMtok: read }]
  })
}

function sanitize(body: unknown, previous: ChatSettings): ChatSettings | { error: string } {
  if (!body || typeof body !== 'object') return { error: 'Settings were not readable.' }
  const input = body as Record<string, unknown>
  const next = { ...previous, providers: { ...previous.providers }, models: { ...previous.models }, cache: { ...previous.cache } }
  if (typeof input.paused === 'boolean') next.paused = input.paused
  if (typeof input.pausedMessage === 'string') {
    if (!input.pausedMessage.trim()) return { error: 'The paused message cannot be empty.' }
    next.pausedMessage = input.pausedMessage
  }
  if (input.providers && typeof input.providers === 'object') {
    for (const provider of CHAT_PROVIDERS) {
      const value = (input.providers as Record<string, unknown>)[provider]
      if (typeof value === 'boolean') next.providers[provider] = value
    }
  }
  if (input.models && typeof input.models === 'object') {
    for (const provider of CHAT_PROVIDERS) {
      const value = (input.models as Record<string, unknown>)[provider]
      if (typeof value !== 'string' || !value.trim()) continue
      if (!/^[A-Za-z0-9._:/-]{1,80}$/.test(value.trim())) {
        return { error: `The model id for ${provider} can use letters, numbers, and . _ : / -` }
      }
      next.models[provider] = value.trim()
    }
  }
  const numberField = (
    key: keyof ChatSettings,
    min: number,
    max: number,
    label: string
  ) => {
    if (input[key as string] === undefined) return null
    const parsed = Number(input[key as string])
    if (!Number.isFinite(parsed) || parsed < min || parsed > max) return `${label} must be between ${min} and ${max}.`
    return parsed
  }
  const checks: [keyof ChatSettings, number, number, string][] = [
    ['maxOutputTokens', 256, 32000, 'Answer length'],
    ['treatiseContextMaxChars', 2000, 200000, 'Treatise context cap'],
    ['maxMessages', 2, 200, 'Maximum messages'],
    ['maxConversationChars', 1000, 2000000, 'Maximum conversation characters'],
    ['questionsPerUserHour', 1, 1000, 'Questions per reader per hour'],
    ['questionsPerUserDay', 1, 5000, 'Questions per reader per day'],
    ['questionsPerIpDay', 1, 5000, 'Questions per IP per day']
  ]
  for (const [key, min, max, label] of checks) {
    const result = numberField(key, min, max, label)
    if (typeof result === 'string') return { error: result }
    if (typeof result === 'number') (next[key] as number) = result
  }
  if (typeof input.guestChat === 'boolean') next.guestChat = input.guestChat
  if (input.cache && typeof input.cache === 'object') {
    for (const provider of CHAT_PROVIDERS) {
      const value = (input.cache as Record<string, unknown>)[provider]
      if (typeof value === 'boolean') next.cache[provider] = value
    }
  }
  if (input.anthropicCacheTtl === '5m' || input.anthropicCacheTtl === '1h') {
    next.anthropicCacheTtl = input.anthropicCacheTtl
  }
  if (typeof input.sponsoredDailyQuestions === 'number' && input.sponsoredDailyQuestions >= 1 && input.sponsoredDailyQuestions <= 500) {
    next.sponsoredDailyQuestions = Math.round(input.sponsoredDailyQuestions)
  }
  if (typeof input.sponsoredMonthlyUsd === 'number') {
    next.sponsoredMonthlyUsd = Math.round(Math.min(50, Math.max(0, input.sponsoredMonthlyUsd)) * 100) / 100
  }
  if (typeof input.siteMonthlyCapUsd === 'number') {
    if (input.siteMonthlyCapUsd > 50) return { error: 'The site cap cannot be more than US$50.' }
    next.siteMonthlyCapUsd = Math.round(Math.max(0, input.siteMonthlyCapUsd) * 100) / 100
  }
  if (typeof input.sitePaidModel === 'string' && /^[A-Za-z0-9._:/-]{1,80}$/.test(input.sitePaidModel.trim())) {
    next.sitePaidModel = input.sitePaidModel.trim()
  }
  if (typeof input.sitePaidMaxOutputTokens === 'number') next.sitePaidMaxOutputTokens = input.sitePaidMaxOutputTokens
  if (typeof input.noticeMarkdown === 'string') {
    if (!input.noticeMarkdown.trim()) return { error: 'The notice cannot be empty.' }
    next.noticeMarkdown = input.noticeMarkdown
  }
  if (input.modelWarnings && isChatProvider(input.modelWarnings)) {
    // typed ids are stored unverified; the page shows that warning itself
  }
  return next
}

function diff(previous: ChatSettings, next: ChatSettings) {
  const changes: { setting: string; oldValue: unknown; newValue: unknown }[] = []
  const keys = Object.keys(next) as (keyof ChatSettings)[]
  for (const key of keys) {
    if (JSON.stringify(previous[key]) !== JSON.stringify(next[key])) {
      changes.push({ setting: key, oldValue: previous[key], newValue: next[key] })
    }
  }
  return changes
}
