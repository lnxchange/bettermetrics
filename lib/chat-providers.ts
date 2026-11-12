import Anthropic from '@anthropic-ai/sdk'

import { ChatProvider, SystemBlock, defaultModel } from '@/lib/chat-provider-ids'

const OPENAI_COMPAT: Record<Exclude<ChatProvider, 'anthropic'>, string> = {
  openai: 'https://api.openai.com/v1',
  google: 'https://generativelanguage.googleapis.com/v1beta/openai',
  openrouter: 'https://openrouter.ai/api/v1'
}

const OUTPUT_TOKENS = 8192

export class ProviderError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ProviderError'
    this.status = status
  }
}

export type ChatMessage = { role: 'user' | 'assistant'; content: string }

export type ChatResult = {
  text: string
  usage: Record<string, unknown>
}

function redact(text: string, apiKey: string) {
  return text.split(apiKey).join('[key]').slice(0, 300)
}

function systemText(blocks: SystemBlock[]) {
  return blocks
    .map(block => block.text.trim())
    .filter(Boolean)
    .join('\n\n')
}

export async function providerKeyAccepted(
  provider: ChatProvider,
  apiKey: string
): Promise<'ok' | 'rejected' | 'unavailable'> {
  try {
    const response =
      provider === 'anthropic'
        ? await fetch('https://api.anthropic.com/v1/models?limit=1', {
            headers: {
              'x-api-key': apiKey,
              'anthropic-version': '2023-06-01'
            },
            signal: AbortSignal.timeout(10000)
          })
        : await fetch(`${OPENAI_COMPAT[provider]}/models`, {
            headers: { Authorization: `Bearer ${apiKey}` },
            signal: AbortSignal.timeout(10000)
          })
    if (response.ok) return 'ok'
    if (response.status === 401 || response.status === 403) return 'rejected'
    return 'unavailable'
  } catch {
    return 'unavailable'
  }
}

export async function completeChat(input: {
  provider: ChatProvider
  apiKey: string
  model?: string | null
  systemBlocks: SystemBlock[]
  messages: ChatMessage[]
}): Promise<ChatResult> {
  const model = input.model && input.model.trim() ? input.model.trim() : defaultModel(input.provider)
  if (input.provider === 'anthropic') {
    return completeAnthropic(input.apiKey, model, input.systemBlocks, input.messages)
  }
  return completeOpenAICompat(
    OPENAI_COMPAT[input.provider],
    input.apiKey,
    model,
    input.systemBlocks,
    input.messages,
    input.provider
  )
}

const CACHE_KEY = 'aimtheory-chat'

type ContentPart = {
  type: 'text'
  text: string
  prompt_cache_breakpoint?: { mode: 'explicit' }
  cache_control?: { type: 'ephemeral' }
}

/** Stable blocks are marked for caching. The mode instructions stay after that boundary. */
export function systemMessageContent(blocks: SystemBlock[], provider: ChatProvider): ContentPart[] {
  return blocks
    .filter(block => block.text.trim())
    .map(block => {
      const part: ContentPart = { type: 'text', text: block.text.trim() }
      if (!block.cache_control) return part
      if (provider === 'openai' || provider === 'openrouter') {
        part.prompt_cache_breakpoint = { mode: 'explicit' }
      }
      if (provider === 'google' || provider === 'openrouter') {
        part.cache_control = { type: 'ephemeral' }
      }
      return part
    })
}

export function buildProviderMessages(
  provider: ChatProvider,
  blocks: SystemBlock[],
  messages: ChatMessage[]
) {
  const kept = blocks.filter(block => block.text.trim())
  const stable = kept.filter(block => block.cache_control)
  const dynamic = kept.filter(block => !block.cache_control)
  const system: { role: 'system'; content: ContentPart[] }[] = []
  if (stable.length) system.push({ role: 'system', content: systemMessageContent(stable, provider) })
  if (dynamic.length) {
    system.push({ role: 'system', content: systemMessageContent(dynamic, provider) })
  }
  if (!system.length && kept.length) {
    system.push({ role: 'system', content: systemMessageContent(kept, provider) })
  }
  return [...system, ...messages]
}

function cacheFields(provider: ChatProvider): Record<string, unknown> {
  if (provider === 'openai') {
    return {
      prompt_cache_key: CACHE_KEY,
      prompt_cache_options: { mode: 'explicit', ttl: '30m' }
    }
  }
  if (provider === 'openrouter') return { prompt_cache_key: CACHE_KEY }
  return {}
}

