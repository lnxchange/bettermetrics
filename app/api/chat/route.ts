import 'server-only'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/lib/db_types'
import { revalidatePath } from 'next/cache'
import { StreamingTextResponse } from 'ai'
import Anthropic from '@anthropic-ai/sdk'

import { auth } from '@/auth'
import { nanoid } from '@/lib/utils'
import { VectorSearch } from '@/lib/rag/vector-search'

type SearchResult = {
  chunk_text: string
  metadata: any
  document_id: string
  chunk_index: number
  similarity_score?: number
}

function dedupeBy<T>(arr: T[], key: (x: T) => string) {
  const seen = new Set<string>()
  const out: T[] = []
  for (const item of arr) {
    const k = key(item)
    if (!seen.has(k)) {
      seen.add(k)
      out.push(item)
    }
  }
  return out
}

function trim(text: string, maxChars: number) {
  if (text.length <= maxChars) return text
  return text.slice(0, maxChars - 1) + '…'
}

function prepareRagContext(results: SearchResult[], userQueryLength: number = 0) {
  // Expand to 4-5 chunks for longer questions, trim each to ~1200 chars
  const topK = userQueryLength > 100 ? 5 : 4
  const top = results
    .sort((a, b) => (b.similarity_score ?? 0) - (a.similarity_score ?? 0))
    .slice(0, topK * 2) // Get more candidates for deduplication

  const unique = dedupeBy(top, r => `${r.document_id}:${r.chunk_index}`).slice(0, topK)
  const trimmed = unique.map(r => trim(r.chunk_text, 1200))
  return trimmed.join('\n\n---\n\n')
}

// Use Node.js runtime to support longer response times (up to 10 minutes)
export const runtime = 'nodejs'
export const maxDuration = 600 // 10 minutes in seconds

const AIM_SYSTEM_PROMPT = `You are the AIM Framework Research Assistant. You are a highly capable analytical partner trained *exclusively* on Yule Guttenbeil's AIM Motivation Framework.

**CRITICAL: STRICT RAG GROUNDING RULES**
- You MUST answer ONLY based on the provided Context documents below.
- If a term appears in the Context (e.g., "Quantum Epistemology"), use ONLY the definition and explanation from the Context - do NOT import definitions from external sources or general knowledge.
- DO NOT invent analogies, metaphors, or connections that are not explicitly stated in the Context documents.
- DO NOT conflate AIM-specific terminology with similar terms from other fields (e.g., AIM's "Quantum Epistemology" is about Bayesian belief dynamics in coupled social systems, NOT quantum physics).
- If the Context documents do not contain sufficient information to answer a question, say: "The AIM research documents do not contain detailed information on this topic."
- NEVER hallucinate content. If you find yourself creating analogies or connections not present in the documents, STOP.

**KNOWLEDGE BOUNDARY (INTERNAL ONLY):**
- **Context:** The user is currently on the "Use Better Metrics" website. Assume all queries regarding "AIM" refer specifically to Yule Guttenbeil's framework.
- **Constraint:** Do not discuss or compare against unrelated frameworks sharing the acronym (e.g., RE-AIM). If a user explicitly asks about them, politely redirect to the current context.
- **Output Style:** Start directly with the definition or analysis. Do not waste tokens clarifying *which* framework you are talking about unless there is genuine ambiguity.

**THE AIM FRAMEWORK (CORE LOGIC):**
All human choices are driven by three distinct neural systems. Your goal is to identify which is driving the user:
- **Appetites (A)**: Biological imperatives (Safety, Comfort, Resources, Pain Avoidance).
- **Intrinsic Motivation (I)**: The joy of the process (Mastery, Curiosity, Play, Flow).
- **Mimetic Desire (M)**: Social derivation (Status, Prestige, Rivalry, "Being seen").

**YOUR IDENTITY & TONE:**
- Do not impersonate Yule. You are his expert analyst.
- Tone: Surgical, empathetic, diagnostic.
- **Structure:** Use adaptive formatting (Paragraphs, Bullet points, or "If-Then" logic chains).

**STRATEGIC OBJECTIVES & CONTINGENCIES:**

1. **DIAGNOSTIC CALIBRATION (The Simplicity Filter):**
   - IF the user's request is simple or functional (e.g., "What time is it?", "Summarize this text"), provide a direct answer.
   - Do NOT force a deep psychological diagnosis on basic functional tasks. Reserve AIM decomposition for questions involving motivation, conflict, confusion, or strategy.

2. **UNPACK, DON'T JUST ANSWER:**
   - If a user states a complex desire (e.g., "I want to get rich"), deconstruct it.
   - Ask: Is this for security (A)? Freedom/Mastery (I)? Or Status (M)?

3. **STEER, DON'T KILL MIMESIS:**
   - Do not treat Mimetic desire as "bad." Aim to tether M-energy to I-pursuits.
   - Show the user how genuine mastery (I) is the most sustainable path to status (M).

**HANDLING CONFLICT (The Audience Removal Protocol):**
- **Refusal to Validate Rivalry:** If a user seeks validation for a rivalrous/destructive goal (e.g., revenge, "crushing" a competitor), DO NOT validate the goal or offer tactical advice on how to harm others.
- **The Pivot Script:** "I hear your frustration, but the AIM Framework suggests that pursuing this goal through rivalry (M) typically deepens the crisis. We must shift from 'Defeating the Person' to 'Solving the Scarcity.' Is this conflict over Resources (A) or Recognition (M)?"

**DEFAULT BEHAVIOR (The Principle Bridge):**
- **Handling Missing Context:** If the user asks about a specific external event or person NOT in your provided Context (RAG), DO NOT hallucinate details or search the internet.
- **The Bridge Script:** "The AIM research documents do not contain detailed information on [Insert Topic]. However, if you describe specific behaviors or pressures you are observing, I can analyze them through the AIM lens to identify Appetite (A), Intrinsic (I), or Mimetic (M) drivers."`

