'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { HiArrowRight, HiSearch } from 'react-icons/hi'
import { glossaryEntries, glossaryCategories } from '@/lib/glossary-data'

// JSON-LD Structured Data for the Glossary page
function GlossaryJsonLd() {
  // Create DefinedTerm entries for key terms (subset of most important)
  const keyTerms = glossaryEntries.slice(0, 30).map((entry) => ({
    '@type': 'DefinedTerm',
    name: entry.term,
    description: entry.definition,
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      '@id': 'https://www.usebettermetrics.com/glossary#termset',
      name: 'AIM Framework Glossary'
    }
  }))

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'DefinedTermSet',
        '@id': 'https://www.usebettermetrics.com/glossary#termset',
        name: 'AIM Framework Glossary',
        description:
          'Comprehensive definitions for the AIM Motivation Framework, providing contract-style precision for capitalised terms used throughout the theory.',
        url: 'https://www.usebettermetrics.com/glossary',
        inLanguage: 'en',
        creator: {
          '@type': 'Person',
          '@id': 'https://www.usebettermetrics.com/#YuleGuttenbeil',
          name: 'Yule Guttenbeil',
          jobTitle: 'Principal Commercial Lawyer & Behavioral Systems Architect'
        },
        isPartOf: {
          '@type': 'CreativeWork',
          '@id': 'https://www.usebettermetrics.com/#AIMFramework',
          name: 'AIM Motivation Framework'
        },
        hasDefinedTerm: keyTerms
      },
      {
        '@type': 'WebPage',
        '@id': 'https://www.usebettermetrics.com/glossary',
        name: 'AIM Framework Glossary',
        description:
          'Comprehensive definitions for the AIM Motivation Framework with ' +
          glossaryEntries.length +
          ' terms from Chapter 2.',
        mainEntity: {
          '@id': 'https://www.usebettermetrics.com/glossary#termset'
        },
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: 'https://www.usebettermetrics.com'
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Glossary',
              item: 'https://www.usebettermetrics.com/glossary'
            }
          ]
        }
      }
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

export default function GlossaryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [expandedTerms, setExpandedTerms] = useState<Set<string>>(new Set())

  const filteredEntries = useMemo(() => {
    return glossaryEntries
      .filter((entry) => {
        const matchesSearch =
          searchQuery === '' ||
          entry.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
          entry.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
          entry.explanation.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory =
          selectedCategory === 'All' || entry.category === selectedCategory
        return matchesSearch && matchesCategory
      })
      .sort((a, b) => a.term.localeCompare(b.term))
  }, [searchQuery, selectedCategory])

  const toggleExpanded = (term: string) => {
    setExpandedTerms((prev) => {
      const next = new Set(prev)
      if (next.has(term)) {
        next.delete(term)
      } else {
        next.add(term)
      }
      return next
    })
  }

  return (
    <div className="bg-white">
      <GlossaryJsonLd />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-gray-50 py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Glossary
            </h1>
            <p className="mx-auto mb-6 max-w-3xl text-xl text-gray-600">
              Comprehensive definitions for the AIM Framework—designed as a contract-style
              reference section where capitalised terms have specific, bounded meanings.
            </p>
            <div className="mx-auto max-w-2xl rounded-xl border-2 border-blue-200 bg-blue-50 p-4">
              <p className="text-sm text-gray-700">
                <strong>Usage Note:</strong> Throughout AIM literature, capitalised terms (e.g.,
                &quot;Individual&quot;, &quot;Mimetic Desire&quot;) have the precise meanings defined here. Uncapitalised
                terms default to normal interpretational/vernacular rules.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="border-b bg-white py-6 sticky top-16 z-30">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Search - Full Width on Top */}
          <div className="mb-4">
            <div className="relative w-full">
              <HiSearch className="absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search glossary terms, definitions, or explanations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border-2 border-gray-300 bg-white py-4 pl-12 pr-6 text-base text-gray-900 placeholder-gray-500 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {glossaryCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500">
              Showing {filteredEntries.length} of {glossaryEntries.length} terms
            </p>
          </div>
        </div>
      </section>

      {/* Glossary Entries */}
      <section className="py-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {filteredEntries.map((entry) => {
              const isExpanded = expandedTerms.has(entry.term)
              return (
                <div
                  key={entry.term}
                  className="rounded-lg border-2 border-gray-200 bg-white transition hover:border-gray-300"
                >
                  <button
                    onClick={() => toggleExpanded(entry.term)}
                    className="w-full px-6 py-4 text-left"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="text-lg font-bold text-gray-900">{entry.term}</h3>
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                            {entry.category}
                          </span>
                          {entry.epistemicStatus && (
                            <span className="hidden sm:inline-block rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                              {entry.epistemicStatus}
                            </span>
                          )}
                        </div>
                        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{entry.definition}</p>
                      </div>
                      <svg
                        className={`ml-4 h-5 w-5 flex-shrink-0 text-gray-400 transition ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-gray-200 px-6 py-4">
                      {/* Full Definition */}
                      <div className="mb-4 rounded-lg border-l-4 border-blue-600 bg-blue-50 p-4">
                        <h4 className="mb-1 text-xs font-semibold uppercase text-blue-700">
                          Canonical Definition
                        </h4>
                        <p className="text-sm font-medium text-gray-900">{entry.definition}</p>
                      </div>

                      {/* Explanation */}
                      <div className="mb-4">
                        <h4 className="mb-2 text-sm font-semibold text-gray-700">Explanation</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">{entry.explanation}</p>
                      </div>

                      {/* Related Terms */}
                      {entry.relatedTerms && entry.relatedTerms.length > 0 && (
                        <div>
                          <h4 className="mb-2 text-sm font-semibold text-gray-700">Related Terms</h4>
                          <div className="flex flex-wrap gap-2">
                            {entry.relatedTerms.map((related) => (
                              <button
                                key={related}
                                onClick={() => {
                                  setSearchQuery(related)
                                  setSelectedCategory('All')
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
              )
            })}
          </div>

          {filteredEntries.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-gray-500">No terms found matching your search.</p>
            </div>
          )}
        </div>
      </section>

      {/* Navigation */}
      <section className="bg-gray-50 py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="mb-6 text-gray-600">
            This glossary contains {glossaryEntries.length} terms from Chapter 2 of the AIM Framework book,
            providing a comprehensive reference for the theoretical foundation.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/axioms"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              Read the 8 Axioms
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
