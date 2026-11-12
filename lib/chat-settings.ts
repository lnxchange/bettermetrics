import 'server-only'

import { chatStore } from '@/lib/chat-store'
import { BYOK_NOTICE, PAUSED_MESSAGE } from '@/lib/chat-notice'
import { ChatProvider, CHAT_PROVIDERS, isChatProvider } from '@/lib/chat-provider-ids'

export { PAUSED_MESSAGE }

export type ChatSettings = {
  paused: boolean
  pausedMessage: string
  providers: Record<ChatProvider, boolean>
  models: Record<ChatProvider, string>
  maxOutputTokens: number
  treatiseContextMaxChars: number
  maxMessages: number
  maxConversationChars: number
  questionsPerUserHour: number
  questionsPerUserDay: number
  questionsPerIpDay: number
  guestChat: boolean
  guestDailyPerIp: number
  guestDailyGlobal: number
  cache: Record<ChatProvider, boolean>
  anthropicCacheTtl: '5m' | '1h'
  noticeMarkdown: string
}

const MODEL_DEFAULTS: Record<ChatProvider, string> = {
  anthropic: 'claude-opus-5-5',
  openai: 'gpt-5.4',
  google: 'gemini-3.1-pro-preview',
  openrouter: 'anthropic/claude-opus-5-5'
}

function envModel(provider: ChatProvider): string {
  const fromEnv: Record<ChatProvider, string | undefined> = {
    anthropic: process.env.CHAT_MODEL_ANTHROPIC || process.env.CHAT_MODEL,
    openai: process.env.CHAT_MODEL_OPENAI,
    google: process.env.CHAT_MODEL_GOOGLE,
    openrouter: process.env.CHAT_MODEL_OPENROUTER
  }
  const value = fromEnv[provider]?.trim()
  return value || MODEL_DEFAULTS[provider]
}

export function defaultChatSettings(): ChatSettings {
  return {
    paused: false,
    pausedMessage: PAUSED_MESSAGE,
    providers: { anthropic: true, openai: true, google: true, openrouter: true },
    models: {
      anthropic: envModel('anthropic'),
      openai: envModel('openai'),
      google: envModel('google'),
      openrouter: envModel('openrouter')
    },
    maxOutputTokens: 8192,
    treatiseContextMaxChars: Number(process.env.TREATISE_CONTEXT_MAX_CHARS) || 60_000,
    maxMessages: 60,
    maxConversationChars: 400_000,
    questionsPerUserHour: 30,
    questionsPerUserDay: 100,
    questionsPerIpDay: 50,
    guestChat: false,
    guestDailyPerIp: 5,
    guestDailyGlobal: 100,
    cache: { anthropic: true, openai: true, google: true, openrouter: true },
    anthropicCacheTtl: '5m',
    noticeMarkdown: BYOK_NOTICE
  }
}

let memory: { at: number; settings: ChatSettings } | null = null
let lastPurge = 0

function service() {
  return chatStore()
}

function bool(value: unknown, fallback: boolean) {
  return typeof value === 'boolean' ? value : fallback
}

function int(value: unknown, fallback: number, min: number, max: number) {
  const parsed = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(parsed)) return fallback
  return Math.min(max, Math.max(min, Math.round(parsed)))
}

