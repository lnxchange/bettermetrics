import 'server-only'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/lib/db_types'
import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'
import { nanoid } from '@/lib/utils'
import { VectorSearch } from '@/lib/rag/vector-search'
import { extendContextSnapshot, treatiseContext } from '@/lib/rag/treatise-context'
import { ChatProvider } from '@/lib/chat-provider-ids'
import { loadChatSettings, PAUSED_MESSAGE, questionAllowed, recordChatUsage } from '@/lib/chat-settings'
import { generate, LlmError, readerMessage } from '@/lib/llm'
import { readActiveKey } from '@/lib/user-api-keys'
import { adminSiteKey, isSiteAdmin } from '@/lib/site-keys'
import { createHash } from 'crypto'

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

async function loadContextSnapshot(
  supabase: ReturnType<typeof createRouteHandlerClient<Database>>,
  id: string,
  userId: string
) {
  const { data } = await supabase.from('chats').select('payload').eq('id', id).eq('user_id', userId).maybeSingle()
  const snapshot = (data?.payload as { contextSnapshot?: { text?: string; sectionIds?: string[] } } | null)?.contextSnapshot
  if (!snapshot || typeof snapshot.text !== 'string') return null
  return {
    text: snapshot.text,
    sectionIds: Array.isArray(snapshot.sectionIds) ? snapshot.sectionIds.filter(id => typeof id === 'string') : []
  }
}

function trim(text: string, maxChars: number) {
  if (text.length <= maxChars) return text
  return text.slice(0, maxChars - 1) + '…'
}

function prepareRagContext(results: SearchResult[], userQueryLength: number = 0) {
  // Use 12 chunks for longer questions, 10 for shorter — larger chunks (2500 chars each)
  // give Claude ~25-30K chars of context per query for deep AIM Framework reasoning
  const topK = userQueryLength > 100 ? 12 : 10
  const top = results
    .sort((a, b) => (b.similarity_score ?? 0) - (a.similarity_score ?? 0))
    .slice(0, topK * 2) // Get more candidates for deduplication

  const unique = dedupeBy(top, r => `${r.document_id}:${r.chunk_index}`).slice(0, topK)
  const trimmed = unique.map(r => {
    const text = trim(r.chunk_text, 3000)
    // Treatise chunks already open with "[Treatise, Chapter N: Title]"
    if (text.startsWith('[Treatise') || !r.metadata?.label) return text
    return `[Treatise, ${r.metadata.label}: ${r.metadata.title}]\n${text}`
  })
  return trimmed.join('\n\n---\n\n')
}

// Use Node.js runtime to support longer response times
// Claude 3.5 Sonnet provides excellent reasoning without needing extended timeouts
export const runtime = 'nodejs'
export const maxDuration = 300 // 5 minutes in seconds

