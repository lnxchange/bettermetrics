'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { HiSearch, HiX } from 'react-icons/hi'
import { useSearch, SearchResult } from '@/lib/hooks/use-search'
import { SearchResults } from './search-results'

interface SearchBarProps {
  onClose?: () => void
  className?: string
  autoFocus?: boolean
}

export function SearchBar({ onClose, className = '', autoFocus = false }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { search, loadSearchIndex, isLoaded } = useSearch()

  // Load search index on focus
  const handleFocus = useCallback(() => {
    if (!isLoaded) {
      loadSearchIndex()
    }
    setIsOpen(true)
  }, [isLoaded, loadSearchIndex])

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const timeoutId = setTimeout(() => {
      const searchResults = search(query)
      setResults(searchResults)
      setSelectedIndex(0)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query, search])

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) {
      if (e.key === 'Escape') {
        setIsOpen(false)
        inputRef.current?.blur()
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => (prev + 1) % results.length)
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => (prev - 1 + results.length) % results.length)
        break
      case 'Enter':
        e.preventDefault()
        if (results[selectedIndex]) {
          navigateToResult(results[selectedIndex])
        }
        break
      case 'Escape':
        e.preventDefault()
        setIsOpen(false)
        setQuery('')
        inputRef.current?.blur()
        onClose?.()
        break
    }
  }

  const navigateToResult = (result: SearchResult) => {
    const url = result.page.url + result.section.anchor
    router.push(url)
    setIsOpen(false)
    setQuery('')
    onClose?.()
  }

  const handleClear = () => {
    setQuery('')
    setResults([])
    inputRef.current?.focus()
  }

  // Auto-focus if requested
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <HiSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder="Search site..."
          className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-10 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <HiX className="h-5 w-5" />
          </button>
        )}
      </div>

      {isOpen && query && (
        <SearchResults
          results={results}
          selectedIndex={selectedIndex}
          onSelect={navigateToResult}
          query={query}
        />
      )}
    </div>
  )
}

