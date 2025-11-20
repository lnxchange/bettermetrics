'use client'

import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'

interface MermaidProps {
  chart: string
  className?: string
}

export function Mermaid({ chart, className }: MermaidProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Initialize mermaid with theme detection
    const isDark = document.documentElement.classList.contains('dark')

    mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? 'dark' : 'default',
      securityLevel: 'loose',
      fontFamily: 'inherit',
    })

    const renderChart = async () => {
      try {
        // Generate unique ID for this diagram
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`

        // Render the diagram
        const { svg } = await mermaid.render(id, chart)
        setSvg(svg)
        setError(null)
      } catch (err) {
        console.error('Mermaid rendering error:', err)
        setError(err instanceof Error ? err.message : 'Failed to render diagram')
      }
    }

    renderChart()
  }, [chart])

  // Re-render on theme change
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isDark = document.documentElement.classList.contains('dark')
          mermaid.initialize({
            startOnLoad: false,
            theme: isDark ? 'dark' : 'default',
            securityLevel: 'loose',
            fontFamily: 'inherit',
          })

          // Re-render the chart
          const renderChart = async () => {
            try {
              const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`
              const { svg } = await mermaid.render(id, chart)
              setSvg(svg)
              setError(null)
            } catch (err) {
              console.error('Mermaid rendering error:', err)
            }
          }
          renderChart()
        }
      })
    })

    observer.observe(document.documentElement, { attributes: true })

    return () => observer.disconnect()
  }, [chart])

  if (error) {
    return (
      <div className={`p-4 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/20 ${className || ''}`}>
        <p className="text-sm text-red-600 dark:text-red-400 font-medium mb-2">Diagram Error</p>
        <pre className="text-xs text-red-500 dark:text-red-300 whitespace-pre-wrap">{error}</pre>
        <details className="mt-2">
          <summary className="text-xs text-red-400 cursor-pointer">Show raw code</summary>
          <pre className="mt-2 text-xs bg-red-100 dark:bg-red-900/40 p-2 rounded overflow-x-auto">{chart}</pre>
        </details>
      </div>
    )
  }

  if (!svg) {
    return (
      <div className={`p-4 border rounded-lg bg-muted animate-pulse ${className || ''}`}>
        <div className="h-32 flex items-center justify-center text-muted-foreground text-sm">
          Loading diagram...
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={`my-4 p-4 border rounded-lg bg-card overflow-x-auto ${className || ''}`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
