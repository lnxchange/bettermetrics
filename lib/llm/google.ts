import { GoogleGenAI } from '@google/genai'

import { GenerateInput, GenerateResult, LlmError, classifyStatus } from '@/lib/llm/types'

export async function generateGoogle(input: GenerateInput): Promise<GenerateResult> {
  const ai = new GoogleGenAI({ apiKey: input.apiKey })
  const systemInstruction = [input.systemPrompt, input.treatiseContext.trim(), input.modeInstructions.trim()]
    .filter(Boolean)
    .join('\n\n')
  try {
    const response = await ai.models.generateContent({
      model: input.model,
      contents: input.messages.map(message => ({
        role: message.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: message.content }]
      })),
      config: {
        systemInstruction,
        maxOutputTokens: input.maxTokens
      }
    })
    const text = response.text || ''
    if (!text) throw new LlmError('unavailable')
    const usage = response.usageMetadata
    return {
      text,
      inputTokens: usage?.promptTokenCount ?? 0,
      outputTokens: usage?.candidatesTokenCount ?? 0,
      cachedTokens: usage?.cachedContentTokenCount ?? 0
    }
  } catch (error) {
    if (error instanceof LlmError) throw error
    const status = typeof error === 'object' && error && 'status' in error && typeof error.status === 'number' ? error.status : 502
    const detail = error instanceof Error ? error.message : ''
    throw new LlmError(classifyStatus(status, detail))
  }
}
