'use client'

import { useState } from 'react'
import { HiMenu, HiX } from 'react-icons/hi'
import { TocHeading } from '@/lib/hooks/use-table-of-contents'

interface TableOfContentsProps {
  headings: TocHeading[]
  activeId: string
  onHeadingClick: (id: string) => void
}

export function TableOfContents({ headings, activeId, onHeadingClick }: TableOfContentsProps) {
  if (headings.length === 0) return null

  return (
    <nav className="space-y-1">
      <h3 className="mb-4 text-sm font-semibold text-gray-900">On this page</h3>
      <ul className="space-y-2">
        {headings.map(heading => (
          <li key={heading.id} className={heading.level === 3 ? 'pl-4' : ''}>
            <button
              onClick={() => onHeadingClick(heading.id)}
              className={`block w-full text-left text-sm transition ${
                activeId === heading.id
                  ? 'font-semibold text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {heading.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export function TableOfContentsMobile({
  headings,
  activeId,
  onHeadingClick
}: TableOfContentsProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (headings.length === 0) return null

  return (
    <>
      {/* Mobile TOC Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-primary-600 text-white shadow-lg transition hover:bg-primary-700 lg:hidden"
        aria-label="Table of contents"
      >
        <HiMenu className="h-6 w-6" />
      </button>

      {/* Mobile TOC Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto rounded-t-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Table of Contents</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                aria-label="Close"
              >
                <HiX className="h-6 w-6" />
              </button>
            </div>

            <nav>
              <ul className="space-y-3">
                {headings.map(heading => (
                  <li key={heading.id} className={heading.level === 3 ? 'pl-4' : ''}>
                    <button
                      onClick={() => {
                        onHeadingClick(heading.id)
                        setIsOpen(false)
                      }}
                      className={`block w-full text-left transition ${
                        activeId === heading.id
                          ? 'font-semibold text-primary-600'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {heading.text}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}

