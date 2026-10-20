import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cached } from '@/lib/cached'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { Database } from '@/lib/db_types'
import { auth } from '@/auth'
import PDFDownloadButton from '@/components/PDFDownloadButton'
import Link from 'next/link'
import { marked } from 'marked'
import { ArticleContent } from '@/components/article-content'
import { renderMathInHtml } from '@/lib/render-math'
import { SITE_LOGO_PATH, SITE_NAME, SITE_URL, metaDescription } from '@/lib/site'
import '@/styles/print.css'

interface ArticlePageProps {
  params: {
    slug: string
  }
}

// Public article content is read with the anon key and cached for an hour so
// the Supabase round-trip is not paid on every request. Only published rows are
// served (checked below), so no private data passes through the cache.
const getArticleBySlug = cached(
  async (slug: string) => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) return null
    const supabase = createClient<Database>(url, key, {
      auth: { persistSession: false, autoRefreshToken: false }
    })
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .single()
    if (error || !data) return null
    return data
  },
  ['article-by-slug'],
  { revalidate: 3600, tags: ['articles'] }
)

function cleanMetaTitle(article: { meta_title: string | null; title: string }) {
  const candidate = article.meta_title?.trim()
  // Imported articles carried filename-style titles ("AIM-privacy-mimetic-paper").
  // Fall back to the real title until the SEO optimiser has rewritten them.
  if (!candidate || /^[\w-]+$/.test(candidate)) return article.title
  return candidate
}

export async function generateMetadata({ 
  params 
}: ArticlePageProps): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug)
  
  if (!article || article.status !== 'published') {
    return { title: 'Article Not Found', robots: { index: false } }
  }
  
  const siteUrl = SITE_URL
  const articleUrl = `${siteUrl}/articles/${params.slug}`
  const title = cleanMetaTitle(article)
  // Optimiser-written meta titles are complete (50-60 chars); only the
  // fallback to the article's own title takes the "| AIM Theory" suffix.
  const fromOptimiser = title !== article.title
  const description = article.meta_description ? metaDescription(article.meta_description) : undefined
  
  return {
    title: fromOptimiser ? { absolute: title } : title,
    description,
    authors: article.author ? [{ name: article.author }] : undefined,
    openGraph: {
      title,
      description,
      type: 'article',
      url: articleUrl,
      images: article.featured_image_url ? [article.featured_image_url] : ['/aim-og.png'],
      publishedTime: (article as any).written_at || article.published_at || article.created_at,
      modifiedTime: article.updated_at,
      authors: article.author ? [article.author] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: article.featured_image_url ? [article.featured_image_url] : ['/aim-og.png'],
    },
    alternates: {
      canonical: article.canonical_url || articleUrl,
    },
  }
}

