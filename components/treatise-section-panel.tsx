'use client'

import { useEffect, useState, type MouseEvent } from 'react'
import Link from 'next/link'

import { ArticleContent } from '@/components/article-content'
import { IconClose } from '@/components/ui/icons'
import { treatiseSectionTarget, TreatiseSectionTarget } from '@/lib/treatise-citations'

export const treatisePanelOffset = 'lg:pr-[min(40vw,28rem)]'
export const treatisePanelRight = 'lg:right-[min(40vw,28rem)]'

interface SectionPayload {
  label: string
  title: string
  heading: string | null
  html: string | null
  missing: string | null
  href: string
}

export function TreatiseSectionPanel({
  target,
  onOpen,
  onClose
}: {
  target: TreatiseSectionTarget
  onOpen: (target: TreatiseSectionTarget) => void
  onClose: () => void
}) {
  const [payload, setPayload] = useState<SectionPayload | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    setPayload(null)
    setError(null)
    const params = new URLSearchParams({ slug: target.slug, section: target.section })
    fetch(`/api/treatise/section?${params}`, { signal: controller.signal })
      .then(async response => {
        if (!response.ok) throw new Error('missing')
        return response.json() as Promise<SectionPayload>
      })
      .then(setPayload)
      .catch(err => {
        if (err?.name === 'AbortError') return
        setError('This section could not be loaded.')
      })
    return () => controller.abort()
  }, [target.slug, target.section])

  const openLinkedSection = (event: MouseEvent<HTMLElement>) => {
    const anchor = (event.target as HTMLElement).closest('a')
    const href = anchor?.getAttribute('href')
    if (!href) return
    const next = treatiseSectionTarget(href)
    if (!next) return
    event.preventDefault()
    onOpen(next)
  }

  return (
    <aside
      className="fixed bottom-0 right-0 top-[7.5rem] z-30 flex w-full flex-col border-l bg-background lg:w-[min(40vw,28rem)]"
      aria-label="Treatise section"
    >
      <div className="flex items-start justify-between gap-3 border-b px-4 py-3">
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">{payload?.label ?? 'Treatise'}</p>
          <p className="truncate text-sm font-medium">{payload?.heading ?? target.section}</p>
          {payload && (
            <Link href={payload.href} className="text-xs text-primary-700 hover:underline">
              Open {payload.label}
            </Link>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Close section"
        >
          <IconClose />
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4" onClick={openLinkedSection}>
        {error && <p className="text-sm text-muted-foreground">{error}</p>}
        {!error && !payload && <p className="text-sm text-muted-foreground">Loading the section…</p>}
        {payload?.missing && (
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
            Section {payload.missing} is not in the current text. The rest of this{' '}
            {payload.label.toLowerCase()} is below.
          </p>
        )}
        {payload?.html && (
          <ArticleContent
            html={payload.html}
            className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-bold prose-a:text-primary-600"
          />
        )}
      </div>
    </aside>
  )
}
