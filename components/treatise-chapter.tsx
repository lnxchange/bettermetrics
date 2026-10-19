'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArticleContent } from '@/components/article-content'
import { TableOfContents, TableOfContentsMobile } from '@/components/table-of-contents'
import { TreatiseHeading } from '@/lib/treatise-citations'

export function TreatiseChapterView({
  label,
  title,
  updatedOn,
  sourceNote,
  headings,
  html,
  missingSection,
  previous,
  next
}: {
  label: string
  title: string
  updatedOn: string | null
  sourceNote: string
  headings: TreatiseHeading[]
  html: string
  missingSection: string | null
  previous: { href: string; label: string } | null
  next: { href: string; label: string } | null
}) {
  const ids = useMemo(() => new Set(headings.map(heading => heading.id)), [headings])
  const [activeId, setActiveId] = useState('')
  const [hashMissing, setHashMissing] = useState<string | null>(missingSection)

  useEffect(() => {
    const alignToHash = () => {
      const hash = decodeURIComponent(window.location.hash.replace(/^#/, ''))
      if (!hash) return
      if (!ids.has(hash)) {
        setHashMissing(hash)
        return
      }
      setHashMissing(null)
      const element = document.getElementById(hash)
      if (!element) return
      const top = element.getBoundingClientRect().top + window.scrollY - 96
      window.scrollTo({ top, behavior: 'auto' })
    }
    alignToHash()
    window.addEventListener('hashchange', alignToHash)
    return () => window.removeEventListener('hashchange', alignToHash)
  }, [ids])

  useEffect(() => {
    if (headings.length === 0) return
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        })
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0.1 }
    )
    headings.forEach(heading => {
      const element = document.getElementById(heading.id)
      if (element) observer.observe(element)
    })
    return () => observer.disconnect()
  }, [headings])

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (!element) {
      setHashMissing(id)
      return
    }
    const top = element.getBoundingClientRect().top + window.scrollY - 96
    window.scrollTo({ top, behavior: 'smooth' })
    history.replaceState(null, '', `#${id}`)
    setActiveId(id)
    setHashMissing(null)
  }

  const absent = hashMissing

  return (
    <div className="bg-white">
      <section className="border-b border-gray-100 bg-gradient-to-br from-blue-50 via-white to-gray-50 py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="mb-3 text-sm text-gray-500">
            <Link href="/treatise" className="hover:text-primary-600">
              Treatise
            </Link>
            <span className="mx-2">/</span>
            {label}
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">{title}</h1>
          {updatedOn && (
            <p className="mt-4 text-sm font-semibold text-gray-900">Updated {updatedOn}</p>
          )}
          <p className={`${updatedOn ? 'mt-2' : 'mt-4'} text-sm leading-relaxed text-gray-600`}>
            {sourceNote}
          </p>
          {absent && (
            <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
              Section {absent} is not in the current text. The rest of this {label.toLowerCase()}{' '}
              is below.
            </p>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex gap-10">
          <article className="min-w-0 flex-1">
            <ArticleContent
              html={html}
              className="prose prose-lg max-w-none prose-headings:scroll-mt-24 prose-headings:font-bold prose-h2:text-xl prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline md:prose-h2:text-3xl prose-h3:text-lg md:prose-h3:text-2xl"
            />
            <nav className="mt-12 flex flex-col gap-3 border-t border-gray-200 pt-6 text-sm sm:flex-row sm:justify-between">
              {previous ? (
                <Link href={previous.href} className="text-primary-700 hover:underline">
                  ← {previous.label}
                </Link>
              ) : (
                <span />
              )}
              {next && (
                <Link href={next.href} className="text-primary-700 hover:underline sm:text-right">
                  {next.label} →
                </Link>
              )}
            </nav>
          </article>
          <aside className="hidden w-64 flex-shrink-0 lg:block">
            <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pr-2 text-sm">
              <TableOfContents headings={headings} activeId={activeId} onHeadingClick={scrollToHeading} />
            </div>
          </aside>
        </div>
      </div>
      <TableOfContentsMobile headings={headings} activeId={activeId} onHeadingClick={scrollToHeading} />
    </div>
  )
}
