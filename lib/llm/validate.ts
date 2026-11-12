import Anthropic from '@anthropic-ai/sdk'
import { GoogleGenAI } from '@google/genai'
import OpenAI from 'openai'

import { ChatProvider, PROVIDER_INFO } from '@/lib/chat-provider-ids'
import { LlmError, classifyStatus, readerMessage } from '@/lib/llm/types'

export async function validateProviderKey(
  provider: ChatProvider,
  apiKey: string
): Promise<{ ok: true } | { ok: false; message: string }> {
  try {
    if (provider === 'anthropic') {
      const client = new Anthropic({ apiKey })
      await client.models.list({ limit: 1 })
    } else if (provider === 'openai') {
      const client = new OpenAI({ apiKey })
      await client.models.list()
    } else if (provider === 'google') {
      const ai = new GoogleGenAI({ apiKey })
      const pager = await ai.models.list()
      for await (const _model of pager) {
        break
      }
    } else {
      const response = await fetch('https://openrouter.ai/api/v1/key', {
        headers: { Authorization: `Bearer ${apiKey}` },
        signal: AbortSignal.timeout(10000)
      })
      if (!response.ok) {
        const detail = await response.text().catch(() => '')
        throw new LlmError(classifyStatus(response.status, detail))
      }
    }
    return { ok: true }
  } catch (error) {
    if (error instanceof LlmError) return { ok: false, message: readerMessage(error.code) }
    const status = error instanceof OpenAI.APIError ? error.status ?? 502 : 502
    const detail = error instanceof Error ? error.message : ''
    return {
      ok: false,
      message: `${PROVIDER_INFO[provider].label}: ${readerMessage(classifyStatus(status, detail))}`
    }
  }
}
