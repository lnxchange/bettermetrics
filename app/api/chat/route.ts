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
2. Explain concepts comprehensively for both academics and general audiences
3. Focus on core concepts and fundamental principles rather than edge cases
4. Provide thorough explanations that build understanding step by step
5. Emphasize what needs testing vs what's established neuroscience
6. Acknowledge uncertainty and invite critical evaluation
7. Direct users to testable predictions and research opportunities
8. Reference the latest research documentation when available

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

// TODO: Future Enhancement - Upgrade to GPT-4 or O1 Reasoning Model
// The current implementation uses GPT-3.5-turbo which has limitations in:
// 1. Complex logical reasoning about how AIM relates to external information
// 2. Multi-step inference required to apply AIM framework to novel situations
// 3. Synthesizing AIM concepts with broader research literature
//
// When available, upgrade to a reasoning-capable model (GPT-4, O1, etc.) by:
// - Changing model parameter to 'gpt-4' or 'o1-preview'
// - Adjusting temperature and reasoning parameters
// - Testing thoroughly with complex AIM application questions
//
// This will significantly improve the chatbot's ability to:
// - Apply AIM framework principles to analyze complex scenarios
// - Integrate AIM with other research domains logically
// - Provide more nuanced interpretations of the framework

export async function POST(req: Request) {
  try {
    const cookieStore = cookies()
    
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.log('Supabase not configured - returning service unavailable')
      return new Response('Service unavailable - Supabase not configured', { status: 503 })
    }
    
    // Create Supabase client with error handling
    let supabase: ReturnType<typeof createRouteHandlerClient<Database>>
    try {
      supabase = createRouteHandlerClient<Database>({
        cookies: () => cookieStore
      })
    } catch (error) {
      console.error('Supabase client creation error:', error)
      return new Response('Service unavailable', { status: 503 })
    }
    
    const json = await req.json()
    const { messages, previewToken } = json

    // Get user session - REQUIRED for chat
    const session = await auth({ cookieStore })
    if (!session?.user?.id) {
      return new Response('Unauthorized', { status: 401 })
    }
    const userId = session.user.id

    if (previewToken) {
      configuration.apiKey = previewToken
    }

    // Get the latest user message for RAG context
    const userQuery = messages[messages.length - 1]?.content || ''

    // Search for relevant context using RAG
    let ragContext = ''
    let hasRagResults = false
    try {
      const vectorSearch = new VectorSearch()
      const results = await vectorSearch.searchSimilarDocuments(userQuery, 5, 'rag', 0.3)
      hasRagResults = results.length > 0
      
      if (hasRagResults) {
        const context = results
          .map((result, index) => `[Context ${index + 1}]: ${result.chunk_text}`)
          .join('\n\n')
        ragContext = `Relevant context from AIM Framework research documents:\n\n${context}\n\nIMPORTANT: Provide comprehensive explanations of core concepts rather than focusing on edge cases. Base your answer primarily on the context above, but ensure you explain fundamental principles thoroughly. If the context doesn't contain enough information to fully answer the question, acknowledge this and supplement with general knowledge while clearly distinguishing between what comes from the AIM research vs general understanding.`
      } else {
        ragContext = `\n\nNOTE: No specific AIM Framework research context was found for this query. You should answer based on general knowledge about motivation, psychology, and neuroscience, while clearly stating that this is not from the AIM Framework documentation specifically. If appropriate, suggest how this topic might relate to the AIM Framework's three sources of motivation.`
      }
    } catch (error) {
      console.error('RAG search error:', error)
      // Continue without context if RAG fails
      ragContext = '\n\nNOTE: Unable to search AIM Framework documents. Please answer based on general knowledge.'
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
        try {
          await supabase.from('chats').upsert({ id, payload }).throwOnError()
        } catch (error) {
          console.error('Error saving chat to database:', error)
          // Continue even if database save fails
        }
      }
    })

    return new StreamingTextResponse(stream)
  } catch (error) {
    console.error('Chat API error:', error)
    return new Response('Internal server error', { status: 500 })
  }
}
