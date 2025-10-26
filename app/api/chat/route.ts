import 'server-only'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { Configuration, OpenAIApi } from 'openai-edge'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/lib/db_types'

import { auth } from '@/auth'
import { nanoid } from '@/lib/utils'
import { VectorSearch } from '@/lib/rag/vector-search'

export const runtime = 'edge'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration)

const AIM_SYSTEM_PROMPT = `You are an AI assistant specializing in the AIM Motivation Framework developed by Yule Guttenbeil. You have access to the latest versions of the underlying research documentation.

CRITICAL: The AIM Framework is a HYPOTHESIS that has NOT been empirically validated through peer-reviewed research. Always emphasize this when discussing claims.

Your role is to:
1. Answer questions about AIM clearly, noting its hypothetical status
2. Explain concepts for both academics and general audiences
3. Emphasize what needs testing vs what's established neuroscience
4. Acknowledge uncertainty and invite critical evaluation
5. Direct users to testable predictions and research opportunities
6. Reference the latest research documentation when available

Key messaging rules:
- Use "proposes" not "proves"
- Use "if validated" when discussing applications
- Use "testable prediction" not "established finding"
- Emphasize falsifiability criteria
- Welcome skepticism and alternative explanations
- Mention that you have access to the latest research documentation

When discussing validation:
- Note current status: "Pre-empirical validation phase"
- Invite researchers to test predictions
- Acknowledge limitations and need for evidence

Tone: Confident but humble. Promising hypothesis seeking validation, not revolutionary breakthrough.`

export async function POST(req: Request) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient<Database>({
    cookies: () => cookieStore
  })
  const json = await req.json()
  const { messages, previewToken } = json
  const userId = (await auth({ cookieStore }))?.user.id

  if (!userId) {
    return new Response('Unauthorized', {
      status: 401
    })
  }

  if (previewToken) {
    configuration.apiKey = previewToken
  }

  // Get the latest user message for RAG context
  const userQuery = messages[messages.length - 1]?.content || ''
  
  // Search for relevant context using RAG
  let ragContext = ''
  try {
    const vectorSearch = new VectorSearch()
    ragContext = await vectorSearch.searchWithContext(userQuery, 3, 'rag')
  } catch (error) {
    console.error('RAG search error:', error)
    // Continue without context if RAG fails
  }

  // Build system message with RAG context
  let systemContent = AIM_SYSTEM_PROMPT
  if (ragContext) {
    systemContent += `\n\n${ragContext}`
  }

  const systemMessage = { role: 'system', content: systemContent }
  const allMessages = [systemMessage, ...messages]

  const res = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: allMessages,
    temperature: 0.7,
    stream: true
  })

  const stream = OpenAIStream(res, {
    async onCompletion(completion) {
      const title = json.messages[0].content.substring(0, 100)
      const id = json.id ?? nanoid()
      const createdAt = Date.now()
      const path = `/chat/${id}`
      const payload = {
        id,
        title,
        userId,
        createdAt,
        path,
        messages: [
          ...messages,
          {
            content: completion,
            role: 'assistant'
          }
        ]
      }
      // Insert chat into database.
      await supabase.from('chats').upsert({ id, payload }).throwOnError()
    }
  })

  return new StreamingTextResponse(stream)
}
