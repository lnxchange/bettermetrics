import OpenAI from 'openai'

import { GenerateInput, GenerateResult, LlmError, classifyStatus } from '@/lib/llm/types'

export async function generateOpenRouter(input: GenerateInput): Promise<GenerateResult> {
  const client = new OpenAI({
    apiKey: input.apiKey,
    baseURL: 'https://openrouter.ai/api/v1',
    defaultHeaders: {
      'HTTP-Referer': 'https://aimtheory.org',
      'X-Title': 'AIM Framework'
    }
  })
  const claude = /claude/i.test(input.model)
  const cache = input.cache && claude ? { cache_control: { type: 'ephemeral' as const } } : undefined
  const systemContent = claude
    ? [
        { type: 'text' as const, text: input.systemPrompt, ...cache },
        ...(input.treatiseContext.trim()
          ? [{ type: 'text' as const, text: input.treatiseContext.trim(), ...cache }]
          : [])
      ]
    : [input.systemPrompt, input.treatiseContext.trim()].filter(Boolean).join('\n\n')
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: systemContent },
    ...(input.modeInstructions.trim()
      ? [{ role: 'system' as const, content: input.modeInstructions.trim() }]
      : []),
    ...input.messages.map(message => ({ role: message.role, content: message.content }))
  ]
  try {
    const stream = await client.chat.completions.create({
      model: input.model,
      messages,
      max_tokens: input.maxTokens,
      stream: true,
      stream_options: { include_usage: true }
    })
    let text = ''
    let inputTokens = 0
    let outputTokens = 0
    let cachedTokens = 0
    for await (const chunk of stream) {
      text += chunk.choices?.[0]?.delta?.content || ''
      const usage = chunk.usage
      if (usage) {
        inputTokens = usage.prompt_tokens ?? inputTokens
        outputTokens = usage.completion_tokens ?? outputTokens
        cachedTokens = usage.prompt_tokens_details?.cached_tokens ?? cachedTokens
      }
    }
    if (!text) throw new LlmError('unavailable')
    return { text, inputTokens, outputTokens, cachedTokens }
  } catch (error) {
    if (error instanceof LlmError) throw error
    const status = error instanceof OpenAI.APIError ? error.status ?? 502 : 502
    const detail = error instanceof Error ? error.message : ''
    throw new LlmError(classifyStatus(status, detail))
  }
}
