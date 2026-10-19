import Link from 'next/link'
import {
  formatSourceDate,
  loadTreatiseChapters,
  TREATISE_PARTS,
  TreatiseChapterSummary
} from '@/lib/treatise'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'The Treatise',
  description:
    'The AIM Treatise, chapter by chapter. Each page is the current working text, and a glossary derivation opens the section that establishes the term.'
}

function ChapterList({ chapters }: { chapters: TreatiseChapterSummary[] }) {
  return (
    <ol className="divide-y divide-gray-100 rounded-lg border border-gray-200 bg-white">
      {chapters.map(chapter => (
        <li key={chapter.slug}>
          <Link href={chapter.href} className="flex items-baseline gap-4 px-5 py-4 hover:bg-gray-50">
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
  const chapters = await loadTreatiseChapters()
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
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            The treatise
          </h1>
          <p className="text-lg text-gray-700">
            Twenty chapters and the appendices, in the current working text. A glossary entry
            that names a chapter and section opens that place.
          </p>
          <p className="mt-3 text-sm text-gray-500">
            {latest ? `Latest text ${formatSourceDate(latest)}. ` : ''}
            The book is unfinished. These pages change when the source text changes.
          </p>
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
                <ChapterList chapters={items} />
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
