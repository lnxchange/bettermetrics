import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { TreatiseChapterView } from '@/components/treatise-chapter'
import { TreatiseAddress } from '@/lib/treatise-address'
import { formatSourceDate, loadTreatiseChapter, loadTreatiseChapters } from '@/lib/treatise'
import { SITE_OG_IMAGE, metaDescription } from '@/lib/site'

function chatReturnPath(value: string | undefined) {
  if (!value) return null
  let decoded = value
  try {
    decoded = decodeURIComponent(value)
  } catch {
    return null
  }
  if (!/^\/chat(\/[A-Za-z0-9_-]+)?$/.test(decoded)) return null
  return decoded
}

export const dynamic = 'force-dynamic'

interface TreatiseChapterPageProps {
  params: { slug: string }
  searchParams?: { section?: string; from?: string }
}

function storedSlug(segment: string, searchParams?: TreatiseChapterPageProps['searchParams']) {
  const destination = TreatiseAddress.destinationFor(`/treatise/${segment}`)
  if (destination) {
    const params = new URLSearchParams()
    for (const [key, value] of Object.entries(searchParams ?? {})) {
      if (typeof value === 'string' && value) params.set(key, value)
    }
    const query = params.toString()
    redirect(query ? `${destination}?${query}` : destination)
  }
  const slug = TreatiseAddress.storageSlug(segment)
  if (!slug) notFound()
  return slug
}

export async function generateMetadata({ params }: TreatiseChapterPageProps): Promise<Metadata> {
  const slug = storedSlug(params.slug)
  const chapter = await loadTreatiseChapter(slug)
  if (!chapter) return { title: 'Chapter not found', robots: { index: false } }
  const path = TreatiseAddress.publicPath(slug)
  const description = metaDescription(
    `${chapter.label} of the AIM Treatise, a general theory of human motivation: ${chapter.title}. Current working text, updated as the book develops.`
  )
  return {
    // Absolute: chapter titles are long enough without the site suffix.
    title: { absolute: `${chapter.label}: ${chapter.title}` },
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${chapter.label}. ${chapter.title}`,
      description,
      url: path,
      type: 'article',
      images: [SITE_OG_IMAGE],
      modifiedTime: chapter.updated_at
    }
  }
}

export default async function TreatiseChapterPage({ params, searchParams }: TreatiseChapterPageProps) {
  const slug = storedSlug(params.slug, searchParams)

  const [chapter, chapters] = await Promise.all([
    loadTreatiseChapter(slug),
    loadTreatiseChapters()
  ])
  if (!chapter) notFound()

  const index = chapters.findIndex(item => item.slug === chapter.slug)
  const previous = index > 0 ? chapters[index - 1] : null
  const next = index >= 0 && index < chapters.length - 1 ? chapters[index + 1] : null
  const dated = chapter.source_date ? formatSourceDate(chapter.source_date) : null
  const frameworkNote =
    chapter.slug === '4'
      ? {
          text: 'With Appendix A, this chapter is the framework. The rest of the treatise explains it and follows it into practice.',
          href: '/treatise/appendix-a',
          label: 'Appendix A'
        }
      : chapter.slug === 'appendix-a'
        ? {
            text: 'With Chapter 4, this appendix is the framework. Chapter 4 states it; this is its mathematics.',
            href: '/treatise/chapter-4',
            label: 'Chapter 4'
          }
        : null
  const requested = searchParams?.section?.trim()
  const missingSection =
    requested && !chapter.headings.some(heading => heading.id === requested.toLowerCase())
      ? requested
      : null
  const returnTo = chatReturnPath(searchParams?.from)

  return (
    <TreatiseChapterView
      label={chapter.label}
      title={chapter.title}
      updatedOn={dated}
      sourceNote="This is the current working text. The treatise is unfinished, and this page changes when the chapter changes."
      frameworkNote={frameworkNote}
      headings={chapter.headings}
      returnTo={returnTo}
      html={chapter.html}
      missingSection={missingSection}
      previous={previous ? { href: previous.href, label: previous.label } : null}
      next={next ? { href: next.href, label: next.label } : null}
    />
  )
}