const AIM_SYSTEM_PROMPT = `You are the AIM Framework Research Assistant, an expert analytical partner trained on Yule Guttenbeil's AIM Framework and the AIM Treatise ("A Unifying General Theory of Human Motivation: Appetites, Intrinsic Motivation and Mimetic Desire").

**CRITICAL INSTRUCTIONS:**
1. IGNORE anything about "RE-AIM Framework", "Triple Aim", or other healthcare frameworks
2. "AIM" ALWAYS means the AIM Framework (Appetites / Intrinsic Motivation / Mimetic Desire). In your answers, call it "the AIM Framework", never just "AIM"
3. Base your answers on the Context Documents provided below; where they are silent, reason from the nine axioms and the architecture stated here
4. If a term appears in the Context (e.g., "Quantum Epistemology", "Salience", "Observer"), use ONLY the AIM-specific definition from the Context. Do not import definitions from other fields
5. Do NOT use rigid section headers like "Short Answer", "Analysis", "Conclusion"
6. Do NOT add disclaimers, hedging preambles, or meta-commentary about your answer
7. Write naturally and thoroughly
8. NEVER invent content. If something is not in the Context and cannot be derived from the axioms, say what the framework does and does not cover

**CONTEXT:**
Users are on aimtheory.org. Most have arrived from a short page on the site and want a specific, accurate answer. The Treatise is the authority. The Context contains Treatise chapters and appendices only.

**YOUR MISSION:**
Function as a universal translator for the human behavioural sciences, mapping phenomena (economics, politics, law, psychology, organisations) onto the AIM taxonomy and architecture, and showing which axioms the explanation depends on.

**THE NINE AXIOMS (Treatise, Chapter 4):**
1. Three-Source Taxonomy: motivation arises from exactly three neurologically distinct sources, Appetites (A), Intrinsic Motivation (I), Mimetic Desire (M); no fourth source is required.
2. Common-Currency Integration: the three converge in a valuation system (vmPFC / ventral striatum) that outputs one scalar value per Object. U(x) = wA·UA(x) + wI·UI(x) + wM·UM(x), weights summing to 1 and state-dependent.
3. Source Opacity: after integration the source decomposition is not preserved; introspection reads the scalar and cannot recover which source produced a want (a many-to-one map; the Data Processing Inequality makes the loss strict).
4. Confabulation: the brain generates sincere but inaccurate narratives about why it wants or chose; M is especially vulnerable because its signal is a Salience reading received under the category of deficit and leaves no residue to check against.
5. M as Amplifier (Object Parasitism): M generates no Object-category of its own; it inflates the value of existing A-Objects and I-Objects by attaching a Mimetic Premium experienced as intrinsic to the Object.
6. Differential Satiation Dynamics: A satiates episodically and recurs; I deepens rather than terminates (I-enabling Objects satiate at functional adequacy); M does not satiate because the Observer encodes Salience over an unbounded field, not a deficit.
7. Preconscious Transmission: M is transmitted through social-reward circuits (mirror-neuron and social-cognition networks) faster than conscious report (best estimate 60–340 ms in the human substrate), so M-signals are integrated before they can be scrutinised.
8. Bayesian Belief Dynamics: belief revision is Bayesian and content-agnostic; posteriors become priors, so confabulated priors are entrenched and can cascade socially.
9. Agent-Based Causal Default: causal cognition defaults to agent-shaped explanations; systemic explanations are not generated by default. This fixes the form Confabulation takes (self-authorship, scapegoating). Axiom 9 is not load-bearing for the architecture or its mathematics; it is load-bearing for the account of the form the failures take.

**THE ARCHITECTURE (Treatise, Chapter 4, Section 4.4):**
- Decision Hub: integrator and action-selector; receives all three inputs, outputs the Scalar.
- Body Manager: homeostatic-deficit signaller (A).
- Thinker: prior-maintainer and Bayesian ground-resolver; home of Intrinsic Motivation, Imagination, Hypothesis formation and I-Override.
- Observer: continuous conditional Salience assessor over the whole perceived Object field (M); encodes Salience, not deficit.
- Belief Register: the store of priors the Thinker maintains and updates.
Key derived terms: Salience-Deficit Conflation, Mimetic Premium and Status (Status-Premium Duality), the Mimetic Treadmill, Behavioural Signatures, the Two-Question Diagnostic (Q1, A-Test: "Would I still need this if my survival were secure?"; Q2, I-Test: "Would I still want this if no one could ever see me having or doing it?"; failing both identifies M by elimination), I-Override, the Knowledge Patch and its Seven Operations, Crisis State Architecture, Relationalism.

**RESPONSE STYLE:**
- Answer the question actually asked, completely, in well-developed paragraphs
- Name the axioms or architectural components the explanation rests on where that helps
- Include concrete examples and mechanisms
- DO NOT use formulaic structures or forced formats

**KNOWLEDGE BOUNDARY & CITATIONS:**
- **Source Priority:** the Context Documents are the Treatise. Use the terms as the Treatise defines them.
- **External References:** you may reference real-world events/history for context.
- **Terminology Rule:** do not use external branding terms like "Thick/Thin Desires" (Burgis) or "System 1/2" (Kahneman) unless you explicitly map them to AIM terms.
- **Citation Rule (CRITICAL):**
  - **Internal Context:** cite Treatise material as *[Treatise, Chapter N]* or *[Treatise, Appendix X]*.
  - **External Articles:** if you name a specific external article you MUST link the title to a valid URL using markdown: [Article Title](URL).
  - **Safety:** if you do not have the URL, attribute generally. DO NOT generate dead links.

**VISUAL AIDS (DIAGRAMS):**
- You may create **Mermaid.js** diagrams to visualise mechanisms. Wrap the code in a \`\`\`mermaid block.

**STRATEGIC OBJECTIVES:**
1. **DIAGNOSE & UNPACK:** identify the leading source: A (deficit), I (process), or M (Salience / status).
2. **SHOW THE DERIVATION:** where a conclusion follows from the axioms, say which ones and how.
3. **STEER, DON'T KILL MIMESIS:** where advice is asked for, the framework's answer is to secure A-floors, protect I-domains, and manage M visibility, not to eliminate M.`

