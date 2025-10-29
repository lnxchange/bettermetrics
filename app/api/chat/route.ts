import 'server-only'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/lib/db_types'

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
// Edge runtime has a 30-second timeout limit which is insufficient for
// the reasoning model's complex logical framework analysis
export const runtime = 'nodejs'
export const maxDuration = 600 // 10 minutes in seconds

const AIM_SYSTEM_PROMPT = `You are an expert on Yule Guttenbeil's AIM Motivation Framework (A: Appetites; I: Intrinsic Motivation; M: Mimetic Desire). 

MANDATORY REQUIREMENT: Every answer MUST analyze the topic through the AIM Framework lens, regardless of the subject matter.

RESPONSE FORMAT - Use well-formatted headings and subheadings (NOT numbered lists):
- **Short Answer**: 1-2 sentences directly answering the user's question
- **Analysis**: Detailed explanation with subheadings as needed, focusing on how the topic relates to relevant AIM components
- **AIM Framework Application**: Explicitly identify which AIM motivational systems are active or relevant (use subheadings for each component if discussing multiple)
- **Conclusion**: Brief synthesis connecting the topic back to the AIM Framework. MUST include a logical solution or actionable recommendation derived by applying the logic of the AIM Framework when applicable to the question.

CRITICAL INSTRUCTIONS:
- ALWAYS analyze the topic through the AIM Framework, even if the question seems unrelated to motivation
- First search RAG documents for AIM-related context on the topic
- Then gather general information from internet search
- Analyze the general information through the AIM Framework lens
- Identify which AIM components (A, I, M) are most relevant to the topic
- Use the provided research context to support your AIM-based analysis
- Use markdown headings (##, ###) and subheadings to structure your response clearly
- Do NOT use numbered lists for main sections - use descriptive headings instead
- Derive logical solutions by applying AIM Framework principles to the specific situation
- Include AIM-based solutions in the Conclusion section when proffering recommendations

Do not provide generic answers without AIM Framework analysis.`

// REASONING MODEL IMPLEMENTATION
// Currently using Perplexity's sonar-reasoning model which provides:
// 1. Enhanced logical reasoning about how AIM relates to external information
// 2. Multi-step inference required to apply AIM framework to novel situations
// 3. Synthesizing AIM concepts with broader research literature
// 4. Formalized causal logic chains (IF-THEN reasoning)
// 5. Systematic extrapolation from AIM premises to testable predictions
//
// The system prompt has been tuned with logical framework methodology to:
// - Extract direct logical consequences from AIM premises
// - Structure reasoning as explicit IF-THEN chains
// - Identify assumptions and boundary conditions
// - Operationalize psychological premises into measurable outcomes
// - Generate specific, testable predictions from the AIM framework

