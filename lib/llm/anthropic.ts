import Anthropic from '@anthropic-ai/sdk'

import { GenerateInput, GenerateResult, LlmError, classifyStatus } from '@/lib/llm/types'

export async function generateAnthropic(input: GenerateInput): Promise<GenerateResult> {
  const ttl = input.anthropicCacheTtl === '1h' ? { type: 'ephemeral' as const, ttl: '1h' as const } : { type: 'ephemeral' as const }
  const mark = input.cache ? ttl : undefined
  const system: Anthropic.TextBlockParam[] = [
    { type: 'text', text: input.systemPrompt, ...(mark ? { cache_control: mark } : {}) }
  ]
  if (input.treatiseContext.trim()) {
    system.push({
      type: 'text',
      text: input.treatiseContext.trim(),
      ...(mark ? { cache_control: mark } : {})
    })
  }
  if (input.modeInstructions.trim()) {
    system.push({ type: 'text', text: input.modeInstructions.trim() })
  }

  const prior = input.messages.slice(0, -1)
  const latest = input.messages[input.messages.length - 1]
  const messages: Anthropic.MessageParam[] = prior.map((message, index) => {
    const cacheLast = input.cache && index === prior.length - 1
    if (!cacheLast) return { role: message.role, content: message.content }
    return {
      role: message.role,
      content: [{ type: 'text', text: message.content, cache_control: ttl }]
    }
  })
  if (latest) messages.push({ role: latest.role, content: latest.content })

  const anthropic = new Anthropic({ apiKey: input.apiKey })
  try {
    const stream = await anthropic.messages.stream({
      model: input.model,
      max_tokens: input.maxTokens,
      system,
      messages
    })
    let text = ''
    let inputTokens = 0
    let outputTokens = 0
    let cachedTokens = 0
    for await (const chunk of stream) {
      if (chunk.type === 'message_start') {
        const usage = chunk.message.usage
        inputTokens = usage.input_tokens
        cachedTokens = usage.cache_read_input_tokens ?? 0
      } else if (chunk.type === 'message_delta') {
        outputTokens = chunk.usage.output_tokens
      }
      if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
        text += chunk.delta.text
      }
    }
    if (!text) throw new LlmError('unavailable')
    return { text, inputTokens, outputTokens, cachedTokens }
  } catch (error) {
    if (error instanceof LlmError) throw error
    const status = typeof error === 'object' && error && 'status' in error && typeof error.status === 'number' ? error.status : 502
    const detail = error instanceof Error ? error.message : ''
    throw new LlmError(classifyStatus(status, detail))
  }
}