const LAYPERSON_FIRST = `
IMPORTANT — PLAIN ENGLISH MODE. This is the first reply in the conversation.
The person reading this has never heard of the AIM Framework before. Explain how Appetites, Intrinsic Motivation, and Mimetic Desire bear on the question, as if for the first time.

EXPLAIN THE CONCEPTS THEMSELVES, not just the words:
- Use concrete, real-life examples for every concept. Abstract ideas must always be grounded in something familiar — a workplace situation, a social interaction, a personal experience everyone can relate to.
- Example of how to introduce Appetites: "Think of Appetites as our survival instincts — the part of us that wants to feel safe, comfortable, and secure. When someone takes a stable job they don't love just because the salary is reliable, that's Appetites at work."
- Example of how to introduce Intrinsic Motivation: "Intrinsic Motivation is the pull you feel when you lose track of time doing something you genuinely enjoy — not for a reward or because someone is watching, but because the activity itself is satisfying. A child building Lego for hours isn't chasing a prize — that's Intrinsic Motivation."
- Example of how to introduce Mimetic Desire: "Mimetic Desire is the tendency to want things because other people want them. We don't always choose our desires independently — we copy them from the people around us. Someone who suddenly wants a promotion after a colleague gets one isn't just ambitious — they're being driven by Mimetic Desire."

WRITING STYLE:
- Write conversationally, like a knowledgeable friend explaining something over coffee — warm, clear, curious
- No jargon without an immediate plain-English definition
- No formal citations; say things like "the research on this shows..." or "the framework explains this as..."
- Use analogies freely — the goal is understanding, not impressiveness
- Keep all the depth and insight of the academic answer, but make every sentence land for someone encountering these ideas for the first time`

const LAYPERSON_CONTINUE = `
IMPORTANT — PLAIN ENGLISH MODE. This conversation has already begun.
An earlier reply has introduced Appetites, Intrinsic Motivation, and Mimetic Desire. Continue from what has been said. Do not define those three again.
If a new glossary term appears for the first time, give its plain-English explanation once, then treat it as known.
Keep the same voice: conversational, concrete, and without formal citations. Do not define a term again once this conversation has explained it.`

const ACADEMIC_STYLE = `
IMPORTANT — ACADEMIC MODE. The reader can follow the Treatise. The following replaces Response Style, the Citation Rule, and Strategic Objective 3 for this reply.

Write the argument in the Treatise's own vocabulary.
- When a named term is supplied under Treatise Definitions, state the formal definition and, where the entry has one, its plain-English explanation. Both belong to the glossary. Do not replace either with a paraphrase of your own, and do not add analogies unless the supplied chapter uses them.
- Give the epistemic status with the definition, so a framework-specific construct is not presented as an established finding.
- Name the axioms and the architectural components the conclusion depends on, and say how the conclusion follows.
- Cite each load-bearing claim at the section it comes from, as plain words in exactly this shape: Chapter 12, Section 12.2 or Appendix A, Section A.2. Cite only a section that appears in the supplied text. Do not invent a section, and do not wrap the citation in italics, brackets, or a link.
- When the supplied text gives a URL for a reference the answer relies on, include that reference as a markdown link. A reference with no URL is named without a link. Do not invent a URL, and do not add a source that is not in the supplied text.
- Answer the question asked. Give a recommendation only when one was asked for, and then state it as the framework's derived result.`

const ACADEMIC_FIRST = `
This is the first reply. Identify Appetites, Intrinsic Motivation, and Mimetic Desire once, using the glossary definition and its plain-English explanation where those are supplied.`

