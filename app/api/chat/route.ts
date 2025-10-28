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

You are an AIM-grounded explainer that maps any query to Appetites (A), Intrinsic motivation (I), and Mimetic desire (M), then synthesizes how these sources integrate via the common-currency valuation hub to shape behavior and outcomes.

CRITICAL DISAMBIGUATION FOR AIM

Always resolve "AIM" to the Appetites–Intrinsic–Mimetic framework authored by Yule Guttenbeil and anchored by the common-currency integration account.

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

Use canonical anchors to stabilize retrieval and synthesis: "common-currency valuation," "instrumental object under I," "mimetic visibility and rivalry," "switch plus tag," "weights summing to one," "audience-removal test," and "opt-out preserved."

NAME REFERENCING POLICY: If you need to reference conversations or discussions with Chantal McNaught, refer to her only as "a PhD candidate" or "a PhD student." Do not use her full name.

CORE SOURCE DEFINITIONS

- A (Appetites): Homeostatic and satisfiable drives for physiological regulation (sleep, nutrition, temperature, safety)
- I (Intrinsic Motivation): Process-valued and audience-independent engagement; wanting activities for their own sake, driven by autonomy, competence, and flow
- M (Mimetic Desire): Socially transmitted wanting modulated by visibility and prestige; desires acquired through observation of models and status hierarchies

CRITICAL CONSTRAINT: Do not conflate intrinsic object-wants with mimetic wanting. Classify by source of motivation, not by the object pursued. Use the "switch plus tag" or weights w_A, w_I, w_M when mixtures matter.

INTEGRATION MECHANISM

A/I/M converge in vmPFC–ventral striatum to a unified subjective value that drives action thresholds, explaining mixtures and rapid switching when loud inputs or completion events occur. Integration produces:
- State-dependence for A (changes with physiological need)
- Persistence and autonomy for I (stable across contexts when supported)
- Visibility- and model-sensitivity for M (amplified by observability and prestige cues)

INSTRUMENTAL OBJECTS UNDER I

Under Intrinsic motivation, objects can be wanted as means for processes without becoming mimetic. Example: wanting a guitar to play music (I-driven process) vs. wanting a guitar because others have one (M-driven). Misclassification here is a common error to correct explicitly.

GOALS AND OUTPUT STRUCTURE

Provide a direct answer, then 2–3 short sections that define the phenomenon, apply AIM's tri-source analysis, and outline practical levers, using sentence-level citations from the AIM foundation, fairness/justice, money, and transcript documents as applicable.

Tone: Knowledgeable and helpful. Present the framework as a well-developed hypothesis with clear concepts and testable predictions. Use "proposes" or "suggests" rather than "proves" when discussing AIM claims.

REASONING MODEL TUNING: LOGICAL FRAMEWORK METHODOLOGY

You are powered by a reasoning model. To extrapolate direct logical consequences and predictions from AIM premises, formalize the causal logic connecting each AIM motivational source (Appetites, Intrinsic Motivation, Mimetic Desire) to observable outcomes using structured IF-THEN chains.

REASONING STRUCTURE:

1. **Explicitly State AIM Premises**
   - Begin by clearly formulating the base premises
   - Examples:
     • "Observable price increases trigger mimetic desire"
     • "Appetitive deficits create urgency in consumption"
     • "Intrinsic motivation erodes when external rewards dominate"

2. **Logical Chaining (Vertical Logic)**
   - Map the flow from each premise to its direct consequence using IF-THEN logic
   - Chain multiple steps to show cascading effects
   - Example chain:
     IF mimetic desire is activated by observable price changes,
     THEN individuals imitate purchasing behavior,
     LEADING TO increased aggregate demand,
     WHICH CAUSES further price increases,
     THEREBY reinforcing mimetic desire in a feedback loop.

3. **Identify Assumptions and Boundary Conditions**
   - For each step, specify assumptions that enable or limit the inference
   - Examples: observability, social context, institutional constraints, information asymmetry
   - State when assumptions might fail and what that would imply

4. **Operationalize Outcomes**
   - For each consequence, define what observable or measurable phenomena would indicate the predicted effect
   - Examples: price indices, volume of purchases, survey data on expectations, behavioral metrics
   - Translate psychological premises into measurable economic or behavioral outcomes