export function settingsFromRow(row: Record<string, unknown> | null): ChatSettings {
  const base = defaultChatSettings()
  if (!row) return base
  const providers = { ...base.providers }
  const models = { ...base.models }
  const cache = { ...base.cache }
  if (row.providers && typeof row.providers === 'object') {
    for (const provider of CHAT_PROVIDERS) {
      const value = (row.providers as Record<string, unknown>)[provider]
      if (typeof value === 'boolean') providers[provider] = value
    }
  }
  if (row.models && typeof row.models === 'object') {
    for (const provider of CHAT_PROVIDERS) {
      const value = (row.models as Record<string, unknown>)[provider]
      if (typeof value === 'string' && value.trim()) models[provider] = value.trim()
    }
  }
  if (row.cache && typeof row.cache === 'object') {
    for (const provider of CHAT_PROVIDERS) {
      const value = (row.cache as Record<string, unknown>)[provider]
      if (typeof value === 'boolean') cache[provider] = value
    }
  }
  return {
    paused: bool(row.paused, base.paused),
    pausedMessage: typeof row.paused_message === 'string' && row.paused_message.trim() ? row.paused_message : base.pausedMessage,
    providers,
    models,
    maxOutputTokens: int(row.max_output_tokens, base.maxOutputTokens, 256, 32000),
    treatiseContextMaxChars: int(row.treatise_context_max_chars, base.treatiseContextMaxChars, 2000, 200000),
    maxMessages: int(row.max_messages, base.maxMessages, 2, 200),
    maxConversationChars: int(row.max_conversation_chars, base.maxConversationChars, 1000, 2_000_000),
    questionsPerUserHour: int(row.questions_per_user_hour, base.questionsPerUserHour, 1, 1000),
    questionsPerUserDay: int(row.questions_per_user_day, base.questionsPerUserDay, 1, 5000),
    questionsPerIpDay: int(row.questions_per_ip_day, base.questionsPerIpDay, 1, 5000),
    guestChat: bool(row.guest_chat, false),
    guestDailyPerIp: int(row.guest_daily_per_ip, base.guestDailyPerIp, 0, 1000),
    guestDailyGlobal: int(row.guest_daily_global, base.guestDailyGlobal, 0, 100000),
    cache,
    anthropicCacheTtl: row.anthropic_cache_ttl === '1h' ? '1h' : '5m',
    noticeMarkdown: typeof row.notice_markdown === 'string' && row.notice_markdown.trim() ? row.notice_markdown : base.noticeMarkdown
  }
}

export async function loadChatSettings(): Promise<ChatSettings> {
  if (memory && Date.now() - memory.at < 30_000) return memory.settings
  const supabase = service()
  if (!supabase) return defaultChatSettings()
  const { data, error } = await supabase.from('chat_settings').select('*').eq('id', 1).maybeSingle()
  if (error) {
    console.error('Chat settings could not be read')
    return defaultChatSettings()
  }
  const settings = settingsFromRow(data as Record<string, unknown> | null)
  memory = { at: Date.now(), settings }
  return settings
}

export function clearSettingsCache() {
  memory = null
}

export type UsageEvent = {
  userId: string | null
  provider: string | null
  model: string | null
  inputTokens: number
  outputTokens: number
  cachedTokens: number
  contextChars: number
  outcome: string
  ipHash: string | null
}

export async function recordChatUsage(event: UsageEvent) {
  const supabase = service()
  if (!supabase) return
  if (Date.now() - lastPurge > 24 * 60 * 60 * 1000) {
    lastPurge = Date.now()
    await supabase
      .from('chat_usage')
      .delete()
      .lt('created_at', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString())
  }
  await supabase.from('chat_usage').insert({
    user_id: event.userId,
    provider: event.provider,
    model: event.model,
    input_tokens: event.inputTokens,
    output_tokens: event.outputTokens,
    cached_tokens: event.cachedTokens,
    context_chars: event.contextChars,
    outcome: event.outcome,
    ip_hash: event.ipHash
  })
}

export async function questionAllowed(userId: string, ipHash: string, settings: ChatSettings) {
  const supabase = service()
  if (!supabase) return { allowed: true as const }
  const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const [hour, day, ip] = await Promise.all([
    supabase.from('chat_usage').select('id', { count: 'exact', head: true }).eq('user_id', userId).eq('outcome', 'answered').gte('created_at', hourAgo),
    supabase.from('chat_usage').select('id', { count: 'exact', head: true }).eq('user_id', userId).eq('outcome', 'answered').gte('created_at', dayAgo),
    supabase.from('chat_usage').select('id', { count: 'exact', head: true }).eq('ip_hash', ipHash).eq('outcome', 'answered').gte('created_at', dayAgo)
  ])
  if ((hour.count ?? 0) >= settings.questionsPerUserHour) return { allowed: false as const, reason: 'hour' }
  if ((day.count ?? 0) >= settings.questionsPerUserDay) return { allowed: false as const, reason: 'day' }
  if ((ip.count ?? 0) >= settings.questionsPerIpDay) return { allowed: false as const, reason: 'ip' }
  return { allowed: true as const }
}

export function isProvider(value: unknown): value is ChatProvider {
  return isChatProvider(value)
}
