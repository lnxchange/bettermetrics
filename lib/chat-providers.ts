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
    systemText(input.systemBlocks),
    input.messages,
    input.provider === 'openrouter'
  )
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
  system: string,
  messages: ChatMessage[],
  openRouter: boolean
): Promise<ChatResult> {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  }
  if (openRouter) {
    headers['HTTP-Referer'] = 'https://aimtheory.org'
    headers['X-Title'] = 'AIM Framework'
  }
  const tokenField = baseUrl.includes('api.openai.com') ? 'max_completion_tokens' : 'max_tokens'
  let response: Response
  try {
    response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model,
        [tokenField]: OUTPUT_TOKENS,
        stream: true,
        stream_options: { include_usage: true },
        messages: [{ role: 'system', content: system }, ...messages]
      }),
      signal: AbortSignal.timeout(280000)
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Request failed'
    throw new ProviderError(502, redact(message, apiKey))
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    throw new ProviderError(response.status, redact(detail || response.statusText, apiKey))
  }

  let text = ''
  let usage: Record<string, unknown> = {}
  await readSse(response, chunk => {
    text += openAIDeltaText(chunk)
    if (chunk?.usage && typeof chunk.usage === 'object') {
      usage = {
        input_tokens: chunk.usage.prompt_tokens,
        output_tokens: chunk.usage.completion_tokens
      }
    }
  })
  if (!text) throw new ProviderError(502, 'The model returned an empty answer')
  return { text, usage }
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