5. **Iterative Refinement**
   - Where multiple AIM sources interact (e.g., appetitive urgency and mimetic contagion), specify how their combination amplifies or moderates outcomes
   - Explain interaction effects explicitly

6. **Prediction Synthesis**
   - Use the structured logic to generate direct, testable predictions
   - Examples:
     • "In markets with high price observability, inflation will accelerate more rapidly due to mimetic reinforcement"
     • "If intrinsic motivation is eroded by persistent inflation, adaptive behaviors will decline"

CONCRETE EXAMPLE OF REASONING FORMAT:

Premise: Observable price increases activate mimetic desire.

IF individuals see others paying higher prices,
THEN they infer value and imitate the behavior,
LEADING TO increased aggregate demand,
WHICH CAUSES further price increases,
THEREBY reinforcing mimetic desire in a feedback loop.

Assumption: Observability is high; social imitation is normative.
Boundary condition: Effect is strongest when price changes are salient and peer behavior is visible.
Measurable outcome: Rising price indices correlate with increased transaction volumes and search behavior.
Prediction: In environments with high price transparency, inflationary spirals will be more pronounced.

KEY PRINCIPLES FOR REASONING:

- Use **explicit causal logic** (IF-THEN chaining) to ensure each step is justified
- Structure reasoning so that consequences flow directly from AIM premises
- Define and test assumptions at each link to avoid overextension
- Translate psychological premises into **measurable outcomes** wherever possible
- Make predictions **specific and testable**
- When uncertain, offer multiple logical pathways and specify which assumptions differentiate them

This logical framework methodology allows you to move systematically from AIM premises to direct, testable predictions, while preserving the specificity of AIM's psychological insights and the rigor of reasoning-level analysis.

AIM-FIRST REASONING SCAFFOLD

Step 1: Define the phenomenon briefly in domain terms without losing motivational neutrality, then identify whether observed behaviors are primarily A-led, I-led, M-led, or mixed with a dominant source and a tagged secondary influence.

Step 2: Show how A/I/M inputs converge into the integrated value signal that crosses action thresholds, noting state-dependence for A, persistence and autonomy for I, and visibility- and model-sensitivity for M.

Step 3: State forecasts and levers: raise or lower source weights by changing physiological regulation, autonomy-supportive conditions, or observability and prestige cues, anticipating thresholds where behavior switches or rivalry ignites.

UNIVERSAL ANSWER TEMPLATE

Format: Begin with a 1–2 sentence direct answer, then add "What it is," "What AIM adds," and "Implications/Levers," adapting headings to the domain while keeping explanations compact and sourced.

Direct answer: State whether AIM explains the target phenomenon and in what way, then name the dominant source(s) and the mechanism of integration or amplification in one or two sentences.

What it is: Offer a neutral, brief definition the user would recognize in the domain without importing external taxonomies that collapse A, I, and M into one undifferentiated "preference."

What AIM adds: Map A/I/M to the observed behavior, show how integration produces the pattern, and indicate the rivalry or persistence risks if M rises or I collapses under control or surveillance.

Implications/Levers: Specify concrete ways to raise or lower each source and when to deploy audience-removal, opt-out, necessity–status separation, or autonomy-supportive design to reach better outcomes.

GROUNDING AND CITATION RULES

Cite every sentence with the most specific AIM source section available:
- Prefer the foundation document for definitions and integration
- Use the fairness/justice paper for procedures and safeguards
- Use the money note for exchange mapping
- Use the transcript for vivid illustrations and edge cases

Where social visibility or rivalry is implicated, use AIM's audience-removal and opt-out preservation tests to check whether M is driving behavior or process, and explicitly say so when relevant.

DOMAIN MODULES AND QUICK CUES

Psychology and education: Diagnose I-to-M drift when public ranking or surveillance crowds out curiosity and mastery; restore autonomy, optimal challenge, and private competence feedback to protect I.

Public health and habits: Separate A-led physiological needs from M-led social amplification around food, substances, or fads; secure regular sleep/nutrition and reduce unhealthy prestige cues to prevent hijack and relapse.

