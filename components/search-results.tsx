'use client'

import { SearchResult } from '@/lib/hooks/use-search'

interface SearchResultsProps {
  results: SearchResult[]
  selectedIndex: number
  onSelect: (result: SearchResult) => void
  query: string
}

export function SearchResults({ results, selectedIndex, onSelect, query }: SearchResultsProps) {
  if (results.length === 0) {
    return (
      <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-lg border border-gray-200 bg-white shadow-lg">
        <div className="p-4 text-center text-sm text-gray-500">
          No results found for &quot;{query}&quot;
        </div>
      </div>
    )
  }

  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text

    const parts = text.split(new RegExp(`(${query})`, 'gi'))
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className="bg-yellow-200 font-semibold">
          {part}
        </mark>
      ) : (
        part
      )
    )
  }

  return (
    <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[70vh] overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
      <div className="py-2">
        {results.map((result, index) => (
          <button
            key={`${result.page.url}${result.section.anchor}-${index}`}
            onClick={() => onSelect(result)}
            className={`block w-full px-4 py-3 text-left transition hover:bg-gray-50 ${
              index === selectedIndex ? 'bg-primary-50' : ''
            }`}
          >
            <div className="mb-1 flex items-baseline gap-2">
              <span className="font-semibold text-gray-900">
                {highlightMatch(result.page.title, query)}
              </span>
              {result.section.heading !== result.page.title && (
                <>
                  <span className="text-gray-400">›</span>
                  <span className="text-sm text-gray-600">
                    {highlightMatch(result.section.heading, query)}
                  </span>
                </>
              )}
            </div>
            {result.section.content && (
              <p className="line-clamp-2 text-sm text-gray-500">
                {highlightMatch(result.section.content, query)}
              </p>
            )}
            <div className="mt-1 text-xs text-gray-400">
              {result.page.url}
              {result.section.anchor}
            </div>
          </button>
        ))}
      </div>
      <div className="border-t border-gray-200 bg-gray-50 px-4 py-2 text-xs text-gray-500">
        <kbd className="rounded bg-white px-1.5 py-0.5 font-mono shadow">↑↓</kbd> Navigate{' '}
        <kbd className="rounded bg-white px-1.5 py-0.5 font-mono shadow">Enter</kbd> Select{' '}
        <kbd className="rounded bg-white px-1.5 py-0.5 font-mono shadow">Esc</kbd> Close
      </div>
    </div>
  )
}

