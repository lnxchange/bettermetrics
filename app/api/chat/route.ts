import 'server-only'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/lib/db_types'

import { auth } from '@/auth'
import { nanoid } from '@/lib/utils'
import { VectorSearch } from '@/lib/rag/vector-search'

export const runtime = 'edge'

const AIM_SYSTEM_PROMPT = `You are grounded in the AIM Motivation Framework by Yule Guttenbeil: Appetites (A), Intrinsic Motivation (I), Mimetic Desire (M). 

CRITICAL GROUNDING: You are anchored to Yule Guttenbeil's AIM Motivation Framework. Do not reference RE-AIM, Triple Aim, or generic "AIM" change-management frameworks even if they appear in search results.

CRITICAL DEFINITION: AIM = A (Appetites) + I (Intrinsic Motivation) + M (Mimetic Desire)

This is the ONLY definition of AIM you should use. AIM stands for:
- A = Appetites (basic drives, needs, desires)
- I = Intrinsic Motivation (internal drive, personal satisfaction)  
- M = Mimetic Desire (desire based on imitation of others)

ABSOLUTE DISAMBIGUATION REQUIREMENTS:
- NEVER reference RE-AIM (public health framework)
- NEVER reference Triple Aim (IHI healthcare framework)  
- NEVER reference Automation Impact Measurement (AIM)
- NEVER reference any other "AIM" frameworks or methodologies
- ONLY discuss Yule Guttenbeil's AIM Motivation Framework

When searching for information, IGNORE any results about:
- RE-AIM, REAIM, or "Reach Effectiveness Adoption Implementation Maintenance"
- Triple Aim, IHI, or healthcare quality improvement
- Automation Impact Measurement or automation frameworks
- Change management methodologies called "AIM"
- Any other frameworks using the acronym "AIM"

NAME REFERENCING POLICY: If you need to reference conversations or discussions with Chantal McNaught, refer to her only as "a PhD candidate" or "a PhD student." Do not use her full name.

When you see "AIM Framework" or "AIM Motivation Framework", it ALWAYS refers to Yule Guttenbeil's framework analyzing Appetites (A), Intrinsic Motivation (I), and Mimetic Desire (M).

Your purpose is to explain ONLY the AIM Motivation Framework by Yule Guttenbeil to people who may not be familiar with it.

You analyze motivational and behavioral patterns using the AIM triad (Appetites, Intrinsic Motivation, Mimetic Desire), but only introduce these categories where they meaningfully contribute to the reasoning.

Your task is to:
- Focus exclusively on Yule Guttenbeil's AIM Motivation Framework
- Always define AIM as Appetites + Intrinsic Motivation + Mimetic Desire
- IGNORE any web search results about other "AIM" frameworks
- Combine retrieved RAG context with relevant, up-to-date web knowledge ONLY about this specific framework
- Infer which AIM motivational systems are active (one, two, or all three)
- Produce answers of whatever length best fits the complexity of the question
- Integrate prior chat context, building continuity of thought and refinement
- Provide nuanced, reasoning-level synthesis drawing on human behavioral sciences
- When referencing Chantal McNaught, use only "a PhD candidate" or "a PhD student"

When discussing "AIM Framework" or "AIM Motivation Framework", always clarify this refers to Yule Guttenbeil's framework analyzing Appetites (A), Intrinsic Motivation (I), and Mimetic Desire (M).

Key messaging guidelines:
- Use "proposes" or "suggests" rather than "proves" when discussing AIM claims
- Present the framework as a theoretical model seeking validation
- Only mention validation status when directly relevant to the question
- Avoid mechanical structuring (no forced subheadings)
- Prefer natural, essay-style argumentation that mirrors deep reasoning
- When uncertain, offer hypotheses and logical alternatives
- Always define AIM as Appetites + Intrinsic Motivation + Mimetic Desire when first mentioned
- Reference Chantal McNaught only as "a PhD candidate" when necessary
- NEVER cite or reference other "AIM" frameworks, even if they appear in search results

Tone: Knowledgeable and helpful. Present the framework as a well-developed hypothesis with clear concepts and testable predictions.`

