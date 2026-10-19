import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { TreatiseChapterView } from '@/components/treatise-chapter'
import { formatSourceDate, loadTreatiseChapter, loadTreatiseChapters } from '@/lib/treatise'

export const dynamic = 'force-dynamic'

interface TreatiseChapterPageProps {
  params: { slug: string }
  searchParams?: { section?: string }
}

export async function generateMetadata({ params }: TreatiseChapterPageProps): Promise<Metadata> {
  if (params.slug === '2') {
    return { title: 'Glossary' }
  }
  const chapter = await loadTreatiseChapter(params.slug)
  if (!chapter) return { title: 'Treatise' }
  return {
    title: `${chapter.label}. ${chapter.title}`,
    description: `Current working text of ${chapter.label} of the AIM Treatise: ${chapter.title}.`
  }
}

export default async function TreatiseChapterPage({ params, searchParams }: TreatiseChapterPageProps) {
  if (params.slug === '2') redirect('/glossary')

  const [chapter, chapters] = await Promise.all([
    loadTreatiseChapter(params.slug),
    loadTreatiseChapters()
  ])
  if (!chapter) notFound()

  const index = chapters.findIndex(item => item.slug === chapter.slug)
  const previous = index > 0 ? chapters[index - 1] : null
  const next = index >= 0 && index < chapters.length - 1 ? chapters[index + 1] : null
  const dated = chapter.source_date ? formatSourceDate(chapter.source_date) : null
  const requested = searchParams?.section?.trim()
  const missingSection =
    requested && !chapter.headings.some(heading => heading.id === requested.toLowerCase())
      ? requested
      : null

  return (
    <TreatiseChapterView
      label={chapter.label}
      title={chapter.title}
      updatedOn={dated}
      sourceNote="This is the current working text. The treatise is unfinished, and this page changes when the chapter changes."
      headings={chapter.headings}
      html={chapter.html}
      missingSection={missingSection}
      previous={previous ? { href: previous.href, label: previous.label } : null}
      next={next ? { href: next.href, label: next.label } : null}
    />
  )
}
