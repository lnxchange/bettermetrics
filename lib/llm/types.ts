import { ChatProvider } from '@/lib/chat-provider-ids'

export type LlmMessage = { role: 'user' | 'assistant'; content: string }

export type GenerateInput = {
  apiKey: string
  model: string
  systemPrompt: string
  treatiseContext: string
  modeInstructions: string
  messages: LlmMessage[]
  maxTokens: number
  cache: boolean
  anthropicCacheTtl: '5m' | '1h'
  /** OpenAI routes a conversation's repeated prefix with this key. */
  promptCacheKey?: string
}

export type GenerateResult = {
  text: string
  inputTokens: number
  outputTokens: number
  cachedTokens: number
  cacheWriteTokens?: number
}

export type LlmFailure =
  | 'invalid_key'
  | 'quota'
  | 'rate_limited'
  | 'model_unavailable'
  | 'context_too_long'
  | 'unavailable'

export class LlmError extends Error {
  code: LlmFailure

  constructor(code: LlmFailure) {
    super(code)
    this.name = 'LlmError'
    this.code = code
  }
}

export function readerMessage(code: LlmFailure): string {
  switch (code) {
    case 'invalid_key':
      return 'That API key was rejected. Save a new one on your profile.'
    case 'quota':
      return 'That provider says the key is out of credit or quota.'
    case 'rate_limited':
      return 'That provider is rate limiting this key. Wait a moment and try again.'
    case 'model_unavailable':
      return 'That model is not available on this key.'
    case 'context_too_long':
      return 'This conversation is too long for the model. Start a new chat.'
    default:
      return 'The model could not answer. Try again in a moment.'
  }
}

export function classifyStatus(status: number, detail: string): LlmFailure {
  const text = detail.toLowerCase()
  if (status === 401 || /invalid api key|incorrect api key|api key not valid/.test(text)) {
    return 'invalid_key'
  }
  if (status === 429 || /rate limit/.test(text)) return 'rate_limited'
  if (
    status === 402 ||
    /credit|quota|billing|insufficient/.test(text)
  ) {
    return 'quota'
  }
  if (/context length|too long|maximum context|token limit/.test(text)) return 'context_too_long'
  if (status === 404 || /model/.test(text) && /not found|does not exist|unavailable/.test(text)) {
    return 'model_unavailable'
  }
  if (status === 403) return 'invalid_key'
  return 'unavailable'
}

export type { ChatProvider }
