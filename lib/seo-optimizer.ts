import Anthropic from '@anthropic-ai/sdk'

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
}

interface OptimizationInput {
  title: string
  content: string
  slug: string
  author?: string
  category?: string
  publishedAt?: string
}

export async function optimizeArticleSEO(
  input: OptimizationInput
): Promise<SEOOptimizationResult> {
  const { title, content, slug, author, category, publishedAt } = input

  // Truncate content for API call (first 2000 chars should be sufficient for SEO analysis)
  const truncatedContent = content.substring(0, 2000)

  try {
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    })

    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('Missing ANTHROPIC_API_KEY')
    }

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-latest',
      max_tokens: 1200,
      temperature: 0.2,
      messages: [
        {
          role: 'user',
          content: `Analyze this article and provide SEO optimization in JSON format.

Article Title: ${title}
Article Slug: ${slug}
Article Category: ${category || 'General'}
Article Content: ${truncatedContent}${content.length > 2000 ? '... [truncated]' : ''}

Provide a JSON response ONLY (no additional text) with this exact structure:
{
  "metaTitle": "optimized SEO title 50-60 chars",
  "metaDescription": "compelling SEO description 150-160 chars",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "structuredData": {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "article headline",
    "description": "article description",
    "author": {
      "@type": "Person",
      "name": "${author || 'Yule Guttenbeil'}"
    },
    "datePublished": "${publishedAt || new Date().toISOString()}",
    "publisher": {
      "@type": "Organization",
      "name": "AIM Framework",
      "logo": {
        "@type": "ImageObject",
        "url": "https://usebettermetrics.com/logo.png"
      }
    }
  },
  "recommendations": {
    "headings": "Brief suggestions for H2/H3 structure",
    "internalLinks": ["topic1", "topic2"]
  }
}`
        }
      ]
    })

    const contentBlock = response.content.find(block => block.type === 'text')
    const contentText = contentBlock && contentBlock.type === 'text'
      ? contentBlock.text
      : ''

    if (!contentText) {
      throw new Error('No text content in Claude response')
    }

    // Extract JSON from response (handle potential markdown code blocks)
    let jsonText = contentText.trim()
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\s*/, '').replace(/```\s*$/, '')
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\s*/, '').replace(/```\s*$/, '')
    }

    const result = JSON.parse(jsonText)

    // Validate and return
    return {
      metaTitle: result.metaTitle || title,
      metaDescription: result.metaDescription || '',
      keywords: result.keywords || [],
      structuredData: result.structuredData || generateDefaultStructuredData(input),
      recommendations: result.recommendations
    }
  } catch (error) {
    console.error('SEO optimization error:', error)
    
    // Return fallback SEO data
    return {
      metaTitle: title.substring(0, 60),
      metaDescription: truncatedContent.substring(0, 160).replace(/<[^>]*>/g, ''),
      keywords: [],
      structuredData: generateDefaultStructuredData({ ...input, publishedAt }),
      recommendations: {
        headings: 'Unable to generate recommendations',
        internalLinks: []
      }
    }
  }
}

function generateDefaultStructuredData(input: OptimizationInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": input.title,
    "author": {
      "@type": "Person",
      "name": input.author || "Yule Guttenbeil"
    },
    "datePublished": input.publishedAt || new Date().toISOString(),
    "publisher": {
      "@type": "Organization",
      "name": "AIM Framework",
      "logo": {
        "@type": "ImageObject",
        "url": "https://usebettermetrics.com/logo.png"
      }
    }
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