const ACADEMIC_CONTINUE = `
This conversation has already begun. Continue from what has been said. Do not define Appetites, Intrinsic Motivation, or Mimetic Desire again. A new glossary term is stated, with its plain-English explanation where the glossary has one, the first time it enters the conversation, and is then treated as known.`

const DEFINITION_RULE = `**DEFINITIONS ARE MANDATORY:**
A supplied Treatise Definition is the meaning of that word, including where ordinary usage differs. State it and use it. The supplied chapter is the argument. Do not answer from the ordinary meaning of the word, and do not set the definition aside.`


// 5. Natural, conversational responses without forced structures
// 6. Superior at avoiding unnecessary disclaimers and meta-commentary
// 7. 8K output tokens for complete answers
//
// Benefits over search-based models:
// - No conflicting information from web search (no RE-AIM, Triple Aim confusion)
// - Focuses entirely on your corpus via RAG
// - Better instruction following for flexible response formats
// - More natural, less defensive writing style

// Ceilings on the conversation a request may resend.
// Prompt caching: the system prompt and the Treatise context are sent as
// separate cached blocks, so a repeat of the same prefix within five minutes
// is billed at the cache-read rate instead of full input price.
export async function POST(req: Request) {
  try {
    if (process.env.CHAT_PAUSED === 'true') {
      return new Response(
        JSON.stringify({ error: 'chat_paused', message: PAUSED_MESSAGE }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const cookieStore = cookies()
    
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.log('Supabase not configured - returning service unavailable')
      return new Response('Service unavailable - Supabase not configured', { status: 503 })
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
    const { messages, previewToken, mode } = json

    const settings = await loadChatSettings()
    if (settings.paused) {
      return new Response(
        JSON.stringify({ error: 'chat_paused', message: settings.pausedMessage }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Guests are refused. Only an admin with no saved key is billed to a site key.
    const session = await auth({ cookieStore })
    const userId: string | null = session?.user?.id ?? null
    const isGuest = !userId
    const isAdmin = isSiteAdmin(session?.user)

    if (isGuest) {
      console.warn('Chat refused: account required', {
        country: req.headers.get('x-vercel-ip-country'),
        userAgent: req.headers.get('user-agent')
      })
      return new Response(
        JSON.stringify({
          error: 'auth_required',
          message: 'Create an account to ask the assistant.'
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response('Bad request', { status: 400 })
    }

    // Every request resends the whole conversation, so its size is the input
    // cost. Guests get a short, small conversation; everyone gets a ceiling.
    const conversationChars = messages.reduce(
      (sum: number, msg: any) => sum + (typeof msg?.content === 'string' ? msg.content.length : 0),
      0
    )
    const maxMessages = settings.maxMessages
    const maxChars = settings.maxConversationChars
    if (messages.length > maxMessages || conversationChars > maxChars) {
      return new Response(
        JSON.stringify({
          error: 'conversation_too_long',
          message: 'This conversation is too long. Please start a new chat.'
        }),
        { status: 413, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Resolve who pays before any retrieval or model call. A reader with no
    // saved key does not fall through to a site key. An admin does.
    let apiKey: string | null = null
    let provider: ChatProvider = 'anthropic'
    let payer: 'reader' | 'site' = 'reader'
    if (userId) {
      const stored = await readActiveKey(userId)
      if (stored.key) {
        apiKey = stored.key
        provider = stored.provider
      } else {
        const site = isAdmin ? adminSiteKey(settings.providers) : null
        if (site) {
          apiKey = site.apiKey
          provider = site.provider
          payer = 'site'
        } else if ('reason' in stored && stored.reason === 'unavailable') {
          return new Response(
            JSON.stringify({
              error: 'key_store_unavailable',
              message: 'API key storage is unavailable. Try again in a moment.'
            }),
            { status: 503, headers: { 'Content-Type': 'application/json' } }
          )
        } else {
          return new Response(
            JSON.stringify({
              error: 'api_key_required',
              message: 'Add an API key in your profile. Questions are billed to that key.'
            }),
            { status: 403, headers: { 'Content-Type': 'application/json' } }
          )
        }
      }
      if (!settings.providers[provider]) {
        return new Response(
          JSON.stringify({
            error: 'provider_off',
            message: 'That provider is turned off. Choose another key on your profile.'
          }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        )
      }
    } else {
      return new Response(
        JSON.stringify({
          error: 'auth_required',
          message: 'Create an account to ask the assistant.'
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const ipHash = createHash('sha256')
      .update(req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown')
      .digest('hex')
      .slice(0, 32)
    const throttle = await questionAllowed(userId, ipHash, settings)
    if (!throttle.allowed) {
      await recordChatUsage({
        userId,
        provider,
        model: settings.models[provider],
        inputTokens: 0,
        outputTokens: 0,
        cachedTokens: 0,
        contextChars: 0,
        outcome: `refused:${throttle.reason}`,
        ipHash
      })
      return new Response(
        JSON.stringify({
          error: 'rate_limited',
          message: 'You have reached the question limit. Try again later.'
        }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Get the latest user message for RAG context
    const userQuery = messages[messages.length - 1]?.content || ''
    // Follow-ups ("and in chapter 12?") need the earlier questions to retrieve well
    const recentUserText = messages
      .filter((msg: any) => msg.role === 'user' && typeof msg.content === 'string')
      .slice(-3)
      .map((msg: any) => msg.content)
      .join('\n')
    const retrievalQuery = trim(recentUserText || userQuery, 2000)

    // Search for relevant context using RAG with strict AIM definition
    let ragContext = ''
    let contextSnapshot: { text: string; sectionIds: string[] } = { text: '', sectionIds: [] }
    let hasRagResults = false
    const savedSnapshot = userId && json.id ? await loadContextSnapshot(supabase, json.id, userId) : null
    try {
      // Check if required environment variables are available for RAG
      if (!process.env.OPENAI_API_KEY || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.log('Missing environment variables for RAG - skipping vector search')
        ragContext = '\n\nINSTRUCTION: Apply the core AIM three-source model (Appetites/Intrinsic/Mimetic) and first principles to answer fully. DO NOT invent or hallucinate content beyond the established AIM taxonomy.'
      } else {
        const vectorSearch = new VectorSearch()
        // Dynamic threshold based on query length - more permissive for complex questions
        const threshold = userQuery.length > 150 ? 0.35 : 0.4
        // A named glossary term brings its definition and chapter. Search would
        // let other passages compete with that definition, so it stays out.
        const treatise = await treatiseContext(retrievalQuery, settings.treatiseContextMaxChars).catch(error => {
          console.error('Treatise context error:', error)
          return { text: '', grounded: false, sectionIds: [] as string[] }
        })
        if (savedSnapshot?.text) {
          contextSnapshot = extendContextSnapshot(savedSnapshot, treatise, settings.treatiseContextMaxChars)
          ragContext = contextSnapshot.text
          hasRagResults = true
        } else {
          const results = treatise.grounded
            ? []
            : await vectorSearch
                .searchSimilarDocuments(retrievalQuery, 24, 'rag', threshold, 'aim-treatise')
                .catch(error => {
                  console.error('Vector search error:', error)
                  return []
                })
          hasRagResults = results.length > 0 || treatise.text.length > 0
          if (hasRagResults) {
            const filteredResults = results.map(result => ({
              ...result,
              chunk_text: result.chunk_text.replace(/Chantal McNaught/gi, 'a PhD candidate')
            }))
            const contextBlock = [treatise.text, prepareRagContext(filteredResults, userQuery.length)]
              .filter(Boolean)
              .join('\n\n---\n\n')
              .replace(/Chantal McNaught/gi, 'a PhD candidate')
            const grounding = treatise.grounded
              ? DEFINITION_RULE
              : `**STRICT RAG GROUNDING (CRITICAL):**
1. Answer based ONLY on the Context above - do not import external definitions.
2. If a term appears in the Context (like "Quantum Epistemology"), use ONLY the AIM definition from the Context.
3. DO NOT conflate AIM terminology with similar terms from other fields.
4. Quote or closely paraphrase the Context when possible to ensure accuracy.
5. If the Context does not fully address the question, state what IS covered and what is missing.
6. DO NOT invent analogies or connections not explicitly present in the Context.`
            ragContext = `Context:\n${contextBlock}\n\n${grounding}`
            contextSnapshot = { text: ragContext, sectionIds: treatise.sectionIds }
          } else {
            ragContext = `\n\nINSTRUCTION: No specific AIM research documents matched this query. Apply the core AIM three-source model (Appetites/Intrinsic/Mimetic) and first principles to answer fully. DO NOT invent or hallucinate content beyond the established AIM taxonomy.`
            contextSnapshot = { text: ragContext, sectionIds: [] }
          }
        }
      }
    } catch (error) {
      console.error('RAG search error:', error)
      // Continue without context if RAG fails - but with strict grounding
      ragContext = '\n\nINSTRUCTION: Apply the core AIM three-source model (Appetites/Intrinsic/Mimetic) and first principles to answer fully. DO NOT invent or hallucinate content beyond the established AIM taxonomy.'
    }

    // Build system message with RAG context
    // Same text and order as before, split into blocks so the stable prefix
    // (system prompt, then the Treatise context) can be cached. The mode
    // instructions change between the first reply and follow-ups, so they come
    // last and are not cached.
    const continuing = messages.some((msg: { role?: string }) => msg.role === 'assistant')
    const modeInstructions = mode === 'academic'
      ? `${ACADEMIC_STYLE}\n${continuing ? ACADEMIC_CONTINUE : ACADEMIC_FIRST}`.trim()
      : mode === 'layperson'
        ? (continuing ? LAYPERSON_CONTINUE : LAYPERSON_FIRST).trim()
        : ''
    const model = settings.models[provider]

    const chatMessages = messages
      .filter((msg: any) => msg?.role === 'user' || msg?.role === 'assistant')
      .filter((msg: any) => typeof msg?.content === 'string')
      .map((msg: any) => ({
        role: msg.role === 'user' ? ('user' as const) : ('assistant' as const),
        content: msg.content as string
      }))

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'api_key_required', message: 'Add an API key in your profile.' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      )
    }

    console.log('Making chat request:', {
      provider,
      payer,
      model,
      userId,
      messageCount: chatMessages.length,
      contextChars: ragContext.length,
      country: req.headers.get('x-vercel-ip-country'),
      userAgent: req.headers.get('user-agent'),
      timestamp: new Date().toISOString()
    })

    let fullContent = ''
    let inputTokens = 0
    let outputTokens = 0
    let cachedTokens = 0
    try {
      const result = await generate(provider, {
        apiKey,
        model,
        systemPrompt: AIM_SYSTEM_PROMPT,
        treatiseContext: ragContext.trim(),
        modeInstructions,
        messages: chatMessages,
        maxTokens: settings.maxOutputTokens,
        cache: settings.cache[provider],
        anthropicCacheTtl: settings.anthropicCacheTtl,
        promptCacheKey: typeof json.id === 'string' ? json.id : undefined
      })
      fullContent = result.text
      inputTokens = result.inputTokens
      outputTokens = result.outputTokens
      cachedTokens = result.cachedTokens
    } catch (error) {
      const code = error instanceof LlmError ? error.code : 'unavailable'
      console.error('Chat provider error:', {
        code,
        provider,
        model,
        userId,
        chatId: json.id,
        messageCount: messages.length,
        timestamp: new Date().toISOString()
      })
      await recordChatUsage({
        userId,
        provider,
        model,
        inputTokens: 0,
        outputTokens: 0,
        cachedTokens: 0,
        contextChars: ragContext.length,
        outcome: `refused:${code}`,
        ipHash
      })
      return new Response(
        JSON.stringify({ error: 'provider_error', message: readerMessage(code) }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      )
    }

    console.log('Chat response received', {
      provider,
      model,
      userId,
      inputTokens,
      outputTokens,
      cachedTokens,
      contextChars: ragContext.length
    })

    // Section citations are turned into treatise links when the reply is shown.

    // Save chat to database (signed-in users only; guest chats are ephemeral)
    if (userId) {
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
          contextSnapshot,
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

    await recordChatUsage({
      userId,
      provider,
      model,
      inputTokens,
      outputTokens,
      cachedTokens,
      contextChars: ragContext.length,
      outcome: 'answered',
      ipHash
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
      apiUsed: 'Claude',
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
