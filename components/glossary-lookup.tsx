'use client'

import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject
} from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { GlossaryProseView } from '@/components/glossary-prose'
import { GlossaryMarkup } from '@/lib/glossary-markup'
import { type AnchorBox, GlossaryPopover } from '@/lib/glossary-popover'
import { type GlossaryTermRef } from '@/lib/glossary-terms'

const GlossaryTermsContext = createContext<GlossaryTermRef[] | null>(null)

interface OpenTerm {
  slug: string
  label: string
  box: AnchorBox
}

interface Lookup {
  slug: string
  term: string
  definition: string
  explanation: string
}

export function useGlossaryDecorate(
  ref: RefObject<HTMLElement | null>,
  revision: unknown,
  skipHeadings = false
) {
  const terms = useContext(GlossaryTermsContext)
  useEffect(() => {
    if (!ref.current || !terms?.length) return
    GlossaryMarkup.element(ref.current, terms, skipHeadings)
  }, [terms, revision, ref, skipHeadings])
}

export function GlossaryProvider({ children }: { children: ReactNode }) {
  const [terms, setTerms] = useState<GlossaryTermRef[] | null>(null)
  const [open, setOpen] = useState<OpenTerm | null>(null)
  const pathname = usePathname()

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
      if (selection && !selection.isCollapsed && selection.toString().trim())
        return
      const slug = mark.dataset.glossary
      if (!slug) return
      event.preventDefault()
      const rect = mark.getBoundingClientRect()
      setOpen({
        slug,
        label: mark.textContent || '',
        box: {
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height
        }
      })
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(null)
    }
    document.addEventListener('click', onClick)
    document.addEventListener('keydown', onKey)
    const onHash = () => setOpen(null)
    window.addEventListener('hashchange', onHash)
    return () => {
      document.removeEventListener('click', onClick)
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('hashchange', onHash)
    }
  }, [])

  useEffect(() => {
    setOpen(null)
  }, [pathname])

  return (
    <GlossaryTermsContext.Provider value={terms}>
      {children}
      {open && <GlossaryCard open={open} onClose={() => setOpen(null)} />}
    </GlossaryTermsContext.Provider>
  )
}

function GlossaryCard({
  open,
  onClose
}: {
  open: OpenTerm
  onClose: () => void
}) {
  const [entry, setEntry] = useState<Lookup | null>(null)
  const [error, setError] = useState(false)
  const [narrow, setNarrow] = useState(
    () => window.matchMedia('(max-width: 767px)').matches
  )
  const [placed, setPlaced] = useState(narrow)
  const panel = useRef<HTMLDivElement>(null)
  const body = useRef<HTMLDivElement>(null)
  useGlossaryDecorate(
    body,
    entry ? `${entry.slug}\n${entry.definition}\n${entry.explanation}` : ''
  )

  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [])

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)')
    const apply = () => setNarrow(media.matches)
    apply()
    media.addEventListener('change', apply)
    return () => media.removeEventListener('change', apply)
  }, [])

  useLayoutEffect(() => {
    const node = panel.current
    if (!node) return
    if (narrow) {
      node.style.left = ''
      node.style.top = ''
      node.style.width = ''
      node.style.maxHeight = ''
      setPlaced(true)
      return
    }
    let live = true
    const run = () => {
      void GlossaryPopover.place(open.box, node).then(() => {
        if (live) setPlaced(true)
      })
    }
    run()
    window.addEventListener('resize', run)
    window.visualViewport?.addEventListener('resize', run)
    return () => {
      live = false
      window.removeEventListener('resize', run)
      window.visualViewport?.removeEventListener('resize', run)
    }
  }, [narrow, open.box, entry])

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

  const frame = narrow
    ? 'inset-x-0 bottom-0 max-h-[calc(100dvh-0.75rem)] rounded-t-2xl'
    : 'rounded-xl'

  return (
    <>
      <button
        type="button"
        aria-label="Close definition"
        className="fixed inset-0 z-40 cursor-default bg-black/20"
        onClick={onClose}
      />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={entry?.term || open.label}
        className={`fixed z-50 flex flex-col overflow-hidden border border-gray-200 bg-white shadow-lg ${frame}`}
        style={narrow || placed ? undefined : { visibility: 'hidden' }}
      >
        <div className="flex shrink-0 items-start justify-between gap-3 px-4 pt-4">
          <h2 className="text-base font-semibold text-gray-900">
            {entry?.term || open.label}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-sm text-gray-500 hover:bg-gray-100"
          >
            Close
          </button>
        </div>
        <div
          ref={body}
          className="mt-3 min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-4"
        >
          {error && (
            <p className="text-sm text-gray-600">
              This entry could not be loaded.
            </p>
          )}
          {!error && !entry && (
            <p className="text-sm text-gray-500">Loading the definition…</p>
          )}
          {entry && (
            <div className="space-y-3">
              <GlossaryProseView
                text={entry.definition}
                className="text-sm leading-relaxed text-gray-800"
              />
              <GlossaryProseView
                text={entry.explanation}
                className="text-sm leading-relaxed text-gray-800"
              />
            </div>
          )}
        </div>
        {entry && (
          <div className="shrink-0 border-t border-gray-100 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            <Link
              href={`/glossary/${entry.slug}`}
              className="text-sm font-medium text-primary-700 hover:underline"
            >
              Open the glossary entry
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
