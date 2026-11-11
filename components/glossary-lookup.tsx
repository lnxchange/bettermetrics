'use client'

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject
} from 'react'
import Link from 'next/link'

import { findGlossarySpans, type GlossaryTermRef } from '@/lib/glossary-terms'

const GlossaryTermsContext = createContext<GlossaryTermRef[] | null>(null)

const SKIP_SELECTOR = 'a, code, pre, button, script, style, [data-glossary]'

interface OpenTerm {
  slug: string
  label: string
  narrow: boolean
  top: number
  left: number
}

interface Lookup {
  slug: string
  term: string
  definition: string
  explanation: string
}

function decorate(root: HTMLElement, terms: GlossaryTermRef[]) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement
      if (!parent || parent.closest(SKIP_SELECTOR)) return NodeFilter.FILTER_REJECT
      if (!node.textContent?.trim()) return NodeFilter.FILTER_REJECT
      return NodeFilter.FILTER_ACCEPT
    }
  })
  const nodes: Text[] = []
  let current = walker.nextNode()
  while (current) {
    nodes.push(current as Text)
    current = walker.nextNode()
  }
  for (const node of nodes) {
    const text = node.textContent || ''
    const spans = findGlossarySpans(text, terms)
    if (!spans.length || !node.parentNode) continue
    const fragment = document.createDocumentFragment()
    let last = 0
    for (const span of spans) {
      if (span.start > last) fragment.append(text.slice(last, span.start))
      const mark = document.createElement('span')
      mark.dataset.glossary = span.slug
      mark.className =
        'glossary-term cursor-pointer underline decoration-dotted underline-offset-[0.15em]'
      mark.textContent = span.text
      fragment.append(mark)
      last = span.end
    }
    if (last < text.length) fragment.append(text.slice(last))
    node.parentNode.replaceChild(fragment, node)
  }
}

export function useGlossaryDecorate(
  ref: RefObject<HTMLElement | null>,
  revision: unknown
) {
  const terms = useContext(GlossaryTermsContext)
  useEffect(() => {
    if (!ref.current || !terms?.length) return
    decorate(ref.current, terms)
  }, [terms, revision, ref])
}

export function GlossaryProvider({ children }: { children: ReactNode }) {
  const [terms, setTerms] = useState<GlossaryTermRef[] | null>(null)
  const [open, setOpen] = useState<OpenTerm | null>(null)

  useEffect(() => {
    let cancel = false
    fetch('/api/glossary/terms')
      .then(response => (response.ok ? response.json() : null))
      .then(data => {
        if (cancel || !Array.isArray(data?.terms)) return
        setTerms(data.terms)
      })
      .catch(() => {
        if (!cancel) setTerms([])
      })
    return () => {
      cancel = true
    }
  }, [])

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target
      if (!(target instanceof Element)) return
      const mark = target.closest('[data-glossary]')
      if (!(mark instanceof HTMLElement)) return
      const selection = window.getSelection()
      if (selection && !selection.isCollapsed && selection.toString().trim()) return
      const slug = mark.dataset.glossary
      if (!slug) return
      event.preventDefault()
      const rect = mark.getBoundingClientRect()
      const narrow = window.matchMedia('(max-width: 767px)').matches
      setOpen({
        slug,
        label: mark.textContent || '',
        narrow,
        top: rect.bottom + 8,
        left: Math.min(rect.left, window.innerWidth - 24)
      })
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(null)
    }
    document.addEventListener('click', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('click', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  return (
    <GlossaryTermsContext.Provider value={terms}>
      {children}
      {open && <GlossaryCard open={open} onClose={() => setOpen(null)} />}
    </GlossaryTermsContext.Provider>
  )
}

function GlossaryCard({ open, onClose }: { open: OpenTerm; onClose: () => void }) {
  const [entry, setEntry] = useState<Lookup | null>(null)
  const [error, setError] = useState(false)
  const body = useRef<HTMLDivElement>(null)
  const terms = useContext(GlossaryTermsContext)
  useGlossaryDecorate(body, entry ? `${entry.slug}\n${entry.definition}\n${entry.explanation}` : '')

  useEffect(() => {
    const controller = new AbortController()
    setEntry(null)
    setError(false)
    fetch(`/api/glossary/lookup?slug=${encodeURIComponent(open.slug)}`, {
      signal: controller.signal
    })
      .then(async response => {
        if (!response.ok) throw new Error('missing')
        return response.json() as Promise<Lookup>
      })
      .then(setEntry)
      .catch(err => {
        if (err?.name === 'AbortError') return
        setError(true)
      })
    return () => controller.abort()
  }, [open.slug])

  const place = open.narrow
    ? 'inset-x-0 bottom-0 max-h-[70vh] rounded-t-2xl'
    : 'max-h-80 w-[min(24rem,calc(100vw-1.5rem))] rounded-xl'

  return (
    <>
      <button
        type="button"
        aria-label="Close definition"
        className="fixed inset-0 z-40 cursor-default bg-black/20"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-label={entry?.term || open.label}
        className={`fixed z-50 overflow-y-auto border border-gray-200 bg-white p-4 shadow-lg ${place}`}
        style={
          open.narrow
            ? undefined
            : {
                top: Math.max(16, Math.min(open.top, window.innerHeight - 240)),
                left: Math.max(12, Math.min(open.left, window.innerWidth - 384 - 12))
              }
        }
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-base font-semibold text-gray-900">{entry?.term || open.label}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-sm text-gray-500 hover:bg-gray-100"
          >
            Close
          </button>
        </div>
        {error && <p className="mt-3 text-sm text-gray-600">This entry could not be loaded.</p>}
        {!error && !entry && <p className="mt-3 text-sm text-gray-500">Loading the definition…</p>}
        {entry && (
          <div ref={body} className="mt-3 space-y-3 text-sm leading-relaxed text-gray-800">
            {entry.definition && <p>{entry.definition}</p>}
            {entry.explanation && <p>{entry.explanation}</p>}
            <p>
              <Link href={`/glossary/${entry.slug}`} className="font-medium text-primary-700 hover:underline">
                Open the glossary entry
              </Link>
            </p>
          </div>
        )}
      </div>
    </>
  )
}
