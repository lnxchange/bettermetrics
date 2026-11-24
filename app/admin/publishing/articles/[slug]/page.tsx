import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/lib/db_types'
import { ArticleView } from '@/components/article-view'
import { ArticleHtml } from '@/lib/publishing/article-html'
import { MelbourneTime } from '@/lib/publishing/melbourne-time'
import { ArticleRecord } from '@/lib/publishing/public'
import { loadGlossaryIndex } from '@/lib/glossary'
import { loadCorpusIndex } from '@/lib/treatise'
import { SITE_URL } from '@/lib/site'

export const dynamic = 'force-dynamic'

interface PreviewProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PreviewProps): Promise<Metadata> {
  return {
    title: 'Article preview',
    robots: { index: false, follow: false },
    alternates: { canonical: `/admin/publishing/articles/${params.slug}` }
  }
}

function readingMinutes(content: string) {
  return Math.max(1, Math.ceil(content.split(/\s+/).filter(Boolean).length / 200))
}

function note(article: ArticleRecord) {
  const slot = article.scheduled_publish_at ? MelbourneTime.label(new Date(article.scheduled_publish_at)) : null
  const status = article.editorial_status || article.status || 'draft'
  if (article.preview_only) {
    return `Preview only. This is a test article and it is not public. File status: ${status}.${slot ? ` The file names ${slot}, and that slot is not reserved.` : ''} Nothing in this workflow is published before 11 January 2027.`
  }
  if (slot) {
    return `Preview. This is not the public page. File status: ${status}. Slot: ${slot}. Nothing is public before 11 January 2027, and the kill switch can hold it after that.`
  }
  return `Preview. This is not the public page. File status: ${status}. It has no public slot yet. Nothing is published before 11 January 2027.`
}

export default async function PreviewArticlePage({ params }: PreviewProps) {
  const supabase = createServerComponentClient<Database>({ cookies })
  const { data } = await supabase.from('articles').select('*').eq('slug', params.slug).maybeSingle()
  const article = data as ArticleRecord | null
  if (!article) notFound()

  const corpus = article.pipeline === 'corpus' || article.preview_only === true
  const [index, glossary] = corpus ? await Promise.all([loadCorpusIndex(), loadGlossaryIndex()]) : [undefined, []]
  const html = ArticleHtml.render(article.content ?? '', {
    corpus,
    siteUrl: SITE_URL,
    index,
    terms: glossary.map(entry => ({ term: entry.term, slug: entry.slug }))
  })

  return (
    <div>
      <p className="sr-only">
        <Link href="/admin/publishing">Back to the schedule</Link>
      </p>
      <ArticleView
        mode="preview"
        title={article.title}
        slug={article.slug}
        author={article.author}
        date={article.scheduled_publish_at || article.published_at || article.written_at}
        readingMinutes={readingMinutes(article.content || '')}
        category={article.category}
        tags={article.tags}
        imageUrl={article.featured_image_url}
        imageAlt={article.image_alt}
        html={html}
        treatiseRefs={article.treatise_refs}
        sourcePapers={article.source_papers}
        previewNote={note(article)}
        isAdmin={false}
        editHref={null}
        siteUrl={SITE_URL}
      />
    </div>
  )
}
