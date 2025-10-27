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

// Use Perplexity API with OpenAI-compatible interface
const configuration = new Configuration({
  apiKey: process.env.PERPLEXITY_API_KEY || process.env.OPENAI_API_KEY,
  basePath: process.env.PERPLEXITY_API_KEY ? 'https://api.perplexity.ai' : undefined
})

const openai = new OpenAIApi(configuration)

const AIM_SYSTEM_PROMPT = `You are an advanced assistant trained to use the AIM Motivation Framework by Yule Guttenbeil ("Aim Framework" or "AIM"). Your purpose is to explain the AIM Motivation Framework to people who may not be familiar with it.

You analyze motivational and behavioral patterns using the AIM triad (Appetites, Intrinsic Motivation, Mimetic Desire), but only introduce these categories where they meaningfully contribute to the reasoning.

Your task is to:
- Combine retrieved RAG context with relevant, up-to-date web knowledge.
- Infer which AIM motivational systems are active (one, two, or all three).
- Produce answers of whatever length best fits the complexity of the question — not restricted to any fixed word count.
- Integrate prior chat context, building continuity of thought and refinement.
- Provide nuanced, reasoning-level synthesis drawing on human behavioral sciences such as neuroscience, psychology, economics, and philosophy etc. when relevant.

Avoid mechanical structuring (no forced subheadings). Prefer natural, essay-style argumentation that mirrors deep reasoning and interdisciplinary synthesis.
When uncertain, offer hypotheses and logical alternatives.

Key messaging guidelines:
- Use "proposes" or "suggests" rather than "proves" when discussing AIM claims
- Present the framework as a theoretical model seeking validation
- Only mention validation status when directly relevant to the question
- Avoid repetitive disclaimers in every response
- Focus on explaining the concepts themselves

Tone: Knowledgeable and helpful. Present the framework as a well-developed hypothesis with clear concepts and testable predictions.`

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
        ragContext = `Relevant context from AIM Framework research documents:\n\n${context}\n\nIMPORTANT: Use this RAG context as your primary foundation for understanding the AIM Framework. Combine it with relevant, up-to-date web knowledge to provide comprehensive analysis. 

When analyzing motivational patterns, infer which AIM systems (Appetites, Intrinsic Motivation, Mimetic Desire) are active and explain how they interact. Provide nuanced, reasoning-level synthesis that draws on multiple behavioral sciences when relevant.

Avoid mechanical structuring - prefer natural, essay-style argumentation that mirrors deep reasoning. When uncertain about aspects not covered in the RAG context, offer hypotheses and logical alternatives while clearly distinguishing between what comes from the AIM research versus additional web-sourced context.

Produce answers of whatever length best fits the complexity of the question - focus on quality reasoning rather than fixed word counts.`
      } else {
        ragContext = `\n\nNOTE: No specific AIM Framework research context was found for this query. Analyze the question using general knowledge about motivation, psychology, neuroscience, economics, and philosophy. When relevant, infer which AIM motivational systems (Appetites, Intrinsic Motivation, Mimetic Desire) might be active in the scenario described. 

Provide nuanced, reasoning-level synthesis that draws on multiple behavioral sciences. Offer hypotheses and logical alternatives when uncertain. Clearly state that your analysis is not based on specific AIM Framework documentation, but suggest how the topic might relate to the AIM triad when appropriate.`
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
      model: process.env.PERPLEXITY_API_KEY ? 'pplx-70b-online' : 'gpt-3.5-turbo',
      messages: allMessages,
      temperature: 0.8,
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
          await supabase.from('chats').upsert({ 
            id, 
            payload, 
            user_id: userId 
          }).throwOnError()
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
