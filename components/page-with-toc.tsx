'use client'

import { useTableOfContents } from '@/lib/hooks/use-table-of-contents'
import { TableOfContents, TableOfContentsMobile } from '@/components/table-of-contents'

interface PageWithTocProps {
  children: React.ReactNode
}

export function PageWithToc({ children }: PageWithTocProps) {
  const { headings, activeId, scrollToHeading, shouldShowToc } = useTableOfContents()

  if (!shouldShowToc) {
    return <>{children}</>
  }

  return (
    <>
      <div className="relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {/* Main content */}
            <article className="flex-1 min-w-0">{children}</article>

            {/* TOC sidebar - desktop only */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-20">
                <TableOfContents
                  headings={headings}
                  activeId={activeId}
                  onHeadingClick={scrollToHeading}
                />
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* TOC mobile button */}
      <TableOfContentsMobile
        headings={headings}
        activeId={activeId}
        onHeadingClick={scrollToHeading}
      />
    </>
  )
}

