'use client'

import { useState, useEffect, useCallback } from 'react'
import Fuse from 'fuse.js'

export interface SearchSection {
  heading: string
  anchor: string
  content: string
}

export interface SearchPage {
  title: string
  url: string
  sections: SearchSection[]
}

export interface SearchResult {
  page: SearchPage
  section: SearchSection
  score: number
}

let fuseInstance: Fuse<{ page: SearchPage; section: SearchSection }> | null = null
let searchData: { page: SearchPage; section: SearchSection }[] = []

export function useSearch() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const loadSearchIndex = useCallback(async () => {
    if (isLoaded || isLoading) return

    setIsLoading(true)
    try {
      const response = await fetch('/search-index.json')
      const data = await response.json()

      // Flatten pages and sections for searching
      searchData = []
      data.pages.forEach((page: SearchPage) => {
        page.sections.forEach((section: SearchSection) => {
          searchData.push({ page, section })
        })
      })

      // Initialize Fuse.js
      fuseInstance = new Fuse(searchData, {
        keys: [
          { name: 'page.title', weight: 3 },
          { name: 'section.heading', weight: 2 },
          { name: 'section.content', weight: 1 }
        ],
        threshold: 0.4,
        includeScore: true,
        ignoreLocation: true,
        minMatchCharLength: 2
      })

      setIsLoaded(true)
    } catch (error) {
      console.error('Failed to load search index:', error)
    } finally {
      setIsLoading(false)
    }
  }, [isLoaded, isLoading])

  const search = useCallback(
    (query: string): SearchResult[] => {
      if (!fuseInstance || !query.trim()) return []

      const results = fuseInstance.search(query)

      return results.slice(0, 10).map(result => ({
        page: result.item.page,
        section: result.item.section,
        score: result.score || 0
      }))
    },
    []
  )

  return {
    search,
    loadSearchIndex,
    isLoaded,
    isLoading
  }
}

