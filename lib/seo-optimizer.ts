import Anthropic from '@anthropic-ai/sdk'
import { SITE_LOGO_PATH, SITE_NAME, SITE_URL } from '@/lib/site'

/**
 * SEO Optimization Module using Claude API.
 *
 * Generates SEO metadata including:
 * - Meta title (50-60 chars)
 * - Meta description (150-160 chars)
 * - Keywords
 * - JSON-LD structured data
 * - Heading recommendations
 */

interface SEOOptimizationResult {
  metaTitle: string
  metaDescription: string
  keywords: string[]
  structuredData: any
  recommendations?: {
    headings?: string
    internalLinks?: string[]
  }
  /** True when Claude produced the result; false when the heuristic fallback did. */
  generated: boolean
}

interface OptimizationInput {
  title: string
  content: string
  slug: string
  author?: string
  category?: string
  publishedAt?: string
}

// Model used for metadata generation. Overridable so the scheduled job can be
// pointed at a newer model without a code change. `temperature` is deliberately
// not sent: current Anthropic models reject it.
export const SEO_MODEL = process.env.SEO_CLAUDE_MODEL || 'claude-opus-5-5'

const MAX_CONTENT_CHARS = 6000

function stripMarkdown(text: string) {
  return text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`~|]/g, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export async function optimizeArticleSEO(
  input: OptimizationInput
): Promise<SEOOptimizationResult> {
  const { title, content, slug, author, category, publishedAt } = input
  const plain = stripMarkdown(content || '')
  const excerpt = plain.substring(0, MAX_CONTENT_CHARS)

  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('Missing ANTHROPIC_API_KEY')
    }
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    const response = await anthropic.messages.create({
      model: SEO_MODEL,
      max_tokens: 1200,
      system:
        `You write search metadata for ${SITE_NAME} (${SITE_URL}), the home of the AIM Framework, a general theory of human motivation with three sources: Appetites (A), Intrinsic Motivation (I) and Mimetic Desire (M). ` +
        'Write for a reader searching Google, not for the author. Be specific and plain; no hype, no clickbait, no emoji. ' +
        'Use British English. Return JSON only.',
      messages: [
        {
          role: 'user',
          content: `Article title: ${title}
Slug: ${slug}
Category: ${category || 'General'}
Content (plain text, may be truncated):
${excerpt}${plain.length > MAX_CONTENT_CHARS ? ' …' : ''}

Return a JSON object with exactly this shape:
{
  "metaTitle": "50 to 60 characters. Describe the article's actual subject. Do not append the site name; it is added automatically.",
  "metaDescription": "140 to 160 characters. One or two sentences stating what the article argues or explains and for whom.",
  "keywords": ["5 to 8 specific search phrases a reader would type"],
  "structuredData": {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "the metaTitle, or a close variant up to 110 characters",
    "description": "the metaDescription",
    "keywords": "comma separated keywords",
    "about": ["2 to 4 schema.org Thing names the article is about"],
    "author": { "@type": "Person", "name": "${author || 'Yule Guttenbeil'}" },
    "datePublished": "${publishedAt || new Date().toISOString()}"
  },
  "recommendations": {
    "headings": "one sentence on H2/H3 structure improvements, or an empty string",
    "internalLinks": ["slugs or topics on this site worth linking to"]
  }
}`
        }
      ]
    })

    const contentBlock = response.content.find(block => block.type === 'text')
    const contentText = contentBlock && contentBlock.type === 'text' ? contentBlock.text : ''
    if (!contentText) {
      throw new Error('No text content in Claude response')
    }

    // Extract JSON from response (handle potential markdown code blocks)
    let jsonText = contentText.trim()
    const fenced = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (fenced) jsonText = fenced[1].trim()
    const firstBrace = jsonText.indexOf('{')
    const lastBrace = jsonText.lastIndexOf('}')
    if (firstBrace > 0 || lastBrace < jsonText.length - 1) {
      jsonText = jsonText.slice(firstBrace, lastBrace + 1)
    }

    const result = JSON.parse(jsonText)
    const metaTitle = typeof result.metaTitle === 'string' && result.metaTitle.trim() ? result.metaTitle.trim() : title
    const metaDescription =
      typeof result.metaDescription === 'string' && result.metaDescription.trim()
        ? result.metaDescription.trim()
        : excerpt.substring(0, 157).trim() + '…'

    return {
      metaTitle: metaTitle.substring(0, 70),
      metaDescription: metaDescription.substring(0, 180),
      keywords: Array.isArray(result.keywords) ? result.keywords.filter((k: unknown) => typeof k === 'string') : [],
      structuredData: withPublisher(result.structuredData || generateDefaultStructuredData(input), input),
      recommendations: result.recommendations,
      generated: true
    }
  } catch (error) {
    console.error('SEO optimization error:', error)

    // Return fallback SEO data. Callers that persist results should check
    // `generated` and skip fallbacks rather than store them.
    return {
      metaTitle: title.substring(0, 60),
      metaDescription: excerpt.substring(0, 157).trim() + (excerpt.length > 157 ? '…' : ''),
      keywords: [],
      structuredData: generateDefaultStructuredData({ ...input, publishedAt }),
      recommendations: {
        headings: 'Unable to generate recommendations',
        internalLinks: []
      },
      generated: false
    }
  }
}

function publisher() {
  return {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}${SITE_LOGO_PATH}`
    }
  }
}

function withPublisher(structuredData: any, input: OptimizationInput) {
  return {
    ...structuredData,
    '@context': 'https://schema.org',
    '@type': structuredData?.['@type'] || 'Article',
    publisher: publisher(),
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/articles/${input.slug}` }
  }
}

function generateDefaultStructuredData(input: OptimizationInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.title,
    author: {
      '@type': 'Person',
      name: input.author || 'Yule Guttenbeil'
    },
    datePublished: input.publishedAt || new Date().toISOString(),
    publisher: publisher(),
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/articles/${input.slug}` }
  }
}

export async function optimizeBatch(articles: OptimizationInput[], delayMs: number = 2000): Promise<Map<string, SEOOptimizationResult>> {
  const results = new Map<string, SEOOptimizationResult>()
  
  for (const article of articles) {
    try {
      const result = await optimizeArticleSEO(article)
      results.set(article.slug, result)
      
      // Rate limiting delay
      if (delayMs > 0) {
        await new Promise(resolve => setTimeout(resolve, delayMs))
      }
    } catch (error) {
      console.error(`Failed to optimize ${article.slug}:`, error)
    }
  }
  
  return results
}