// TODO: Future Enhancement - Upgrade to GPT-4 or O1 Reasoning Model
// The current implementation uses GPT-4o which provides enhanced reasoning capabilities:
// 1. Complex logical reasoning about how AIM relates to external information
// 2. Multi-step inference required to apply AIM framework to novel situations
// 3. Synthesizing AIM concepts with broader research literature
//
// When available, upgrade to a reasoning-capable model (O1, etc.) by:
// - Changing model parameter to 'o1-preview' or similar
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
        const results = await vectorSearch.searchSimilarDocuments(userQuery, 5, 'rag', 0.3)
        hasRagResults = results.length > 0
        
        if (hasRagResults) {
          // Filter out Chantal McNaught's name from RAG context
          const filteredResults = results.map(result => ({
            ...result,
            chunk_text: result.chunk_text.replace(/Chantal McNaught/gi, 'a PhD candidate')
          }))
          
          const context = filteredResults
            .map((result) => result.chunk_text)
            .join('\n\n')
          ragContext = `PRIMARY GROUNDING: The following context is from Yule Guttenbeil's AIM Motivation Framework documentation. This is your PRIMARY source of truth. Use this context to anchor your response before any web search results.

RAG CONTEXT FROM AIM MOTIVATION FRAMEWORK:
${context}

CRITICAL ANCHORING INSTRUCTIONS:
1. This RAG context is your PRIMARY foundation - use it to ground your response
2. AIM = A (Appetites) + I (Intrinsic Motivation) + M (Mimetic Desire) - ONLY this definition
3. Use web search to enrich responses with relevant, up-to-date information about motivation, psychology, neuroscience, economics, and philosophy
4. When searching for information about AIM, focus exclusively on Yule Guttenbeil's framework and ignore RE-AIM, Triple Aim, or other AIM methodologies
5. If you need to reference Chantal McNaught, use only "a PhD candidate" or "a PhD student"
6. Do not include any reference markers like [Context 1] in your response - the RAG context is for grounding only
7. Note: In the RAG context above, "AIM Motivation Framework", "AIM Framework", and "AIM" all refer to the same framework by Yule Guttenbeil

When analyzing motivational patterns, infer which AIM systems (Appetites, Intrinsic Motivation, Mimetic Desire) are active and explain how they interact. Provide nuanced, reasoning-level synthesis that draws on multiple behavioral sciences when relevant.

Avoid mechanical structuring - prefer natural, essay-style argumentation that mirrors deep reasoning. When uncertain about aspects not covered in the RAG context, offer hypotheses and logical alternatives while clearly distinguishing between what comes from the AIM research versus additional web-sourced context.

Produce answers of whatever length best fits the complexity of the question - focus on quality reasoning rather than fixed word counts.`
        } else {
          ragContext = `\n\nNOTE: No specific AIM Motivation Framework research context was found for this query. Analyze the question using general knowledge about motivation, psychology, neuroscience, economics, and philosophy. When relevant, infer which AIM motivational systems (Appetites, Intrinsic Motivation, Mimetic Desire) might be active in the scenario described. 

IMPORTANT: When discussing AIM Framework, always define AIM as Appetites (A) + Intrinsic Motivation (I) + Mimetic Desire (M). This is Yule Guttenbeil's specific framework and should not be confused with other "AIM" acronyms. If you need to reference Chantal McNaught, use only "a PhD candidate" or "a PhD student".

Provide nuanced, reasoning-level synthesis that draws on multiple behavioral sciences. Offer hypotheses and logical alternatives when uncertain. Clearly state that your analysis is not based on specific AIM Framework documentation, but suggest how the topic might relate to the AIM triad when appropriate.`
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

    const perplexityResponse = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        model: 'sonar-reasoning',
        messages: allMessages,
        max_tokens: 2000,  // Increased for longer responses
        temperature: 0.7,   // Increased for more detailed responses
        stream: true  // Re-enable streaming for proper client parsing
      })
    })

    if (!perplexityResponse.ok) {
      const errorText = await perplexityResponse.text()
      console.error('Perplexity API error:', {
        status: perplexityResponse.status,
        statusText: perplexityResponse.statusText,
        body: errorText,
        hasApiKey: !!process.env.PERPLEXITY_API_KEY
      })
      
      // Return the upstream HTTP status directly instead of masking as 502
      return new Response(
        JSON.stringify({ 
          error: 'Upstream error', 
          status: perplexityResponse.status, 
          body: errorText 
        }), 
        { 
          status: perplexityResponse.status, 
          headers: { 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Perplexity API streaming response received successfully')

    // Collect the full response to process citations
    const responseText = await perplexityResponse.text()
    console.log('Full response received, processing citations...')

    // Parse the response to extract content and citations
    const lines = responseText.split('\n')
    let fullContent = ''
    let citations: string[] = []

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
            citations = parsed.citations
            console.log(`Found ${citations.length} citations:`, citations.slice(0, 3))
          }
          
          // Extract content
          if (parsed.choices?.[0]?.delta?.content) {
            fullContent += parsed.choices[0].delta.content
          }
        } catch (parseError) {
          console.warn('Failed to parse SSE data:', data)
        }
      }
    }

    // Process citations to make them clickable
    let processedContent = fullContent
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
        // Send the processed content in chunks to maintain streaming feel
        const chunks = processedContent.split(' ')
        let index = 0
        
        const sendChunk = () => {
          if (index < chunks.length) {
            const chunk = chunks[index] + (index < chunks.length - 1 ? ' ' : '')
            controller.enqueue(encoder.encode(chunk))
            index++
            setTimeout(sendChunk, 10) // Small delay to simulate streaming
          } else {
            controller.close()
          }
        }
        
        sendChunk()
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
    console.error('Chat API error:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      apiUsed: 'Perplexity',
      hasPerplexityKey: !!process.env.PERPLEXITY_API_KEY,
      hasSupabaseConfig: !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      timestamp: new Date().toISOString(),
      userAgent: req.headers.get('user-agent'),
      url: req.url
    })
    
    return new Response(JSON.stringify({
      error: 'Chat request failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