// CLAUDE OPUS 4 IMPLEMENTATION
// 
// Claude Opus 4 is ideal for RAG applications because:
// 1. No web search - uses only provided context
// 2. Excellent at following system prompt instructions
// 3. Strong grounding in document content
// 4. Precise adherence to formatting requirements

export async function POST(req: Request) {
  try {
    const cookieStore = cookies()
    
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.log('Supabase not configured - returning service unavailable')
      return new Response('Service unavailable - Supabase not configured', { status: 503 })
    }
    
    // Check if Anthropic API key is configured
    if (!process.env.ANTHROPIC_API_KEY) {
      console.log('Anthropic API key not configured')
      return new Response('Service unavailable - Anthropic API not configured', { status: 503 })
    }
    
    // Check if OpenAI API key is configured (needed for embeddings)
    if (!process.env.OPENAI_API_KEY) {
      console.log('OpenAI API key not configured (needed for embeddings)')
      return new Response('Service unavailable - OpenAI API not configured', { status: 503 })
    }
    
    // Create Supabase client
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
    console.log('Session debug:', {
      hasSession: !!session,
      userId: session?.user?.id,
      sessionExpiry: session?.expires_at,
      currentTime: Date.now(),
      sessionValid: session?.expires_at ? Date.now() < session.expires_at * 1000 : false,
      supabaseConfig: {
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      },
      anthropicConfig: {
        hasKey: !!process.env.ANTHROPIC_API_KEY
      }
    })
    
    if (!session?.user?.id) {
      console.log('No valid session found - returning 401')
      return new Response(
        JSON.stringify({ 
          error: 'Unauthorized', 
          message: 'Please sign in to use chat',
          status: 401 
        }), 
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }
    const userId = session.user.id

    // Debug API keys
    console.log('API Key Debug:', {
      hasAnthropicKey: !!process.env.ANTHROPIC_API_KEY,
      hasOpenAIKey: !!process.env.OPENAI_API_KEY,
      timestamp: new Date().toISOString()
    })

    // Get the latest user message for RAG context
    const userQuery = messages[messages.length - 1]?.content || ''

    // Search for relevant context using RAG with strict AIM definition
    let ragContext = ''
    let hasRagResults = false
    try {
      // Check if required environment variables are available for RAG
      if (!process.env.OPENAI_API_KEY || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.log('Missing environment variables for RAG - skipping vector search')
        ragContext = '\n\nNOTE: RAG system not configured. State this limitation to the user. You may only apply the core AIM three-source model (Appetites, Intrinsic Motivation, Mimetic Desire) to analyze user-provided information. DO NOT invent or hallucinate content.'
      } else {
        const vectorSearch = new VectorSearch()
        // Dynamic threshold based on query length - more permissive for complex questions
        const threshold = userQuery.length > 150 ? 0.35 : 0.4
        const results = await vectorSearch.searchSimilarDocuments(userQuery, 5, 'rag', threshold)
        hasRagResults = results.length > 0
        
        console.log('RAG search results:', {
          query: userQuery.substring(0, 100),
          resultsCount: results.length,
          threshold,
          topScores: results.slice(0, 3).map(r => r.similarity_score)
        })
        
        if (hasRagResults) {
          // Filter out Chantal McNaught's name from RAG context
          const filteredResults = results.map(result => ({
            ...result,
            chunk_text: result.chunk_text.replace(/Chantal McNaught/gi, 'a PhD candidate')
          }))
          
          const contextBlock = prepareRagContext(filteredResults, userQuery.length)
          ragContext = `Context:\n${contextBlock}\n\nCRITICAL INSTRUCTIONS:
1. Answer ONLY based on the Context above. Do not add information from external sources.
2. If a term in the Context (like "Quantum Epistemology") has a specific AIM definition, use ONLY that definition - do not import meanings from other fields.
3. Quote or closely paraphrase the Context when possible to ensure accuracy.
4. If the Context does not fully address the question, state what IS covered and note what is missing.
5. DO NOT invent analogies, metaphors, or connections not explicitly present in the Context.
6. Format your response with clear markdown headings: Short Answer, Analysis (with subheadings), AIM Framework Application, and Conclusion.`
        } else {
          ragContext = `\n\nNOTE: No AIM research documents match this query.

STRICT INSTRUCTION: Since no relevant AIM documents were found, you must:
1. State clearly: "The AIM research documents do not contain information on this specific topic."
2. If the question relates to motivation, desires, or behavior, offer to analyze it using the core AIM three-source model (Appetites, Intrinsic Motivation, Mimetic Desire) IF the user provides specific details to analyze.
3. DO NOT invent content, create analogies, or import external information to fill the gap.
4. DO NOT pretend to have information you don't have.`
        }
      }
    } catch (error) {
      console.error('RAG search error:', error)
      // Continue without context if RAG fails - but with strict grounding
      ragContext = '\n\nNOTE: Unable to search AIM Motivation Framework documents due to a technical error. State this limitation to the user and offer to analyze their question using the core AIM three-source model if they provide specific details. DO NOT invent or hallucinate content.'
    }

    // Build system message with RAG context
    let systemContent = AIM_SYSTEM_PROMPT
    if (ragContext) {
      systemContent += `\n\n${ragContext}`
    }

    // Convert messages to Anthropic format (separate system from user/assistant)
    const anthropicMessages = messages.map((msg: { role: string; content: string }) => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content
    }))

    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    })

    console.log('Making Claude Opus 4 API request:', {
      model: 'claude-opus-4-20250514',
      messageCount: anthropicMessages.length,
      hasRagContext: hasRagResults,
      systemPromptLength: systemContent.length,
      timestamp: new Date().toISOString()
    })

    // Use Claude Opus 4 with streaming
    const stream = await anthropic.messages.stream({
      model: 'claude-opus-4-20250514',
      max_tokens: 4000,
      system: systemContent,
      messages: anthropicMessages
    })

    console.log('Claude Opus 4 streaming response initiated')

    // Collect the full response
    let fullContent = ''
    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        fullContent += event.delta.text
      }
    }

    console.log(`Claude response received, length: ${fullContent.length}`)

    // Save chat to database
    try {
      const title = messages[0]?.content?.substring(0, 100) || 'New Chat'
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
            content: fullContent,
            role: 'assistant'
          }
        ]
      }

      console.log('Saving chat to database:', { id, userId, title, messageCount: payload.messages.length })
      await supabase.from('chats').upsert({ 
        id, 
        payload, 
        user_id: userId 
      }).throwOnError()

      console.log(`Chat saved to database: ${id}`)
      
      // Revalidate chat pages so sidebar updates with new chat
      revalidatePath('/chat')
      revalidatePath(`/chat/${id}`)
    } catch (error) {
      console.error('Error saving chat to database:', error)
      // Continue to return response even if save fails
    }

    // Return the processed content as a streaming response using Vercel AI SDK
    const encoder = new TextEncoder()
    const responseStream = new ReadableStream({
      start(controller) {
        // Send the processed content in small chunks for streaming effect
        const chunkSize = 5 // Send a few words at a time
        const words = fullContent.split(' ')

        for (let i = 0; i < words.length; i += chunkSize) {
          const chunk = words.slice(i, i + chunkSize).join(' ')
          const separator = (i + chunkSize < words.length) ? ' ' : ''
          controller.enqueue(encoder.encode(chunk + separator))
        }

        controller.close()
      }
    })

    // Use StreamingTextResponse from Vercel AI SDK for proper useChat compatibility
    return new StreamingTextResponse(responseStream)
  } catch (error) {
    // Comprehensive error logging for debugging
    console.error('=== CHAT API GENERAL ERROR ===')
    console.error('Error type:', error instanceof Error ? error.name : typeof error)
    console.error('Error message:', error instanceof Error ? error.message : String(error))
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace')
    console.error('Context:', {
      apiUsed: 'Claude Opus 4',
      hasAnthropicKey: !!process.env.ANTHROPIC_API_KEY,
      hasOpenAIKey: !!process.env.OPENAI_API_KEY,
      hasSupabaseConfig: !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      timestamp: new Date().toISOString(),
      userAgent: req.headers.get('user-agent'),
      url: req.url,
      method: req.method,
      contentType: req.headers.get('content-type')
    })
    console.error('==============================')
    
    return new Response(JSON.stringify({
      error: 'Chat request failed',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      details: 'Please check server logs for more information',
      timestamp: new Date().toISOString()
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
