'use client'

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import mermaid from 'mermaid'

interface MermaidProps {
  chart: string
  className?: string
  appearance?: 'auto' | 'light' | 'dark'
}

function mermaidOptions(isDark: boolean) {
  return {
    startOnLoad: false,
    theme: (isDark ? 'dark' : 'base') as 'dark' | 'base',
    securityLevel: 'loose' as const,
    fontFamily: 'inherit',
    fontSize: 16,
    themeVariables: isDark
      ? { fontSize: '16px' }
      : {
          fontSize: '16px',
          darkMode: false,
          background: '#ffffff',
          primaryTextColor: '#201c19',
          secondaryTextColor: '#201c19',
          tertiaryTextColor: '#201c19',
          textColor: '#201c19',
          lineColor: '#3a3733',
          mainBkg: '#ffffff'
        },
    flowchart: {
      useMaxWidth: false,
      htmlLabels: true,
      padding: 16,
      nodeSpacing: 36,
      rankSpacing: 48
    }
  }
}

function withUniqueIds(svg: string, suffix: string) {
  const ids: string[] = []
  const idPattern = /\bid="([^"]+)"/g
  let idMatch: RegExpExecArray | null
  while ((idMatch = idPattern.exec(svg))) {
    if (!ids.includes(idMatch[1])) ids.push(idMatch[1])
  }
  if (ids.length === 0) return svg
  ids.sort((a, b) => b.length - a.length)
  const pattern = new RegExp(ids.map(id => id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'g')
  return svg.replace(pattern, id => `${id}-${suffix}`)
}

function svgSize(svg: string) {
  const width = Number(svg.match(/\bwidth="([\d.]+)/)?.[1])
  const height = Number(svg.match(/\bheight="([\d.]+)/)?.[1])
  if (width > 0 && height > 0) return { w: width, h: height }
  const box = svg.match(/viewBox="([\d.\s-]+)"/)?.[1]?.trim().split(/\s+/).map(Number)
  if (box && box.length === 4 && box[2] > 0 && box[3] > 0) return { w: box[2], h: box[3] }
  return { w: 1200, h: 600 }
}

export function Mermaid({ chart, className, appearance = 'auto' }: MermaidProps) {
  const triggerRef = useRef<HTMLButtonElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const [svg, setSvg] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [fitScale, setFitScale] = useState(0)
  const size = useMemo(() => (svg ? svgSize(svg) : { w: 1, h: 1 }), [svg])

  useEffect(() => {
    const isDark =
      appearance === 'dark' ||
      (appearance === 'auto' && document.documentElement.classList.contains('dark'))

    mermaid.initialize(mermaidOptions(isDark))

    const renderChart = async () => {
      try {
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`
        const { svg: rendered } = await mermaid.render(id, chart)
        setSvg(rendered)
        setError(null)
      } catch (err) {
        console.error('Mermaid rendering error:', err)
        setError(err instanceof Error ? err.message : 'Failed to render diagram')
      }
    }

    renderChart()
  }, [chart, appearance])

  useEffect(() => {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.attributeName !== 'class') return
        const isDark =
          appearance === 'dark' ||
          (appearance === 'auto' && document.documentElement.classList.contains('dark'))
        mermaid.initialize(mermaidOptions(isDark))

        const renderChart = async () => {
          try {
            const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`
            const { svg: rendered } = await mermaid.render(id, chart)
            setSvg(rendered)
            setError(null)
          } catch (err) {
            console.error('Mermaid rendering error:', err)
          }
        }
        renderChart()
      })
    })

    observer.observe(document.documentElement, { attributes: true })
    return () => observer.disconnect()
  }, [chart, appearance])

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKey)
      triggerRef.current?.focus()
    }
  }, [open])

  useLayoutEffect(() => {
    if (!open) return
    const measure = () => {
      const stage = stageRef.current
      if (!stage) return
      const rect = stage.getBoundingClientRect()
      const next = Math.min((rect.width - 32) / size.w, (rect.height - 32) / size.h)
      if (next > 0) setFitScale(next)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [open, size])

  if (error) {
    return (
      <div
        className={`rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20 ${className || ''}`}
      >
        <p className="mb-2 text-sm font-medium text-red-600 dark:text-red-400">Diagram Error</p>
        <pre className="whitespace-pre-wrap text-xs text-red-500 dark:text-red-300">{error}</pre>
        <details className="mt-2">
          <summary className="cursor-pointer text-xs text-red-400">Show raw code</summary>
          <pre className="mt-2 overflow-x-auto rounded bg-red-100 p-2 text-xs dark:bg-red-900/40">{chart}</pre>
        </details>
      </div>
    )
  }

  if (!svg) {
    return (
      <div className={`animate-pulse rounded-lg border bg-muted p-4 ${className || ''}`}>
        <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
          Loading diagram...
        </div>
      </div>
    )
  }

  const scale = fitScale * zoom

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          setZoom(1)
          setOpen(true)
        }}
        aria-label="Enlarge diagram"
        aria-haspopup="dialog"
        aria-expanded={open}
        className={`aim-mermaid aim-mermaid-inline my-4 w-full cursor-zoom-in rounded-lg border p-4 text-left ${
          appearance === 'light' ? 'bg-white' : 'bg-card'
        } ${className || ''}`}
      >
        <div aria-hidden="true" dangerouslySetInnerHTML={{ __html: svg }} />
        <span className="mt-3 block text-center text-xs font-medium text-gray-500">Click to enlarge</span>
      </button>
      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex flex-col bg-white"
            role="dialog"
            aria-modal="true"
            aria-label="Enlarged diagram"
          >
            <div className="flex items-center justify-between gap-3 border-b border-gray-200 px-4 py-3">
              <p className="text-sm text-gray-600">The whole diagram is fitted to the screen.</p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setZoom(current => Math.max(0.5, Number((current - 0.25).toFixed(2))))}
                  className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Smaller
                </button>
                <button
                  type="button"
                  onClick={() => setZoom(1)}
                  className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Fit
                </button>
                <button
                  type="button"
                  onClick={() => setZoom(current => Math.min(4, Number((current + 0.25).toFixed(2))))}
                  className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Larger
                </button>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
            <div ref={stageRef} className="min-h-0 flex-1 overflow-auto bg-white p-4">
              <div className="mx-auto" style={{ width: size.w * scale, height: size.h * scale }}>
                <div
                  style={{
                    width: size.w,
                    height: size.h,
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left'
                  }}
                  dangerouslySetInnerHTML={{ __html: withUniqueIds(svg, 'enlarged') }}
                />
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  )
}