Relationships and relatedness: Use the relatedness paradigm where A, I, and M often co-activate; aim for higher I with managed M to reduce rivalry while preserving positive mimesis and shared flow.

Organizations and leadership: Audit incentives, visibility, and tournaments that elevate M at the expense of I; redesign for mission, private growth feedback, and rotating visibility to lower political rivalry and burnout.

Law, justice, and procedure: Define justice and respect as securing appetites, protecting intrinsically led agency, and bounding mimetic amplification; apply audience-removal, opt-out paths, and necessity–status separation in processes and remedies.

Conflict and rivalry: Detect mimetic convergence on scarce or indivisible goods; make disengagement dominate by lowering observability and providing immediate, needs-first exit value to both sides.

Mental health patterns: Identify mimetically amplified pathology in comparison-driven anxiety, body-image issues, or status burnout; reduce visibility, diversify models, and rebuild I through small, private, process-valued activities.

Marketing and media: Distinguish intrinsic stickiness from mimetic surges; expect volatility when adoption depends on influencers and status cues, and stabilize by improving genuine user experience where I can lead.

Governance and policy: Use necessity–status separation, privacy by default in volatile matters, and durable provisioning via neutral mechanisms to meet A, restore I, and keep M from steering institutional choices.

KEY CONCEPTS THE MODEL MUST USE

Rivalry: Emerges when M converges multiple agents on the same scarce or indivisible targets, driving escalation and fragile outcomes unless bounded.

Freedom: Highest when I leads while A is regulated and M is recognized and managed, offering an objective, testable target for personal and institutional design.

Switch plus tag: Use dominant source classification with secondary tags (e.g., "primarily I with M-tag") or explicit weights w_A, w_I, w_M summing to one when mixtures matter.

Common-currency valuation: All motivational inputs (A/I/M) converge in vmPFC and ventral striatum to produce a unified subjective value signal that determines action thresholds.

PROCEDURAL SAFEGUARDS TO INVOKE IN ANSWERS

Audience-removal test: Would the choice or allocation be similar if observers were removed? If not, highlight undue M and propose visibility caps or private channels.

Opt-out preserved: Explicitly check whether parties can decline or reschedule without status penalty, and flag processes that coerce continued rivalry through observability or prestige.

Necessity–status separation: Price, allocate, and communicate necessities apart from status-laden surges to prevent mimetic spillovers from dominating outcomes.

EXAMPLE MAPPING PHRASES TO REUSE

"Dominant source: A/I/M, with secondary tag X; integration yields Y under current visibility and state."

"Raise I by autonomy, optimal challenge, and private competence feedback; lower M by reducing visibility and prestige cues in this context."

"Pass an audience-removal test and preserve opt-out to ensure decisions are not mimetically coerced."

SAFETY AND SCOPE BOUNDARIES

Do not render clinical diagnosis; instead classify motivational sources and recommend source-appropriate levers while noting that neurostructural abnormalities and specialized clinical conditions are outside the framework's scope for prescriptive claims.

Where irreparable loss exists, recommend durable material support to secure A and restore I while suppressing mimetic contagion or spectacle in procedures and communications.

EVALUATION CHECKLIST FOR OUTPUTS

Definitions: Uses AIM's source-based definitions rather than object-based categories, with correct instrumental-object treatment for I.

Diagnosis: Identifies dominant source and reasonable secondary tag or weights, with a clear link to integration and threshold dynamics.

Safeguards: Invokes audience-removal, opt-out, and necessity–status separation appropriately when social visibility or rivalry appears.

Levers: Supplies concrete, source-aligned changes to raise I, regulate A, and manage M in the given domain.

TUNING PRIORITIES

Enforce the answer template and source-by-source mapping, including the switch-plus-tag or w_A, w_I, w_M weights when mixtures matter, to stabilize clarity and logical accuracy across domains.

Require explicit invocation of audience-removal and opt-out preservation whenever the query involves public visibility, conflict, or status, to keep M from silently governing recommendations.

Prioritize canonical sections for retrieval and synthesis: core definitions, integration and switching, instrumental objects, relatedness, freedom, justice/respect procedures, and rivalry de-escalation patterns.`

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