export function usageFromChunk(usage: {
  prompt_tokens?: number
  completion_tokens?: number
  prompt_tokens_details?: { cached_tokens?: number; cache_write_tokens?: number }
}): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  if (typeof usage.prompt_tokens === 'number') result.input_tokens = usage.prompt_tokens
  if (typeof usage.completion_tokens === 'number') result.output_tokens = usage.completion_tokens
  const details = usage.prompt_tokens_details
  if (typeof details?.cached_tokens === 'number') result.cached_tokens = details.cached_tokens
  if (typeof details?.cache_write_tokens === 'number') {
    result.cache_write_tokens = details.cache_write_tokens
  }
  return result
}

async function completeAnthropic(
  apiKey: string,
  model: string,
  systemBlocks: SystemBlock[],
  messages: ChatMessage[]
): Promise<ChatResult> {
  const anthropic = new Anthropic({ apiKey })
  let text = ''
  let usage: Record<string, unknown> = {}
  try {
    const stream = await anthropic.messages.stream({
      model,
      max_tokens: OUTPUT_TOKENS,
      system: systemBlocks,
      messages
    })
    for await (const chunk of stream) {
      if (chunk.type === 'message_start') {
        usage = { ...usage, ...chunk.message.usage }
      } else if (chunk.type === 'message_delta') {
        usage = { ...usage, output_tokens: chunk.usage.output_tokens }
      }
      if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
        text += chunk.delta.text
      }
    }
  } catch (error) {
    if (!text) {
      const message = error instanceof Error ? error.message : 'Request failed'
      const status =
        typeof error === 'object' && error && 'status' in error && typeof error.status === 'number'
          ? error.status
          : 502
      throw new ProviderError(status, redact(message, apiKey))
    }
  }
  if (!text) throw new ProviderError(502, 'The model returned an empty answer')
  return { text, usage }
}

async function completeOpenAICompat(
  baseUrl: string,
  apiKey: string,
  model: string,
  blocks: SystemBlock[],
  messages: ChatMessage[],
  provider: ChatProvider
): Promise<ChatResult> {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  }
  if (provider === 'openrouter') {
    headers['HTTP-Referer'] = 'https://aimtheory.org'
    headers['X-Title'] = 'AIM Framework'
  }
  const tokenField = baseUrl.includes('api.openai.com') ? 'max_completion_tokens' : 'max_tokens'
  const cachedBody = {
    model,
    [tokenField]: OUTPUT_TOKENS,
    stream: true,
    stream_options: { include_usage: true },
    ...cacheFields(provider),
    messages: buildProviderMessages(provider, blocks, messages)
  }
  const plainBody = {
    model,
    [tokenField]: OUTPUT_TOKENS,
    stream: true,
    stream_options: { include_usage: true },
    ...(provider === 'google' ? {} : { prompt_cache_key: CACHE_KEY }),
    messages: [{ role: 'system', content: systemText(blocks) }, ...messages]
  }

  let response = await postChat(baseUrl, headers, cachedBody, apiKey)
  if (response.status === 400) {
    const detail = await response.text().catch(() => '')
    if (/prompt_cache|cache_control|unknown parameter|unrecognized|extra inputs|additional properties/i.test(detail)) {
      response = await postChat(baseUrl, headers, plainBody, apiKey)
    } else {
      throw new ProviderError(400, redact(detail || response.statusText, apiKey))
    }
  }
  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    throw new ProviderError(response.status, redact(detail || response.statusText, apiKey))
  }

  let text = ''
  let usage: Record<string, unknown> = {}
  await readSse(response, chunk => {
    text += openAIDeltaText(chunk)
    if (chunk?.usage && typeof chunk.usage === 'object') usage = usageFromChunk(chunk.usage)
  })
  if (!text) throw new ProviderError(502, 'The model returned an empty answer')
  return { text, usage }
}

async function postChat(
  baseUrl: string,
  headers: Record<string, string>,
  body: unknown,
  apiKey: string
) {
  try {
    return await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(280000)
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Request failed'
    throw new ProviderError(502, redact(message, apiKey))
  }
}

export function openAIDeltaText(chunk: {
  choices?: { delta?: { content?: unknown } }[]
}): string {
  const content = chunk.choices?.[0]?.delta?.content
  if (typeof content === 'string') return content
  if (!Array.isArray(content)) return ''
  return content
    .map(part => (part && typeof part === 'object' && 'text' in part && typeof part.text === 'string' ? part.text : ''))
    .join('')
}

async function readSse(response: Response, onData: (chunk: any) => void) {
  const reader = response.body?.getReader()
  if (!reader) throw new ProviderError(502, 'The provider returned an empty response')
  const decoder = new TextDecoder()
  let buffer = ''
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed.startsWith('data:')) continue
      const data = trimmed.slice(5).trim()
      if (!data || data === '[DONE]') continue
      try {
        onData(JSON.parse(data))
      } catch {
        // Keep-alive and non-JSON lines are ignored.
      }
    }
  }
}
