import Link from 'next/link'
import { ArticleContent } from '@/components/article-content'
import { LicenceNotice } from '@/components/licence-notice'
import PDFDownloadButton from '@/components/PDFDownloadButton'
import { TreatiseRefLink } from '@/lib/publishing/refs'

export interface ArticleViewProps {
  mode: 'public' | 'preview'
  title: string
  slug: string
  author: string | null
  date: string | null
  readingMinutes: number
  category: string | null
  tags: string[] | null
  imageUrl: string | null
  imageAlt: string | null
  html: string
  treatiseRefs: string[] | null
  sourcePapers: string[] | null
  previewNote: string | null
  isAdmin: boolean
  editHref: string | null
  siteUrl: string
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Australia/Melbourne'
  })
}

/** The article page, shared by the public URL and the admin preview. */
export function ArticleView({
  mode,
  title,
  slug,
  author,
  date,
  readingMinutes,
  category,
  tags,
  imageUrl,
  imageAlt,
  html,
  treatiseRefs,
  sourcePapers,
  previewNote,
  isAdmin,
  editHref,
  siteUrl
}: ArticleViewProps) {
  const shareUrl = `${siteUrl}/articles/${slug}`
  const refs = (treatiseRefs ?? [])
    .map(ref => ({ ref, href: TreatiseRefLink.href(ref) }))
    .filter(item => item.ref)
  const papers = (sourcePapers ?? []).filter(Boolean)

  return (
    <article className="article-container min-h-screen bg-white print:px-4">
      {mode === 'preview' && previewNote && (
        <div className="border-b border-amber-200 bg-amber-50">
          <p className="mx-auto max-w-4xl px-4 py-3 text-sm text-amber-950 sm:px-6 lg:px-8">{previewNote}</p>
        </div>
      )}

      {imageUrl && (
        <div className="bg-gray-950">
          <img
            src={imageUrl}
            alt={imageAlt || title}
            className="mx-auto aspect-[1200/630] max-h-[32rem] w-full max-w-5xl object-cover"
          />
        </div>
      )}

      <nav className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 text-sm no-print sm:px-6 lg:px-8">
        <ol className="flex items-center space-x-2 text-gray-600">
          <li>
            <Link href="/" className="hover:text-primary-600">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href={mode === 'preview' ? '/admin/publishing' : '/articles'} className="hover:text-primary-600">
              {mode === 'preview' ? 'Schedule' : 'Articles'}
            </Link>
          </li>
          <li>/</li>
          <li className="max-w-[8rem] truncate text-gray-900 sm:max-w-xs">{title}</li>
        </ol>
        {isAdmin && editHref && (
          <Link
            href={editHref}
            className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 no-print"
          >
            Edit article
          </Link>
        )}
      </nav>

      <header className="article-meta mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="article-title mb-4 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl lg:text-5xl">{title}</h1>
        <div className="mb-6 flex flex-wrap items-center gap-4 text-gray-600">
          {author && (
            <div className="author flex items-center">
              <span className="font-semibold">By {author}</span>
            </div>
          )}
          {date && (
            <time className="date" dateTime={date}>
              {formatDate(date)}
            </time>
          )}
          <span>{readingMinutes} min read</span>
        </div>
        {category && (
          <div className="mb-4">
            <span className="inline-block rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-800">
              {category}
            </span>
          </div>
        )}
        {tags && tags.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {tags.map(tag => (
              <span key={tag} className="inline-block rounded bg-gray-100 px-2 py-1 text-sm text-gray-700">
                {tag}
              </span>
            ))}
          </div>
        )}
        {refs.length > 0 && (
          <p className="mb-4 text-sm text-gray-600">
            In the treatise:{' '}
            {refs.map((item, index) => (
              <span key={item.ref}>
                {index > 0 ? ', ' : ''}
                {item.href ? (
                  <Link href={item.href} className="text-primary-700 hover:underline">
                    {item.ref}
                  </Link>
                ) : (
                  item.ref
                )}
              </span>
            ))}
          </p>
        )}
        {papers.length > 0 && (
          <p className="mb-6 text-sm text-gray-500">Sources: {papers.join(', ')}</p>
        )}
        {mode === 'public' && (
          <div className="no-print">
            <PDFDownloadButton slug={slug} title={title} />
          </div>
        )}
      </header>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <ArticleContent
          html={html}
          className="prose prose-lg max-w-none prose-headings:font-bold prose-h2:text-xl prose-h3:text-lg prose-a:text-primary-600 prose-a:hover:text-primary-700 md:prose-h2:text-3xl md:prose-h3:text-2xl"
        />
        <LicenceNotice />
      </div>

      {mode === 'public' && (
        <footer className="mx-auto max-w-4xl border-t px-4 py-8 no-print sm:px-6 lg:px-8">
          <h2 className="mb-2 text-lg font-semibold text-gray-900">Share this article</h2>
          <div className="social-share flex flex-wrap gap-3">
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded bg-gray-100 px-4 py-2 transition hover:bg-gray-200"
            >
              Share on X
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded bg-gray-100 px-4 py-2 transition hover:bg-gray-200"
            >
              Share on LinkedIn
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded bg-gray-100 px-4 py-2 transition hover:bg-gray-200"
            >
              Share on Facebook
            </a>
          </div>
        </footer>
      )}
    </article>
  )
}
