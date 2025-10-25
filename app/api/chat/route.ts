import 'server-only'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { Configuration, OpenAIApi } from 'openai-edge'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/lib/db_types'

import { auth } from '@/auth'
import { nanoid } from '@/lib/utils'

export const runtime = 'edge'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration)

const AIM_SYSTEM_PROMPT = `You are an AI assistant specializing in the AIM Motivation Framework developed by Yule Guttenbeil. Your role is to:

1. Answer questions about the AIM Framework accurately using the knowledge base
2. Explain concepts clearly for both academics and general audiences
3. Cite source documents when providing information
4. Acknowledge uncertainty when questions fall outside the knowledge base
5. Suggest relevant framework applications across disciplines
6. Direct users to appropriate pages for deeper information
7. Maintain a professional, academic tone while remaining accessible

Key principles:
- Always distinguish between Appetites (A), Intrinsic Motivation (I), and Mimetic Desire (M)
- Emphasize source-based classification
- Note when questions involve multiple sources (mixed episodes)
- Connect concepts to neuroscientific grounding
- Highlight practical applications and testable predictions

When you don't know: "I don't have information about that in the AIM Framework knowledge base. You may want to contact the researcher directly via the Contact page or explore the Research Areas section for related topics."`

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

  // Add AIM system prompt to messages
  const systemMessage = { role: 'system', content: AIM_SYSTEM_PROMPT }
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
