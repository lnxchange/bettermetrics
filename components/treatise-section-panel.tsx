'use client'

import { useEffect, useRef, useState, type MouseEvent } from 'react'
import Link from 'next/link'

import { ArticleContent } from '@/components/article-content'
import { IconClose } from '@/components/ui/icons'
import { treatiseSectionTarget, TreatiseSectionTarget } from '@/lib/treatise-citations'

export const treatisePanelOffset = 'lg:pr-[min(40vw,28rem)]'
export const treatisePanelRight = 'lg:right-[min(40vw,28rem)]'

interface SectionStep {
  section: string
  heading: string
}

interface SectionPayload {
  label: string
  title: string
  heading: string | null
  html: string | null
  missing: string | null
  href: string
  section: string | null
  previous: SectionStep | null
  next: SectionStep | null
}

function sameSection(a: TreatiseSectionTarget, b: TreatiseSectionTarget) {
  return a.slug === b.slug && a.section === b.section
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
  const [cursor, setCursor] = useState({ index: 0, length: 1 })
  const history = useRef<TreatiseSectionTarget[]>([target])
  const index = useRef(0)
  const scroller = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const current = history.current[index.current]
    if (current && sameSection(current, target)) return
    const nextHistory = history.current.slice(0, index.current + 1)
    nextHistory.push(target)
    history.current = nextHistory
    index.current = nextHistory.length - 1
    setCursor({ index: index.current, length: nextHistory.length })
  }, [target.slug, target.section])

  const recall = (nextIndex: number) => {
    if (nextIndex < 0 || nextIndex >= history.current.length) return
    index.current = nextIndex
    setCursor({ index: nextIndex, length: history.current.length })
    onOpen(history.current[nextIndex])
  }

  useEffect(() => {
    const controller = new AbortController()
    setPayload(null)
    setError(null)
    const params = new URLSearchParams({ slug: target.slug })
    if (target.section) params.set('section', target.section)
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

  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 })
  }, [payload?.section])

  const openLinkedSection = (event: MouseEvent<HTMLElement>) => {
    const anchor = (event.target as HTMLElement).closest('a')
    const href = anchor?.getAttribute('href')
    if (!href) return
    const next = treatiseSectionTarget(href)
    if (!next) return
    event.preventDefault()
    onOpen(next)
  }

  const go = (step: SectionStep | null | undefined) => {
    if (!step) return
    onOpen({ slug: target.slug, section: step.section })
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
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            disabled={cursor.index === 0}
            onClick={() => recall(index.current - 1)}
            className="rounded-md border px-2 py-1 text-xs hover:bg-muted disabled:cursor-default disabled:opacity-40"
            aria-label="Back"
          >
            ← Back
          </button>
          <button
            type="button"
            disabled={cursor.index >= cursor.length - 1}
            onClick={() => recall(index.current + 1)}
            className="rounded-md border px-2 py-1 text-xs hover:bg-muted disabled:cursor-default disabled:opacity-40"
            aria-label="Forward"
          >
            Forward →
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Close section"
          >
            <IconClose />
          </button>
        </div>
      </div>
      <div ref={scroller} className="min-h-0 flex-1 overflow-y-auto px-4 py-4" onClick={openLinkedSection}>
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
      <div className="grid grid-cols-2 gap-2 border-t px-3 py-2">
        <button
          type="button"
          disabled={!payload?.previous}
          onClick={() => go(payload?.previous)}
          className="truncate rounded-md border px-2 py-1.5 text-left text-xs hover:bg-muted disabled:cursor-default disabled:opacity-40"
        >
          {payload?.previous ? `← ${payload.previous.heading}` : '← Previous'}
        </button>
        <button
          type="button"
          disabled={!payload?.next}
          onClick={() => go(payload?.next)}
          className="truncate rounded-md border px-2 py-1.5 text-right text-xs hover:bg-muted disabled:cursor-default disabled:opacity-40"
        >
          {payload?.next ? `${payload.next.heading} →` : 'Next →'}
        </button>
      </div>
    </aside>
  )
}
