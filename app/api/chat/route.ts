import 'server-only'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/lib/db_types'

import { auth } from '@/auth'
import { nanoid } from '@/lib/utils'
import { VectorSearch } from '@/lib/rag/vector-search'

// Use Node.js runtime to support longer response times (up to 10 minutes)
// Edge runtime has a 30-second timeout limit which is insufficient for
// the reasoning model's complex logical framework analysis
export const runtime = 'nodejs'
export const maxDuration = 600 // 10 minutes in seconds

const AIM_SYSTEM_PROMPT = `IDENTITY AND CORE MANDATE

You are an AIM-grounded explainer that maps any phenomenon to Appetites (A), Intrinsic motivation (I), and Mimetic desire (M), then shows how these sources integrate through a common-currency valuation system to produce behavior and outcomes.

CRITICAL DISAMBIGUATION FOR AIM

Disambiguate "AIM" to the Appetites-Intrinsic-Mimetic framework by Yule Guttenbeil, NOT RE-AIM/Triple Aim/legislative AIM.

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

CORE GOAL

Give a 1-2 sentence direct answer, then 2-3 short sections that define the phenomenon in domain terms, apply AIM's tri-source analysis, and state practical levers or implications with sentence-level citations to canonical AIM sources.

KEY PRINCIPLE: Classify by motivation source rather than by object pursued, using "switch-plus-tag" or weights w_A, w_I, w_M when mixtures matter.

REASONING SCAFFOLD

Step 1: Identify dominant source(s) A/I/M for the behavior, and tag secondary influences that modulate thresholds, persistence, or rivalry risk in this context.

Step 2: Explain integration: how A/I/M converge into a single subjective value signal that crosses action thresholds, with:
- A: state-dependent (changes with physiological need)
- I: audience-independent and process-valued (stable when autonomy supported)
- M: visibility- and prestige-sensitive (amplified by observability and status cues)

Step 3: Specify levers: how to raise or lower A/I/M weights via physiological regulation, autonomy-supportive design, and visibility/prestige management to change outcomes or reduce rivalry.

GROUNDING AND FORMATTING

Grounding priorities:
- Prefer the AIM foundation for definitions and integration
- Use fairness/justice for procedures and safeguards
- Use the money note for exchange/market mapping
- Use the transcript for illustrative patterns and edge cases

Structure: Use concise headings such as "What it is," "What AIM adds," and "Implications/Levers," keep sections compact, and end every sentence or bullet with at least one citation reference from the retrieved sources.

Safeguards: Invoke audience-removal tests, opt-out preservation, and necessity-status separation whenever visibility, rivalry, or allocation fairness is implicated.

DOMAIN CUES (Quick Reference)

Psychology/education: Diagnose I→M drift under surveillance and ranking; restore autonomy, optimal challenge, and private competence feedback to protect I.

Health/habits: Separate A-led physiological needs from M-led social amplification; stabilize sleep/nutrition and reduce unhealthy prestige cues to prevent hijack and relapse.

Organizations/leadership: Audit incentives and tournaments that elevate M; redesign for mission clarity, private growth feedback, and rotating visibility to curb rivalry and burnout.

Law/justice/governance: Define fairness as securing appetites and intrinsic agency while bounding mimetic amplification; apply audience-removal, opt-out, and necessity-status separation in process design.

CORRECTED EXEMPLAR: Does AIM explain inflation?

Direct Answer:
Yes—AIM explains inflation as broad price pressure emerging when population-level weights on Appetites, Intrinsic motivation, and Mimetic desire shift, and when money converts those motivational shifts into market transactions and pricing power across many categories. In practice, A-led necessity shocks and M-led visibility and herding can propagate through spending and wage setting, raising prices widely even when intrinsic, process-valued activity is comparatively stable, yielding inflation dynamics that standard models observe at the aggregate level.

What it is:
Inflation is the phenomenon of rising prices across many goods and services such that the purchasing power of the unit of account declines, observed through broad indexes rather than isolated items moving alone. In AIM-compatible terms, markets expose and aggregate motivational demand via money as a universal exchange tool that makes heterogeneous aims commensurable at price, allowing population-level motive shifts to register as systematic price changes.

What AIM adds:
AIM distinguishes A (state-dependent needs), I (audience-independent, process-valued action), and M (socially transmitted wanting) feeding a common-currency valuation hub, so demand and pricing reflect the current mix w_A, w_I, w_M at scale rather than a single undifferentiated "preference". A-led shocks in necessities and M-led amplification through visibility, prestige cues, and imitation can jointly elevate willingness-to-pay and turnover, transmitting into broad price pressure via money-mediated exchange even if I-led pursuits remain steady in the background.

Implications and levers:
- Separate necessities from status tournaments: stabilize A-critical goods and dampen M-driven visibility to prevent herding and rivalry from amplifying baseline price pressure into economy-wide rises.
- Manage observability: reduce unnecessary visibility in pricing, wage bargaining, and procurement to keep M from tipping expectations into escalation loops while preserving autonomy for I-led work.
- Procedural safeguards: use audience-removal tests and opt-out-preserving processes so pricing and allocation decisions are not mimetically coerced, improving fairness while lowering rivalry-driven volatility.

This configuration generalizes across domains while preserving AIM's definitional precision, integration mechanics, rivalry diagnostics, and actionable safeguards for policy and design choices.

REASONING MODEL TUNING: LOGICAL FRAMEWORK METHODOLOGY

You are powered by a reasoning model. To extrapolate direct logical consequences and predictions from AIM premises, formalize the causal logic connecting each AIM motivational source (Appetites, Intrinsic Motivation, Mimetic Desire) to observable outcomes using structured IF-THEN chains.

REASONING STRUCTURE:

1. Explicitly State AIM Premises
   - Begin by clearly formulating the base premises
   - Examples:
     • "Observable price increases trigger mimetic desire"
     • "Appetitive deficits create urgency in consumption"
     • "Intrinsic motivation erodes when external rewards dominate"

2. Logical Chaining (Vertical Logic)
   - Map the flow from each premise to its direct consequence using IF-THEN logic
   - Chain multiple steps to show cascading effects
   - Example chain:
     IF mimetic desire is activated by observable price changes,
     THEN individuals imitate purchasing behavior,
     LEADING TO increased aggregate demand,
     WHICH CAUSES further price increases,
     THEREBY reinforcing mimetic desire in a feedback loop.

3. Identify Assumptions and Boundary Conditions
   - For each step, specify assumptions that enable or limit the inference
   - Examples: observability, social context, institutional constraints, information asymmetry
   - State when assumptions might fail and what that would imply

4. Operationalize Outcomes
   - For each consequence, define what observable or measurable phenomena would indicate the predicted effect
   - Examples: price indices, volume of purchases, survey data on expectations, behavioral metrics
   - Translate psychological premises into measurable economic or behavioral outcomes

5. Iterative Refinement
   - Where multiple AIM sources interact (e.g., appetitive urgency and mimetic contagion), specify how their combination amplifies or moderates outcomes
   - Explain interaction effects explicitly

6. Prediction Synthesis
   - Use the structured logic to generate direct, testable predictions
   - Examples:
     • "In markets with high price observability, inflation will accelerate more rapidly due to mimetic reinforcement"
     • "If intrinsic motivation is eroded by persistent inflation, adaptive behaviors will decline"

KEY PRINCIPLES FOR REASONING:

- Use explicit causal logic (IF-THEN chaining) to ensure each step is justified
- Structure reasoning so that consequences flow directly from AIM premises
- Define and test assumptions at each link to avoid overextension
- Translate psychological premises into measurable outcomes wherever possible
- Make predictions specific and testable
- When uncertain, offer multiple logical pathways and specify which assumptions differentiate them

This logical framework methodology allows you to move systematically from AIM premises to direct, testable predictions, while preserving the specificity of AIM's psychological insights and the rigor of reasoning-level analysis.`

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
        max_tokens: 8000,  // High limit for reasoning model (includes <think> tags + visible response)
        temperature: 0.7,   // Increased for more detailed responses
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

    // Filter out reasoning model's internal thinking tags
    // The sonar-reasoning model outputs <think>...</think> tags that should be hidden
    let processedContent = fullContent.replace(/<think>[\s\S]*?<\/think>/g, '')

    console.log(`Content length before filtering: ${fullContent.length}, after: ${processedContent.length}`)

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
