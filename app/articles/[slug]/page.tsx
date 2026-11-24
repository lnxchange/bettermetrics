import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { cached } from '@/lib/cached'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { Database } from '@/lib/db_types'
import { auth } from '@/auth'
import { ArticleView } from '@/components/article-view'
import { ArticleHtml } from '@/lib/publishing/article-html'
import { ArticleGate } from '@/lib/publishing/gate'
import { PublishingSettings } from '@/lib/publishing/settings'
import { ArticleRecord, LegacyRedirect } from '@/lib/publishing/public'
import { loadGlossaryIndex } from '@/lib/glossary'
import { loadCorpusIndex } from '@/lib/treatise'
import { SITE_LOGO_PATH, SITE_NAME, SITE_URL, metaDescription } from '@/lib/site'
import '@/styles/print.css'

interface ArticlePageProps {
  params: {
    slug: string
  }
}

// Public article content is read with the anon key and cached for an hour so
// the Supabase round-trip is not paid on every request. The go-live gate is
// applied on each request, outside this cache.
const getArticleBySlug = cached(
  async (slug: string) => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) return null
    const supabase = createClient<Database>(url, key, {
      auth: { persistSession: false, autoRefreshToken: false }
    })
    const { data, error } = await supabase.from('articles').select('*').eq('slug', slug).maybeSingle()
    if (error || !data) return null
    return data as ArticleRecord
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

function readingMinutes(content: string) {
  return Math.max(1, Math.ceil(content.split(/\s+/).filter(Boolean).length / 200))
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug)
  const config = await PublishingSettings.gate()
  if (!article || !ArticleGate.isPublic(ArticleGate.fromRow(article), config)) {
    return { title: 'Article Not Found', robots: { index: false, follow: false } }
  }

  const articleUrl = `${SITE_URL}/articles/${params.slug}`
  const title = cleanMetaTitle(article)
  const fromOptimiser = title !== article.title
  const description = article.meta_description ? metaDescription(article.meta_description) : undefined
  const alt = article.image_alt || title
  const image = {
    url: `/articles/${params.slug}/og`,
    width: 1200,
    height: 630,
    alt
  }

  return {
    title: fromOptimiser ? { absolute: title } : title,
    description,
    authors: article.author ? [{ name: article.author }] : undefined,
    openGraph: {
      title,
      description,
      type: 'article',
      url: articleUrl,
      images: [image],
      publishedTime: article.written_at || article.published_at || article.scheduled_publish_at || article.created_at || undefined,
      modifiedTime: article.updated_at || undefined,
      authors: article.author ? [article.author] : undefined
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image]
    },
    alternates: {
      canonical: article.canonical_url || articleUrl
    }
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const cookieStore = cookies()
  const [article, session] = await Promise.all([getArticleBySlug(params.slug), auth({ cookieStore })])
  const config = await PublishingSettings.gate()
  const visible = Boolean(article && ArticleGate.isPublic(ArticleGate.fromRow(article), config))

  if (!visible) {
    const target = await LegacyRedirect.target(params.slug)
    if (target) redirect(target)
    notFound()
  }
  if (!article) notFound()

  const isAdmin = session?.user?.user_metadata?.is_admin === true
  const corpus = article.pipeline === 'corpus'
  const [index, glossary] = corpus
    ? await Promise.all([loadCorpusIndex(), loadGlossaryIndex()])
    : [undefined, []]
  const html = ArticleHtml.render(article.content ?? '', {
    corpus,
    siteUrl: SITE_URL,
    index,
    terms: glossary.map(entry => ({ term: entry.term, slug: entry.slug }))
  })

  const imagePath = article.featured_image_url
  const absoluteImage = imagePath
    ? imagePath.startsWith('http')
      ? imagePath
      : `${SITE_URL}${imagePath}`
    : `${SITE_URL}/aim-og.png`
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.meta_description,
    datePublished: article.written_at || article.published_at || article.scheduled_publish_at || article.created_at,
    dateModified: article.updated_at,
    author: {
      '@type': 'Person',
      '@id': `${SITE_URL}/#YuleGuttenbeil`,
      name: article.author || 'Yule Guttenbeil'
    },
    image: absoluteImage,
    ...(typeof article.structured_data === 'object' && article.structured_data ? article.structured_data : {}),
    publisher: {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}${SITE_LOGO_PATH}`
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/articles/${params.slug}`
    }
  }
  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Articles', item: `${SITE_URL}/articles` },
      { '@type': 'ListItem', position: 3, name: article.title, item: `${SITE_URL}/articles/${params.slug}` }
    ]
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }} />
      <ArticleView
        mode="public"
        title={article.title}
        slug={params.slug}
        author={article.author}
        date={article.written_at || article.published_at || article.scheduled_publish_at}
        readingMinutes={readingMinutes(article.content || '')}
        category={article.category}
        tags={article.tags}
        imageUrl={article.featured_image_url}
        imageAlt={article.image_alt}
        html={html}
        treatiseRefs={article.treatise_refs}
        sourcePapers={article.source_papers}
        previewNote={null}
        isAdmin={isAdmin}
        editHref={`/admin/articles/${article.id}/edit`}
        siteUrl={SITE_URL}
      />
    </>
  )
}
