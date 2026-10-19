'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { HiArrowRight, HiSearch } from 'react-icons/hi'
import { AskAI } from '@/components/ask-ai'
import { MathText } from '@/components/math-text'
import { TreatiseCitation } from '@/components/treatise-citation'

export interface GlossaryEntryView {
  slug: string
  term: string
  letter: string
  definition: string
  explanation: string
  derivation: string | null
  epistemic_status: string | null
  cross_references: string[]
  notes: string | null
}

type MatchGroup = 'term' | 'mention'

interface RankedEntry {
  entry: GlossaryEntryView
  group: MatchGroup
  rank: number
}

function queryTokens(query: string) {
  return query.split(/\s+/).filter(Boolean)
}

function termRank(term: string, query: string, tokens: string[]) {
  if (term === query) return 0
  if (term.startsWith(query)) return 1
  if (term.includes(query)) return 2
  if (tokens.length > 1 && tokens.every(token => term.includes(token))) return 3
  return -1
}

function HighlightedText({ text, query }: { text: string; query: string }) {
  const trimmed = query.trim()
  if (!trimmed) return <>{text}</>
  const tokens = queryTokens(trimmed.toLowerCase())
  const needles = Array.from(new Set([trimmed.toLowerCase(), ...tokens])).sort(
    (a, b) => b.length - a.length
  )
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

export function GlossaryBrowser({ entries }: { entries: GlossaryEntryView[] }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null)
  const [expandedTerms, setExpandedTerms] = useState<Set<string>>(new Set())

  const letters = useMemo(
    () => Array.from(new Set(entries.map(entry => entry.letter))).sort(),
    [entries]
  )

  const filteredEntries = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    const tokens = queryTokens(query)
    const ranked: RankedEntry[] = []

    for (const entry of entries) {
      if (selectedLetter && entry.letter !== selectedLetter) continue
      if (!query) {
        ranked.push({ entry, group: 'term', rank: 0 })
        continue
      }

      const term = entry.term.toLowerCase()
      const rank = termRank(term, query, tokens)
      if (rank >= 0) {
        ranked.push({ entry, group: 'term', rank })
        continue
      }

      const body = `${entry.definition}\n${entry.explanation}`.toLowerCase()
      const mentions =
        body.includes(query) || (tokens.length > 0 && tokens.every(token => body.includes(token)))
      if (mentions) ranked.push({ entry, group: 'mention', rank: 0 })
    }

    if (!query) return ranked

    ranked.sort((a, b) => {
      if (a.group !== b.group) return a.group === 'term' ? -1 : 1
      if (a.rank !== b.rank) return a.rank - b.rank
      return a.entry.term.localeCompare(b.entry.term)
    })
    return ranked
  }, [entries, searchQuery, selectedLetter])

  const query = searchQuery.trim()
  const termHits = query ? filteredEntries.filter(item => item.group === 'term') : filteredEntries
  const mentionHits = query ? filteredEntries.filter(item => item.group === 'mention') : []

  const toggleExpanded = (slug: string) => {
    setExpandedTerms(prev => {
      const next = new Set(prev)
      if (next.has(slug)) next.delete(slug)
      else next.add(slug)
      return next
    })
  }

  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-blue-50 via-white to-gray-50 py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Glossary
            </h1>
            <p className="mx-auto max-w-3xl text-xl text-gray-600">
              Every defined term in Chapter 2 of the Treatise. Capitalised terms carry these
              meanings. For how a term is used in a particular chapter, ask the AI.
            </p>
          </div>
        </div>
      </section>

      <section className="sticky top-16 z-30 border-b bg-white py-6">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="relative mb-4 w-full">
            <HiSearch className="absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search glossary terms, definitions, or explanations..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className={`w-full rounded-xl border-2 border-gray-300 bg-white py-4 pl-12 text-base text-gray-900 placeholder-gray-500 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                searchQuery ? 'pr-12' : 'pr-6'
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-1" aria-label="Letters">
              {letters.map(letter => (
                <button
                  key={letter}
                  onClick={() =>
                    setSelectedLetter(current => (current === letter ? null : letter))
                  }
                  className={`rounded-md px-2.5 py-1 text-sm font-medium transition ${
                    selectedLetter === letter
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {letter}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500">
              {query
                ? `${termHits.length} matching ${termHits.length === 1 ? 'term' : 'terms'}${
                    mentionHits.length > 0 ? `, ${mentionHits.length} other mentions` : ''
                  }`
                : `Showing ${filteredEntries.length} of ${entries.length} terms`}
            </p>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {entries.length === 0 && (
            <p className="py-12 text-center text-gray-600">
              The glossary has not been loaded from Chapter 2 yet.
            </p>
          )}
          <div className="space-y-4">
            {query && termHits.length > 0 && (
              <p className="text-sm font-semibold text-gray-800">Matching terms</p>
            )}
            {[...termHits, ...mentionHits].map((item, index) => {
              const entry = item.entry
              const isExpanded = expandedTerms.has(entry.slug)
              const shortStatus =
                entry.epistemic_status && entry.epistemic_status.length <= 80
                  ? entry.epistemic_status
                  : null
              const showMentionHeading = query && item.group === 'mention' && index === termHits.length
              return (
                <div key={entry.slug}>
                  {showMentionHeading && (
                    <p className="pb-2 pt-4 text-sm font-semibold text-gray-800">
                      Also mentioned in
                    </p>
                  )}
                <div
                  id={`term-${entry.slug}`}
                  className="rounded-lg border-2 border-gray-200 bg-white transition hover:border-gray-300"
                >
                  <button
                    onClick={() => toggleExpanded(entry.slug)}
                    className="w-full px-6 py-4 text-left"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-lg font-bold text-gray-900">
                            <HighlightedText text={entry.term} query={query} />
                          </h3>
                          {shortStatus && (
                            <span className="hidden rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 sm:inline-block">
                              {shortStatus}
                            </span>
                          )}
                        </div>
                        <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                          <MathText text={entry.definition} />
                        </p>
                      </div>
                      <svg
                        className={`ml-4 h-5 w-5 flex-shrink-0 text-gray-400 transition ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-gray-200 px-6 py-4">
                      <div className="mb-4 rounded-lg border-l-4 border-blue-600 bg-blue-50 p-4">
                        <h4 className="mb-1 text-xs font-semibold uppercase text-blue-700">
                          Canonical Definition
                        </h4>
                        <p className="whitespace-pre-wrap text-sm font-medium text-gray-900">
                          <MathText text={entry.definition} />
                        </p>
                      </div>

                      {entry.explanation && (
                        <div className="mb-4">
                          <h4 className="mb-2 text-sm font-semibold text-gray-700">Explanation</h4>
                          <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-600">
                            <MathText text={entry.explanation} />
                          </p>
                        </div>
                      )}

                      {entry.epistemic_status && (
                        <p className="mb-4 text-sm text-gray-600">
                          <span className="font-semibold text-gray-700">Epistemic status. </span>
                          <MathText text={entry.epistemic_status} />
                        </p>
                      )}

                      {entry.derivation && (
                        <p className="mb-4 text-sm text-gray-600">
                          <span className="font-semibold text-gray-700">Derivation. </span>
                          <TreatiseCitation text={entry.derivation} />
                        </p>
                      )}

                      {entry.notes && (
                        <div className="mb-4">
                          <h4 className="mb-2 text-sm font-semibold text-gray-700">Also in the entry</h4>
                          <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-600">
                            <MathText text={entry.notes} />
                          </p>
                        </div>
                      )}

                      {entry.cross_references.length > 0 && (
                        <div>
                          <h4 className="mb-2 text-sm font-semibold text-gray-700">Related Terms</h4>
                          <div className="flex flex-wrap gap-2">
                            {entry.cross_references.map(related => (
                              <button
                                key={related}
                                onClick={() => {
                                  setSearchQuery(related)
                                  setSelectedLetter(null)
                                }}
                                className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200"
                              >
                                {related}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                </div>
              )
            })}
          </div>

          {entries.length > 0 && filteredEntries.length === 0 && (
            <div className="py-12 text-center">
              <p className="mb-4 text-gray-600">
                No glossary entry matches &ldquo;{searchQuery}&rdquo;.
              </p>
              <AskAI
                variant="button"
                question={`What does "${searchQuery.trim()}" mean in the AIM Framework, and where is it defined in the Treatise?`}
                label={`Ask the AI what "${searchQuery.trim()}" means`}
              />
            </div>
          )}
          {filteredEntries.length > 0 && searchQuery.trim() !== '' && (
            <div className="mt-8 text-center">
              <AskAI
                question={`In the AIM Framework, explain "${searchQuery.trim()}" and how it connects to the rest of the architecture.`}
                label={`Ask the AI to explain "${searchQuery.trim()}" in context`}
              />
            </div>
          )}
        </div>
      </section>

      <section className="bg-gray-50 py-12">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <p className="mb-6 text-gray-600">
            {entries.length} terms, taken from Chapter 2 of the Treatise and refreshed when that
            chapter changes. The chat has the full book.
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
