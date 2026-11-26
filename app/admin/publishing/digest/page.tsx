import Link from 'next/link'
import { PublicArticles } from '@/lib/publishing/public'
import { PublishingSettings } from '@/lib/publishing/settings'
import { WeeklyDigest } from '@/lib/publishing/digest'
import { MelbourneTime } from '@/lib/publishing/melbourne-time'
import { SITE_URL } from '@/lib/site'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Weekly digest',
  robots: { index: false, follow: false }
}

interface DigestPageProps {
  searchParams?: { week?: string }
}

export default async function DigestPage({ searchParams }: DigestPageProps) {
  const weekText = searchParams?.week
  const weekOf =
    weekText && /^\d{4}-\d{2}-\d{2}$/.test(weekText)
      ? MelbourneTime.fromLocal(Number(weekText.slice(0, 4)), Number(weekText.slice(5, 7)), Number(weekText.slice(8, 10)), 12, 0)
      : new Date()
  const config = await PublishingSettings.gate()
  const articles = await PublicArticles.list(config)
  const digest = WeeklyDigest.build(
    articles.map(article => ({
      title: article.title,
      slug: article.slug,
      summary: article.meta_description || '',
      publishedAt: new Date(article.published_at || article.scheduled_publish_at || 0)
    })),
    weekOf,
    SITE_URL
  )

  return (
    <div className="min-h-screen bg-white">
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <p className="text-sm text-gray-500">
          <Link href="/admin/publishing" className="hover:underline">
            Schedule
          </Link>
        </p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">Weekly digest</h1>
        <p className="mt-3 text-gray-600">
          The week of {MelbourneTime.dayLabel(digest.start)}, Melbourne time. Copy the Markdown into Substack. This page does not post it.
        </p>
        <h2 className="mt-8 text-lg font-semibold text-gray-900">Markdown</h2>
        <textarea
          readOnly
          defaultValue={digest.markdown}
          className="mt-3 h-80 w-full rounded-md border border-gray-300 p-3 font-mono text-sm"
          aria-label="Weekly digest in Markdown"
        />
        <h2 className="mt-8 text-lg font-semibold text-gray-900">Preview</h2>
        <div
          className="prose mt-3 max-w-none"
          dangerouslySetInnerHTML={{ __html: digest.html }}
        />
      </section>
    </div>
  )
}
