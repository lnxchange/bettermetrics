'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { HiArrowRight, HiSearch } from 'react-icons/hi'
import { AskAI } from '@/components/ask-ai'
import { MathText } from '@/components/math-text'
import type { GlossaryIndexEntry } from '@/lib/glossary'

function queryTokens(query: string) {
  return query.split(/\s+/).filter(Boolean)
}

function rank(entry: GlossaryIndexEntry, query: string, tokens: string[]) {
  const term = entry.term.toLowerCase()
  if (term === query) return 0
  if (term.startsWith(query)) return 1
  if (term.includes(query)) return 2
  if (tokens.length > 1 && tokens.every(token => term.includes(token))) return 3
  const preview = entry.preview.toLowerCase()
  if (preview.includes(query) || (tokens.length > 0 && tokens.every(token => preview.includes(token)))) return 4
  return -1
}

function HighlightedText({ text, query }: { text: string; query: string }) {
  const trimmed = query.trim()
  if (!trimmed) return <>{text}</>
  const tokens = queryTokens(trimmed.toLowerCase())
  const needles = Array.from(new Set([trimmed.toLowerCase(), ...tokens])).sort((a, b) => b.length - a.length)
  const pattern = needles.map(value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')
  const parts = text.split(new RegExp(`(${pattern})`, 'ig'))
  const needleSet = new Set(needles)
  return (
    <>
      {parts.map((part, index) =>
        needleSet.has(part.toLowerCase()) ? (
          <mark key={index} className="bg-yellow-200 text-gray-900">
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  )
}

export function GlossaryIndex({ entries }: { entries: GlossaryIndexEntry[] }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null)

  const letters = useMemo(() => Array.from(new Set(entries.map(entry => entry.letter))).sort(), [entries])

  const query = searchQuery.trim().toLowerCase()
  const visible = useMemo(() => {
    const tokens = queryTokens(query)
    const ranked: { entry: GlossaryIndexEntry; rank: number }[] = []
    for (const entry of entries) {
      if (selectedLetter && entry.letter !== selectedLetter) continue
      if (!query) {
        ranked.push({ entry, rank: 0 })
        continue
      }
      const r = rank(entry, query, tokens)
      if (r >= 0) ranked.push({ entry, rank: r })
    }
    if (query) ranked.sort((a, b) => a.rank - b.rank || a.entry.term.localeCompare(b.entry.term))
    return ranked.map(item => item.entry)
  }, [entries, query, selectedLetter])

  // Group by letter when browsing; flat ranked list when searching.
  const groups = useMemo(() => {
    if (query) return [{ letter: null as string | null, entries: visible }]
    const map = new Map<string, GlossaryIndexEntry[]>()
    for (const entry of visible) {
      if (!map.has(entry.letter)) map.set(entry.letter, [])
      map.get(entry.letter)!.push(entry)
    }
    return Array.from(map.entries()).map(([letter, list]) => ({ letter, entries: list }))
  }, [visible, query])

  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-blue-50 via-white to-gray-50 py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Glossary</h1>
            <p className="mx-auto max-w-3xl text-xl text-gray-600">
              Every defined term in Chapter 2 of the Treatise. Capitalised terms carry these meanings. Open a
              term for its full definition, explanation and derivation.
            </p>
          </div>
        </div>
      </section>

      <section className="sticky top-16 z-30 border-b bg-white py-6">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="relative mb-4 w-full">
            <HiSearch className="absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Search terms…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              aria-label="Search glossary terms"
              className="w-full rounded-xl border-2 border-gray-300 bg-white py-4 pl-12 pr-6 text-base text-gray-900 placeholder:text-gray-500 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <nav className="flex flex-wrap gap-1" aria-label="Letters">
              {letters.map(letter => (
                <button
                  key={letter}
                  type="button"
                  onClick={() => setSelectedLetter(current => (current === letter ? null : letter))}
                  className={`rounded-md px-2.5 py-1 text-sm font-medium transition ${
                    selectedLetter === letter ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {letter}
                </button>
              ))}
            </nav>
            <p className="text-sm text-gray-500">
              {query
                ? `${visible.length} matching ${visible.length === 1 ? 'term' : 'terms'}`
                : `Showing ${visible.length} of ${entries.length} terms`}
            </p>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {entries.length === 0 && (
            <p className="py-12 text-center text-gray-600">The glossary has not been loaded from Chapter 2 yet.</p>
          )}

          {groups.map(group => (
            <div key={group.letter ?? 'results'} className="mb-10">
              {group.letter && (
                <h2 id={`letter-${group.letter}`} className="mb-4 scroll-mt-48 text-2xl font-bold text-gray-900">
                  {group.letter}
                </h2>
              )}
              <ul className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
                {group.entries.map(entry => (
                  <li key={entry.slug}>
                    {/* Kept deliberately lean: this list is rendered ~700 times,
                        so no per-item icons, ids or wrapper elements. */}
                    <Link
                      href={`/glossary/${entry.slug}`}
                      className="group block px-5 py-4 transition hover:bg-gray-50"
                    >
                      <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-700">
                        <HighlightedText text={entry.term} query={searchQuery} />
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        <MathText text={entry.preview} />
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {entries.length > 0 && visible.length === 0 && (
            <div className="py-12 text-center">
              <p className="mb-4 text-gray-600">No glossary entry matches &ldquo;{searchQuery}&rdquo;.</p>
              <AskAI
                variant="button"
                question={`What does "${searchQuery.trim()}" mean in the AIM Framework, and where is it defined in the Treatise?`}
                label={`Ask the AI what "${searchQuery.trim()}" means`}
              />
            </div>
          )}
        </div>
      </section>

      <section className="bg-gray-50 py-12">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <p className="mb-6 text-gray-600">
            {entries.length} terms, taken from Chapter 2 of the Treatise and refreshed when that chapter changes.
            The chat has the full book.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/treatise"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              The treatise
              <HiArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/axioms"
              className="inline-flex items-center justify-center rounded-lg border-2 border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
            >
              The nine axioms
              <HiArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/chat"
              className="inline-flex items-center justify-center rounded-lg border-2 border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
            >
              Ask the AI
              <HiArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