export default async function ArticlePage({
  params
}: ArticlePageProps) {
  const cookieStore = cookies()
  const [article, session] = await Promise.all([
    getArticleBySlug(params.slug),
    auth({ cookieStore })
  ])

  if (!article || article.status !== 'published') {
    notFound()
  }

  const isAdmin = session?.user?.user_metadata?.is_admin === true

  const siteUrl = SITE_URL
  
  // Generate structured data. Stored structured_data (from the SEO optimiser)
  // takes precedence; the publisher and page identity are always normalised.
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.meta_description,
    "datePublished": (article as any).written_at || article.published_at || article.created_at,
    "dateModified": article.updated_at,
    "author": {
      "@type": "Person",
      "@id": `${siteUrl}/#YuleGuttenbeil`,
      "name": article.author || "Yule Guttenbeil"
    },
    "image": article.featured_image_url || `${siteUrl}/aim-og.png`,
    ...(typeof article.structured_data === 'object' && article.structured_data ? article.structured_data : {}),
    "publisher": {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      "name": SITE_NAME,
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}${SITE_LOGO_PATH}`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${siteUrl}/articles/${params.slug}`
    }
  }

  // Breadcrumb structured data
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": siteUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Articles",
        "item": `${siteUrl}/articles`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": article.title,
        "item": `${siteUrl}/articles/${params.slug}`
      }
    ]
  }

  // Calculate reading time (average 200 words per minute)
  const wordCount = article.content.split(/\s+/).length
  const readingTime = Math.ceil(wordCount / 200)

  let htmlContent = await marked.parse(article.content ?? '')

  // The page header already renders the article title as the single <h1>.
  // Imported documents usually repeat their title as a top-level heading, so
  // demote body <h1>s to <h2> to keep one H1 per page.
  htmlContent = htmlContent
    .replace(/<h1(\s[^>]*)?>/gi, '<h2$1>')
    .replace(/<\/h1>/gi, '</h2>')

  // Add external link icon and target="_blank" for links that go off-site
  const PRIVATE_LINK =
    /^https:\/\/ppl-ai-file-upload\.s3\.amazonaws\.com\/web\/direct-files/i
  htmlContent = htmlContent.replace(
    /<a\s+([^>]*href=["']([^"']+)["'][^>]*)>([\s\S]*?)<\/a>/gi,
    (match, attrs, href, text) => {
      if (PRIVATE_LINK.test(href.trim())) return text
      if (
        /^https?:\/\//i.test(href) &&
        !href.startsWith(siteUrl)
      ) {
        return `<a ${attrs} target="_blank" rel="noopener noreferrer">${text.trim()}<span class="inline-block ml-1 opacity-70" aria-hidden="true">↗</span></a>`
      }
      return match
    }
  )

  // Wrap tables in a scrollable container so they render correctly on all screen sizes
  htmlContent = htmlContent
    .replace(/<table>/g, '<div class="overflow-x-auto my-6"><table>')
    .replace(/<\/table>/g, '</table></div>')

  htmlContent = renderMathInHtml(htmlContent)

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />

      <article className="article-container min-h-screen bg-white print:px-4">
        {/* Breadcrumb Navigation */}
        <nav className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-sm no-print flex items-center justify-between">
          <ol className="flex items-center space-x-2 text-gray-600">
            <li><Link href="/" className="hover:text-primary-600">Home</Link></li>
            <li>/</li>
            <li><Link href="/articles" className="hover:text-primary-600">Articles</Link></li>
            <li>/</li>
            <li className="text-gray-900 truncate max-w-[8rem] sm:max-w-xs">{article.title}</li>
          </ol>
          {isAdmin && (
            <Link
              href={`/admin/articles/${article.id}/edit`}
              className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 no-print"
            >
              ✏️ Edit Article
            </Link>
          )}
        </nav>

        {/* Article Header */}
        <header className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 article-meta">
          <h1 className="article-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {article.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
            {article.author && (
              <div className="flex items-center author">
                <span className="font-semibold">By {article.author}</span>
              </div>
            )}
            {((article as any).written_at || article.published_at) && (
              <time className="date" dateTime={(article as any).written_at || article.published_at!}>
                {new Date((article as any).written_at || article.published_at!).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            )}
            <span>{readingTime} min read</span>
          </div>

          {article.category && (
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
                {article.category}
              </span>
            </div>
          )}

          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {article.tags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="no-print">
            <PDFDownloadButton slug={params.slug} title={article.title} />
          </div>
        </header>

        {/* Featured Image */}
        {article.featured_image_url && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
            <img
              src={article.featured_image_url}
              alt={article.title}
              className="w-full rounded-lg shadow-lg"
            />
          </div>
        )}

        {/* Article Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ArticleContent
            html={htmlContent}
            className="prose prose-lg max-w-none prose-headings:font-bold prose-h2:text-xl md:prose-h2:text-3xl prose-h3:text-lg md:prose-h3:text-2xl prose-a:text-primary-600 prose-a:hover:text-primary-700"
          />
        </div>

        {/* Article Footer */}
        <footer className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t no-print">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Share this article</h3>
              <div className="flex flex-wrap gap-3 social-share">
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(siteUrl + '/articles/' + params.slug)}&text=${encodeURIComponent(article.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 transition"
                >
                  Share on X
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(siteUrl + '/articles/' + params.slug)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 transition"
                >
                  Share on LinkedIn
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(siteUrl + '/articles/' + params.slug)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 transition"
                >
                  Share on Facebook
                </a>
              </div>
            </div>
          </div>
        </footer>
      </article>
    </>
  )
}

