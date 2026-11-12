import { ChatProvider } from '@/lib/chat-provider-ids'
import { generateAnthropic } from '@/lib/llm/anthropic'
import { generateGoogle } from '@/lib/llm/google'
import { generateOpenAI } from '@/lib/llm/openai'
import { generateOpenRouter } from '@/lib/llm/openrouter'
import { GenerateInput, GenerateResult } from '@/lib/llm/types'

export async function generate(provider: ChatProvider, input: GenerateInput): Promise<GenerateResult> {
  switch (provider) {
    case 'anthropic':
      return generateAnthropic(input)
    case 'openai':
      return generateOpenAI(input)
    case 'google':
      return generateGoogle(input)
    case 'openrouter':
      return generateOpenRouter(input)
  }
}

export { LlmError, readerMessage } from '@/lib/llm/types'
export type { GenerateInput, GenerateResult } from '@/lib/llm/types'
