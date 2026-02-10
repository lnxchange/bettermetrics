import 'server-only'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/lib/db_types'
import { revalidatePath } from 'next/cache'
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

// Use Node.js runtime to support longer response times
// Claude 3.5 Sonnet provides excellent reasoning without needing extended timeouts
export const runtime = 'nodejs'
export const maxDuration = 300 // 5 minutes in seconds

const AIM_SYSTEM_PROMPT = `You are the AIM Framework Research Assistant. You are an expert analytical partner trained on Yule Guttenbeil's AIM Motivation Framework.

**CRITICAL INSTRUCTIONS:**
1. IGNORE all web search results about "RE-AIM Framework", "Triple Aim", or other healthcare frameworks
2. When you see "AIM" in any query, it ALWAYS means the AIM Motivation Framework (Appetites/Intrinsic/Mimetic)
3. Base your answers EXCLUSIVELY on the Context Documents provided below
4. Do NOT use section headers like "Short Answer", "Analysis", "Conclusion" or any rigid structure
5. Do NOT provide disclaimers, clarifications, or ambiguity warnings
6. Write naturally and thoroughly - you have 10,000 tokens available

**CONTEXT:**
Users are on the AIM Framework website (usebettermetrics.com). They know what they're asking about. Any reference to "AIM" means the AIM Motivation Framework (Appetites/Intrinsic/Mimetic), NOT healthcare frameworks.

**YOUR MISSION:**
Function as a universal translator for the Human Behavioural Sciences, mapping complex phenomena (Economics, Politics, Sociology) to the AIM (Appetites/Intrinsic/Mimetic) taxonomy.

**RESPONSE STYLE:**
- Write complete, thorough explanations that fully answer the question
- Organize content naturally based on what makes sense for the specific question
- Use multiple paragraphs to develop ideas fully
- Include examples, mechanisms, and applications when relevant
- DO NOT use formulaic structures or forced formats
- DO NOT add meta-commentary about your answer structure

**KNOWLEDGE BOUNDARY & CITATIONS:**
- **Source Priority:** Always prioritize the provided Context Documents (RAG).
- **External References:** You may reference real-world events/history for context.
- **Terminology Rule:** Do NOT use external branding terms like "Thick/Thin Desires" (Burgis) or "System 1/2" (Kahneman) unless you explicitly map them to AIM terms (e.g., "What some call 'Thick Desire,' AIM defines as 'M-tethered-to-I'").
- **Citation Rule (CRITICAL):**
  - **Internal Context:** Cite as *[Report Name]*.
  - **External Articles:** If you name a specific external article, you **MUST** link the title to a valid URL using markdown: [Article Title](URL).
  - **Safety:** If you do not have the URL, attribute generally (e.g., "Industry reports indicate..."). DO NOT generate dead links.

**VISUAL AIDS (DIAGRAMS):**
- You are encouraged to create **Mermaid.js** diagrams to visualize abstract concepts.
- Format: Wrap the code in a \`\`\`mermaid block.

**THE AIM FRAMEWORK (CORE LOGIC):**
- **Appetites (A)**: Biological/Homeostatic imperatives (Safety, Comfort, Resources).
- **Intrinsic Motivation (I)**: Process joy (Mastery, Autonomy, Curiosity).
- **Mimetic Desire (M)**: Social derivation (Status, Prestige, Rivalry).

**STRATEGIC OBJECTIVES:**
1. **SCALE THE ANALYSIS:** Translate academic terms into AIM syntax. Use advanced concepts (VM, Grinding Gear) for complex queries.
2. **DIAGNOSE & UNPACK:** Identify the driver: A (Resource), I (Process), or M (Status).
3. **STEER, DON'T KILL MIMESIS:** Tether M-energy to I-pursuits.

**DEFAULT BEHAVIOR:**
- If Context is missing, use First Principles.
- If the concept is complex, offer to draw a diagram to explain the "Mechanism of Action."`

