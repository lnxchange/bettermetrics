'use client'

import { useEffect, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import { Mermaid } from '@/components/ui/mermaid'

interface ArticleContentProps {
  html: string
  className?: string
}

/**
 * Renders article HTML and hydrates Mermaid code blocks client-side.
 * Marked outputs <pre><code class="language-mermaid">...</code></pre> for
 * ```mermaid blocks; we find these and replace with rendered Mermaid diagrams.
 */
export function ArticleContent({ html, className }: ArticleContentProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const mermaidBlocks = container.querySelectorAll<HTMLElement>(
      'pre > code.language-mermaid'
    )

    mermaidBlocks.forEach((codeEl) => {
      const pre = codeEl.closest('pre')
      if (!pre) return

      const chart = codeEl.textContent?.trim()
      if (!chart) return

      const wrapper = document.createElement('div')
      wrapper.className = 'mermaid-diagram-wrapper my-6'
      pre.parentNode?.replaceChild(wrapper, pre)

      const root = createRoot(wrapper)
      root.render(<Mermaid chart={chart} />)
    })
  }, [html])

  return (
    <div
      ref={containerRef}
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
