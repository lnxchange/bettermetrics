import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/lib/db_types'
import PDFDownloadButton from '@/components/PDFDownloadButton'
import Link from 'next/link'
import '@/styles/print.css'

interface ArticlePageProps {
  params: {
    slug: string
  }
}

async function getArticleBySlug(slug: string) {
  const cookieStore = cookies()
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookieStore
  })

  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !data) {
    return null
  }

  return data
}

export async function generateMetadata({ 
  params 
}: ArticlePageProps): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug)
  
  if (!article) {
    return { title: 'Article Not Found' }
  }
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://usebettermetrics.com'
  const articleUrl = `${siteUrl}/articles/${params.slug}`
  
  return {
    title: article.meta_title || article.title,
    description: article.meta_description || undefined,
    authors: article.author ? [{ name: article.author }] : undefined,
    openGraph: {
      title: article.meta_title || article.title,
      description: article.meta_description || undefined,
      type: 'article',
      url: articleUrl,
      images: article.featured_image_url ? [article.featured_image_url] : [],
      publishedTime: article.published_at || article.created_at,
      modifiedTime: article.updated_at,
      authors: article.author ? [article.author] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.meta_title || article.title,
      description: article.meta_description || undefined,
      images: article.featured_image_url ? [article.featured_image_url] : [],
    },
    alternates: {
      canonical: article.canonical_url || articleUrl,
    },
  }
}

export default async function ArticlePage({ 
  params 
}: ArticlePageProps) {
  const article = await getArticleBySlug(params.slug)
  
  if (!article || article.status !== 'published') {
    notFound()
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://usebettermetrics.com'
  
  // Generate structured data
  const structuredData = article.structured_data || {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.meta_description,
    "datePublished": article.published_at || article.created_at,
    "dateModified": article.updated_at,
    "author": {
      "@type": "Person",
      "name": article.author || "Yule Guttenbeil"
    },
    "image": article.featured_image_url,
    "publisher": {
      "@type": "Organization",
      "name": "AIM Framework",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/AIM Logo.png`
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
        <nav className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-sm no-print">
          <ol className="flex items-center space-x-2 text-gray-600">
            <li><Link href="/" className="hover:text-primary-600">Home</Link></li>
            <li>/</li>
            <li><Link href="/articles" className="hover:text-primary-600">Articles</Link></li>
            <li>/</li>
            <li className="text-gray-900">{article.title}</li>
          </ol>
        </nav>

        {/* Article Header */}
        <header className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 article-meta">
          <h1 className="article-title text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {article.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
            {article.author && (
              <div className="flex items-center author">
                <span className="font-semibold">By {article.author}</span>
              </div>
            )}
            {article.published_at && (
              <time className="date" dateTime={article.published_at}>
                {new Date(article.published_at).toLocaleDateString('en-US', {
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
          <div 
            className="prose prose-lg max-w-none prose-headings:font-bold prose-h2:text-3xl prose-h3:text-2xl prose-a:text-primary-600 prose-a:hover:text-primary-700"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>

        {/* Article Footer */}
        <footer className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t no-print">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Share this article</h3>
              <div className="flex gap-3 social-share">
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

