'use client'

import { useMemo } from 'react'
import { Mermaid } from '@/components/ui/mermaid'

interface ArticleContentProps {
  html: string
  className?: string
}

type ArticlePart =
  | { kind: 'html'; html: string }
  | { kind: 'diagram'; chart: string }

const MERMAID_BLOCK = /<pre><code class="[^"]*mermaid[^"]*">([\s\S]*?)<\/code><\/pre>/gi

function decodeCode(value: string) {
  return value
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
}

function splitDiagrams(html: string): ArticlePart[] {
  const parts: ArticlePart[] = []
  let last = 0
  let match: RegExpExecArray | null
  const pattern = new RegExp(MERMAID_BLOCK.source, MERMAID_BLOCK.flags)
  while ((match = pattern.exec(html)) !== null) {
    if (match.index > last) parts.push({ kind: 'html', html: html.slice(last, match.index) })
    parts.push({ kind: 'diagram', chart: decodeCode(match[1]).trim() })
    last = match.index + match[0].length
  }
  if (last < html.length) parts.push({ kind: 'html', html: html.slice(last) })
  return parts
}

/**
 * Renders article HTML, with Mermaid blocks drawn as diagrams.
 * Marked leaves ```mermaid fences as code blocks. Those are split out
 * before the HTML is inserted, so a re-render cannot drop the figure.
 */
export function ArticleContent({ html, className }: ArticleContentProps) {
  const parts = useMemo(() => splitDiagrams(html), [html])

  return (
    <div className={className}>
      {parts.map((part, index) =>
        part.kind === 'html' ? (
          <div key={index} dangerouslySetInnerHTML={{ __html: part.html }} />
        ) : (
          <div key={index} className="my-6">
            <Mermaid chart={part.chart} />
          </div>
        )
      )}
    </div>
  )
}