// REASONING MODEL IMPLEMENTATION
// Using Claude 3.5 Sonnet (claude-3-5-sonnet-20241022) which provides:
// 1. Best-in-class reasoning capabilities for applying AIM framework
// 2. 200K context window for comprehensive RAG context
// 3. No web search - relies exclusively on provided RAG documents
// 4. Excellent at following nuanced instructions without rigid formatting
// 5. Natural, conversational responses without forced structures
// 6. Superior at avoiding unnecessary disclaimers and meta-commentary
//
// Benefits over search-based models:
// - No conflicting information from web search (no RE-AIM, Triple Aim confusion)
// - Focuses entirely on your corpus via RAG
// - Better instruction following for flexible response formats
// - More natural, less defensive writing style

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
      cookies: cookieStore.getAll().map(c => ({ name: c.name, hasValue: !!c.value })),
      supabaseConfig: {
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      },
      anthropicConfig: {
        hasKey: !!process.env.ANTHROPIC_API_KEY,
        keyPreview: process.env.ANTHROPIC_API_KEY ?
          `${process.env.ANTHROPIC_API_KEY.substring(0, 15)}...` : 'Missing'
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

    // Debug Perplexity API key
    console.log('Perplexity API Key Debug:', {
      hasKey: !!process.env.PERPLEXITY_API_KEY,
      keyLength: process.env.PERPLEXITY_API_KEY?.length || 0,
      keyPrefix: process.env.PERPLEXITY_API_KEY?.substring(0, 10) || 'Missing',
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
        ragContext = '\n\nNOTE: RAG system not configured. Please answer based on general knowledge.'
      } else {
        const vectorSearch = new VectorSearch()
        // Dynamic threshold based on query length - more permissive for complex questions
        const threshold = userQuery.length > 150 ? 0.35 : 0.4
        const results = await vectorSearch.searchSimilarDocuments(userQuery, 5, 'rag', threshold)
        hasRagResults = results.length > 0
        
        if (hasRagResults) {
          // Filter out Chantal McNaught's name from RAG context
          const filteredResults = results.map(result => ({
            ...result,
            chunk_text: result.chunk_text.replace(/Chantal McNaught/gi, 'a PhD candidate')
          }))
          
          const contextBlock = prepareRagContext(filteredResults, userQuery.length)
          ragContext = `Context:\n${contextBlock}\n\nInstructions: Use this research context as the PRIMARY foundation for your answer. Analyze the user's question strictly through the AIM Framework lens using this context. Format your response with clear markdown headings (not numbered lists): Short Answer (must provide AIM-based solution/explanation), Analysis (with subheadings), AIM Framework Application, and Conclusion (must include AIM-derived logical solution when applicable).`
        } else {
          ragContext = `\n\nNOTE: No specific AIM research documents match this query. Use general knowledge and apply AIM Framework reasoning.

REMEMBER: You are answering as Yule Guttenbeil would. Apply the three-source model:
- Identify which motivational sources (Appetites, Intrinsic Motivation, Mimetic Desire) are relevant
- Analyze how they interact in this context
- Derive logical consequences from their interactions
- Provide testable predictions or actionable insights

Example approach: If asked about an economic phenomenon, explain it first, then analyze which motivational sources drive the behavior (e.g., Appetites for security, Mimetic patterns in consumption, Intrinsic satisfaction from work), how they interact or conflict, and what this predicts about outcomes or interventions.`
        }
      }
    } catch (error) {
      console.error('RAG search error:', error)
      // Continue without context if RAG fails
      ragContext = '\n\nNOTE: Unable to search AIM Motivation Framework documents. Please answer based on general knowledge.'
    }

    // Build system message with RAG context
    let systemContent = AIM_SYSTEM_PROMPT
    if (ragContext) {
      systemContent += `\n\n${ragContext}`
    }

    // Prepare messages for Claude API
    // Claude expects system message separately, not in messages array
    const claudeMessages = messages.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content
    }))

    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })

    console.log('Making Claude API request:', {
      model: 'claude-3-5-sonnet-20241022',
      messageCount: claudeMessages.length,
      hasAnthropicKey: !!process.env.ANTHROPIC_API_KEY,
      timestamp: new Date().toISOString()
    })

    // Call Claude API with streaming
    let stream
    try {
      stream = await anthropic.messages.stream({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 8192,  // Claude's maximum output tokens
        temperature: 0.3,
        system: systemContent,  // System prompt separate from messages
        messages: claudeMessages,
      })
    } catch (error: any) {
      console.error('=== CLAUDE API ERROR ===')
      console.error('Error:', error)
      console.error('Request details:', {
        userId,
        chatId: json.id,
        messageCount: messages.length,
        hasApiKey: !!process.env.ANTHROPIC_API_KEY,
        model: 'claude-3-5-sonnet-20241022',
        timestamp: new Date().toISOString()
      })
      console.error('===========================')

      return new Response(
        JSON.stringify({
          error: 'Claude API error',
          details: error.message || 'Unknown error',
          timestamp: new Date().toISOString()
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Claude API streaming response initiated')

    // Collect the full response from Claude's stream
    let fullContent = ''

    try {
      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
          fullContent += chunk.delta.text
        }
      }
    } catch (streamError) {
      console.error('Error reading Claude stream:', streamError)
      // If we have partial content, use it
      if (!fullContent) {
        throw streamError
      }
    }

    console.log(`Claude response received: ${fullContent.length} characters`)

    // No citation processing needed - Claude doesn't provide citations like Perplexity

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

    // Return the content as a streaming response
    const encoder = new TextEncoder()
    const responseStream = new ReadableStream({
      start(controller) {
        // Send the content in small chunks for streaming effect
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

    return new Response(responseStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    })
  } catch (error) {
    // Comprehensive error logging for debugging
    console.error('=== CHAT API GENERAL ERROR ===')
    console.error('Error type:', error instanceof Error ? error.name : typeof error)
    console.error('Error message:', error instanceof Error ? error.message : String(error))
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace')
    console.error('Context:', {
      userId: 'unknown', // session not available in catch block
      chatId: 'unknown', // json not available in catch block
      messageCount: 0, // messages not available in catch block
      apiUsed: 'Claude 3.5 Sonnet',
      hasAnthropicKey: !!process.env.ANTHROPIC_API_KEY,
      apiKeyPrefix: process.env.ANTHROPIC_API_KEY?.substring(0, 15),
      hasSupabaseConfig: !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30),
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
