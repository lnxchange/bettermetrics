export const CHAT_PROVIDERS = ['anthropic', 'openai', 'google', 'openrouter'] as const

export type ChatProvider = (typeof CHAT_PROVIDERS)[number]

export type SystemBlock = {
  type: 'text'
  text: string
  cache_control?: { type: 'ephemeral' }
}

export const PROVIDER_INFO: Record<
  ChatProvider,
  { label: string; placeholder: string; defaultModel: string }
> = {
  anthropic: {
    label: 'Anthropic',
    placeholder: 'sk-ant-...',
    defaultModel: 'claude-opus-5-5'
  },
  openai: {
    label: 'OpenAI',
    placeholder: 'sk-...',
    defaultModel: 'gpt-5.4'
  },
  google: {
    label: 'Google Gemini',
    placeholder: 'AIza...',
    defaultModel: 'gemini-3.1-pro-preview'
  },
  openrouter: {
    label: 'OpenRouter',
    placeholder: 'sk-or-...',
    defaultModel: 'anthropic/claude-opus-5-5'
  }
}

export function isChatProvider(value: unknown): value is ChatProvider {
  return typeof value === 'string' && (CHAT_PROVIDERS as readonly string[]).includes(value)
}

/** A model id a reader may store. It is sent as a field, never built into a URL. */
export function isModelId(value: string): boolean {
  return /^[A-Za-z0-9._:/-]{1,80}$/.test(value)
}

export function detectProvider(apiKey: string): ChatProvider | null {
  const key = apiKey.trim()
  if (key.startsWith('sk-ant-')) return 'anthropic'
  if (key.startsWith('sk-or-')) return 'openrouter'
  if (key.startsWith('AIza')) return 'google'
  if (key.startsWith('sk-')) return 'openai'
  return null
}

export function keyMatchesProvider(provider: ChatProvider, apiKey: string): boolean {
  const key = apiKey.trim()
  if (key.length < 20 || key.length > 300 || /\s/.test(key)) return false
  if (provider === 'google') return key.startsWith('AIza') && key.length >= 30
  return detectProvider(key) === provider && key.length >= (provider === 'anthropic' ? 40 : 20)
}

export function defaultModel(provider: ChatProvider): string {
  const fromEnv: Record<ChatProvider, string | undefined> = {
    anthropic: process.env.CHAT_MODEL,
    openai: process.env.OPENAI_CHAT_MODEL,
    google: process.env.GOOGLE_CHAT_MODEL,
    openrouter: process.env.OPENROUTER_CHAT_MODEL
  }
  const configured = fromEnv[provider]?.trim()
  if (configured && isModelId(configured)) return configured
  return PROVIDER_INFO[provider].defaultModel
}