export async function POST(req: Request) {
  try {
    const cookieStore = cookies()
    
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.log('Supabase not configured - returning service unavailable')
      return new Response('Service unavailable - Supabase not configured', { status: 503 })
    }
    
    // Check if Perplexity API key is configured
    if (!process.env.PERPLEXITY_API_KEY) {
      console.log('Perplexity API key not configured')
      return new Response('Service unavailable - Perplexity API not configured', { status: 503 })
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
      perplexityConfig: {
        hasKey: !!process.env.PERPLEXITY_API_KEY,
        keyPreview: process.env.PERPLEXITY_API_KEY ? 
          `${process.env.PERPLEXITY_API_KEY.substring(0, 10)}...` : 'Missing'
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
          ragContext = `Context:\n${contextBlock}\n\nInstructions: Use this research context as the PRIMARY foundation for your answer. Analyze the user's question strictly through the AIM Framework lens using this context. Format your response with clear markdown headings (not numbered lists): Short Answer, Analysis (with subheadings), AIM Framework Application, and Conclusion (must include AIM-derived logical solution when applicable).`
        } else {
          ragContext = `\n\nNOTE: No specific AIM Motivation Framework research context was found for this query. 

MANDATORY INSTRUCTIONS: You MUST still analyze this question through the AIM Framework lens:
1. First, gather relevant general information about the topic from internet search
2. Then, analyze how the topic relates to the AIM Framework components:
   - Appetites (A): Biological drives, survival needs, reward systems
   - Intrinsic Motivation (I): Internal satisfaction, autonomy, competence, relatedness
   - Mimetic Desire (M): Social modeling, imitation of others' desires
3. Identify which AIM system(s) are most relevant to the topic
4. Explain the connections explicitly
5. Derive a logical solution by applying AIM Framework principles

RESPONSE FORMAT - Use markdown headings (##, ###), NOT numbered lists:
- **Short Answer**: Direct answer to their question
- **Analysis**: Detailed explanation with subheadings, providing general information about the topic
- **AIM Framework Application**: Explicit analysis of how this topic relates to A, I, and/or M motivational systems (use subheadings for each component)
- **Conclusion**: Brief synthesis connecting the topic to the AIM Framework. MUST include logical solution or actionable recommendation derived from AIM analysis when applicable.

Example: If asked "Explain stagflation", provide economic explanation under Analysis section with subheadings, then under AIM Framework Application analyze which motivational systems (Appetites for economic security, Mimetic Desire for status/consumption patterns) drive behavior during stagflation, and in Conclusion provide AIM-based policy recommendations.`
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

    const systemMessage = { role: 'system', content: systemContent }
    const allMessages = [systemMessage, ...messages]

    // Use Perplexity API directly with fetch - PROPER STREAMING
    console.log('Making Perplexity API request:', {
      model: 'sonar-reasoning',
      messageCount: allMessages.length,
      hasPerplexityKey: !!process.env.PERPLEXITY_API_KEY,
      timestamp: new Date().toISOString()
    })

    let perplexityResponse = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        model: 'sonar-reasoning',
        messages: allMessages,
        max_tokens: 6000,  // Increased from 1400 for comprehensive answers
        temperature: 0.3,   // Lower for fidelity while allowing completeness
        stream: true  // Re-enable streaming for proper client parsing
      })
    })

    if (!perplexityResponse.ok) {
      const errorText = await perplexityResponse.text()

      // Comprehensive error logging for debugging
      console.error('=== PERPLEXITY API ERROR ===')
      console.error('Status:', perplexityResponse.status, perplexityResponse.statusText)
      console.error('Response body:', errorText)
      console.error('Request details:', {
        userId,
        chatId: json.id,
        messageCount: messages.length,
        hasApiKey: !!process.env.PERPLEXITY_API_KEY,
        apiKeyPrefix: process.env.PERPLEXITY_API_KEY?.substring(0, 10),
        model: 'sonar-reasoning',
        timestamp: new Date().toISOString()
      })
      console.error('===========================')

      // Return the upstream HTTP status directly instead of masking as 502
      return new Response(
        JSON.stringify({
          error: 'Perplexity API error',
          status: perplexityResponse.status,
          statusText: perplexityResponse.statusText,
          details: errorText,
          timestamp: new Date().toISOString()
        }),
        {
          status: perplexityResponse.status,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Perplexity API streaming response received successfully')

    // Auto-continue loop to ensure complete answers with conclusions
    let fullContent = ''
    let citations: string[] = []
    let iterationCount = 0
    const maxIterations = 3
    let currentMessages = [...allMessages]

    while (iterationCount < maxIterations) {
      iterationCount++
      console.log(`Auto-continue iteration ${iterationCount}/${maxIterations}`)

      // Collect the response to process citations
      const responseText = await perplexityResponse.text()
      console.log(`Response received (iteration ${iterationCount}), processing citations...`)

      // Parse the response to extract content and citations
      const lines = responseText.split('\n')
      let iterationContent = ''
      let iterationCitations: string[] = []

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6)

          if (data === '[DONE]') {
            break
          }

          try {
            const parsed = JSON.parse(data)

            // Extract citations
            if (parsed.citations) {
              iterationCitations = parsed.citations
              console.log(`Found ${iterationCitations.length} citations in iteration ${iterationCount}`)
            }

            // Extract content
            if (parsed.choices?.[0]?.delta?.content) {
              iterationContent += parsed.choices[0].delta.content
            }
          } catch (parseError) {
            console.warn('Failed to parse SSE data:', data)
          }
        }
      }

      // Accumulate content and citations
      fullContent += iterationContent
      citations = [...citations, ...iterationCitations]

      // Filter out reasoning model's internal thinking tags
      let processedIterationContent = iterationContent.replace(/<think>[\s\S]*?<\/think>/g, '')
      
      console.log(`Iteration ${iterationCount} content length: ${iterationContent.length}, processed: ${processedIterationContent.length}`)

      // Check if we have a conclusion or if this is the first iteration
      const hasConclusion = processedIterationContent.toLowerCase().includes('conclusion')
      const isFirstIteration = iterationCount === 1
      
      if (hasConclusion || isFirstIteration) {
        console.log(`Stopping auto-continue: hasConclusion=${hasConclusion}, isFirstIteration=${isFirstIteration}`)
        break
      }

      // If no conclusion and we have more iterations, continue
      if (iterationCount < maxIterations) {
        console.log('No conclusion found, continuing with follow-up request...')
        
        // Add continuation message
        currentMessages.push({
          role: 'user',
          content: 'Continue until you finish the Conclusion section.'
        })

        // Make another API call
        const continueResponse = await fetch('https://api.perplexity.ai/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            model: 'sonar-reasoning',
            messages: currentMessages,
            max_tokens: 2000,  // Increased from 800 for adequate continuation
            temperature: 0.3,
        stream: true
          })
        })

        if (!continueResponse.ok) {
          console.error('Continue request failed:', continueResponse.status)
          break
        }

        perplexityResponse = continueResponse
      }
    }

    // Final processing
    let processedContent = fullContent.replace(/<think>[\s\S]*?<\/think>/g, '')
    console.log(`Final content length: ${fullContent.length}, processed: ${processedContent.length}`)

    // Process citations to make them clickable
    if (citations.length > 0) {
      citations.forEach((url, index) => {
        const referenceNumber = index + 1
        const markdownLink = `[${referenceNumber}](${url})`
        const regex = new RegExp(`\\[${referenceNumber}\\]`, 'g')
        processedContent = processedContent.replace(regex, markdownLink)
      })
      console.log(`Processed ${citations.length} citations into clickable links`)
    }

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
            content: processedContent,
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
        } catch (error) {
          console.error('Error saving chat to database:', error)
      // Continue to return response even if save fails
    }

    // Return the processed content as a streaming response
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        // Send the processed content in small chunks for streaming effect
        const chunkSize = 5 // Send a few words at a time
        const words = processedContent.split(' ')

        for (let i = 0; i < words.length; i += chunkSize) {
          const chunk = words.slice(i, i + chunkSize).join(' ')
          const separator = (i + chunkSize < words.length) ? ' ' : ''
          controller.enqueue(encoder.encode(chunk + separator))
        }

        controller.close()
      }
    })

    return new Response(stream, {
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
      apiUsed: 'Perplexity sonar-reasoning',
      hasPerplexityKey: !!process.env.PERPLEXITY_API_KEY,
      apiKeyPrefix: process.env.PERPLEXITY_API_KEY?.substring(0, 10),
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
