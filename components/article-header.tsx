import React from 'react'

interface ArticleHeaderProps {
  title: string
  author?: string
  publishedDate?: string
  modifiedDate?: string
  showVisually?: boolean
}

/**
 * Article header component for Safari Reader compatibility
 *
 * Safari Reader detects articles by looking for semantic HTML elements:
 * - <header> inside <article>
 * - <h1> for title
 * - <time> elements with datetime attributes
 * - Author information
 *
 * Set showVisually={false} to hide this header visually while keeping
 * it available for Safari Reader detection.
 */
export function ArticleHeader({
  title,
  author = 'Yule Guttenbeil',
  publishedDate,
  modifiedDate,
  showVisually = false
}: ArticleHeaderProps) {
  const headerClasses = showVisually
    ? "mb-8 border-b border-gray-200 pb-6"
    : "sr-only" // Screen reader only - hidden but present in DOM

  return (
    <header className={headerClasses}>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
      <div className="text-sm text-gray-600 space-y-1">
        <div>
          By <span className="font-medium">{author}</span>
        </div>
        {publishedDate && (
          <div>
            Published: <time dateTime={publishedDate}>{new Date(publishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
          </div>
        )}
        {modifiedDate && publishedDate !== modifiedDate && (
          <div>
            Updated: <time dateTime={modifiedDate}>{new Date(modifiedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
          </div>
        )}
      </div>
    </header>
  )
}
