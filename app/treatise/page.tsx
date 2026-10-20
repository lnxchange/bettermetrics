import { Metadata } from 'next'
import Link from 'next/link'
import { FrameworkCore } from '@/components/framework-core'
import { SITE_OG_IMAGE } from '@/lib/site'
import {
  formatSourceDate,
  loadTreatiseChapters,
  loadTreatiseDraft,
  TREATISE_PARTS,
  TreatiseChapterSummary
} from '@/lib/treatise'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: { absolute: 'The AIM Treatise: A General Theory of Human Motivation' },
  description:
    'The AIM Treatise: a general theory of human motivation built on Appetites, Intrinsic Motivation and Mimetic Desire. The working text, chapter by chapter.',
  alternates: { canonical: '/treatise' },
  openGraph: {
    title: 'The AIM Treatise: A General Theory of Human Motivation',
    description: 'The current working text of the book, chapter by chapter.',
    url: '/treatise',
    images: [SITE_OG_IMAGE],
    type: 'book'
  }
}

const frameworkSlugs = new Set(['4', 'appendix-a'])

function ChapterList({ chapters }: { chapters: TreatiseChapterSummary[] }) {
  return (
    <ol className="divide-y divide-gray-100 rounded-lg border border-gray-200 bg-white">
      {chapters.map(chapter => (
        <li key={chapter.slug}>
          <Link
            href={chapter.href}
            className={`flex items-baseline gap-4 px-5 py-4 hover:bg-gray-50 ${
              frameworkSlugs.has(chapter.slug) ? 'bg-blue-50/70' : ''
            }`}
          >
            <span className="w-28 shrink-0 text-sm font-semibold text-blue-700">{chapter.label}</span>
            <span className="min-w-0 flex-1 text-gray-900">{chapter.title}</span>
            {chapter.source_date && (
              <span className="shrink-0 text-sm text-gray-500">
                {formatSourceDate(chapter.source_date)}
              </span>
            )}
          </Link>
        </li>
      ))}
    </ol>
  )
}

export default async function TreatiseIndexPage() {
  const [chapters, draft] = await Promise.all([loadTreatiseChapters(), loadTreatiseDraft()])
  const loaded = chapters.filter(chapter => chapter.slug !== '2')
  const latest = loaded.reduce<string | null>((newest, chapter) => {
    if (!chapter.source_date) return newest
    if (!newest || chapter.source_date > newest) return chapter.source_date
    return newest
  }, null)

  return (
    <div className="bg-white">
      <section className="border-b border-gray-100 bg-gradient-to-br from-blue-50 via-white to-gray-50 py-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
            The treatise
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            <span className="block">A Unifying General Theory of Human Motivation</span>
            <span className="mt-2 block text-xl font-medium text-gray-700 sm:text-2xl">
              Appetites, Intrinsic Motivation and Mimetic Desire
            </span>
          </h1>
          <p className="mt-5 text-lg text-gray-700">
            The book, in the current working text. A glossary entry that names a chapter and
            section opens that place.
          </p>
          <p className="mt-3 text-sm text-gray-500">
            {latest ? `Latest text ${formatSourceDate(latest)}. ` : ''}
            The book is unfinished. These pages change when the source text changes.
          </p>
          <FrameworkCore chapters={chapters} className="mt-8" />
          {draft && (
            <div className="mt-6">
              <a
                href={draft.url}
                download={draft.filename}
                className="inline-flex items-center rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
              >
                Download the draft ebook
              </a>
              <p className="mt-2 text-sm text-gray-500">
                Draft of {formatSourceDate(draft.sourceDate)}. The book is unfinished.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-3xl space-y-12 px-4 sm:px-6 lg:px-8">
          {loaded.length === 0 && (
            <p className="text-gray-600">
              The chapters have not been loaded yet. Chapter 2 is available in the glossary.
            </p>
          )}
          {TREATISE_PARTS.map(part => {
            const items = chapters.filter(chapter => chapter.part === part.id)
            if (items.length === 0) return null
            return (
              <div key={part.id}>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">{part.title}</h2>
                {part.id === 'appendix' && (
                  <p className="-mt-2 mb-4 text-gray-600">
                    Appendix A belongs with Chapter 4: together they are the framework. The
                    appendices after it test that framework or follow it into a particular case.
                  </p>
                )}
                <ChapterList chapters={items} />
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
