/**
 * SEO Optimization Module using Perplexity API
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
}

export async function optimizeArticleSEO(
  input: OptimizationInput
): Promise<SEOOptimizationResult> {
  const { title, content, slug, author, category } = input

  // Truncate content for API call (first 2000 chars should be sufficient for SEO analysis)
  const truncatedContent = content.substring(0, 2000)

  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [{
          role: 'user',
          content: `Analyze this article and provide SEO optimization in JSON format.

Article Title: ${title}
Article Content: ${truncatedContent}${content.length > 2000 ? '... [truncated]' : ''}

Provide a JSON response ONLY (no additional text) with the following structure:
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
    "datePublished": "${new Date().toISOString()}",
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
        }],
        max_tokens: 1000,
        temperature: 0.3
      })
    })

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    const content_text = data.choices?.[0]?.message?.content

    if (!content_text) {
      throw new Error('No content in Perplexity response')
    }

    // Extract JSON from response (handle potential markdown code blocks)
    let jsonText = content_text.trim()
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
      structuredData: generateDefaultStructuredData(input),
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
    "datePublished": new Date().toISOString(),
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

