'use client'

import { useEffect, useState, useCallback } from 'react'

export interface TocHeading {
  id: string
  text: string
  level: number
}

export function useTableOfContents() {
  const [headings, setHeadings] = useState<TocHeading[]>([])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    // Extract headings from the page
    const elements = Array.from(document.querySelectorAll('h2, h3'))
    const tocHeadings: TocHeading[] = elements
      .map(element => ({
        id: element.id || generateId(element.textContent || ''),
        text: element.textContent || '',
        level: parseInt(element.tagName.substring(1))
      }))
      .filter(heading => heading.id && heading.text)

    setHeadings(tocHeadings)

    // Set up IntersectionObserver to track active section
    if (tocHeadings.length === 0) return

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-80px 0px -80% 0px',
        threshold: 0.5
      }
    )

    // Observe all headings
    tocHeadings.forEach(heading => {
      const element = document.getElementById(heading.id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [])

  const scrollToHeading = useCallback((id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 80 // Account for fixed header
      const top = element.getBoundingClientRect().top + window.pageYOffset - offset
      window.scrollTo({ top, behavior: 'smooth' })
      setActiveId(id)
    }
  }, [])

  // Determine if TOC should be shown (3+ H2 headings)
  const shouldShowToc = headings.filter(h => h.level === 2).length >= 3

  return {
    headings,
    activeId,
    scrollToHeading,
    shouldShowToc
  }
}

function generateId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

