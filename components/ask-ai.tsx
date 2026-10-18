import Link from 'next/link'
import { cn } from '@/lib/utils'

/**
 * Deep link into the chat with a question pre-loaded. This is the funnel:
 * pages give enough to raise a question, and these chips hand it to the
 * corpus-backed chat instead of the page trying to answer it.
 */
export function chatHref(question: string) {
  return `/chat?q=${encodeURIComponent(question)}`
}

export function AskAI({
  question,
  label,
  className,
  variant = 'chip'
}: {
  question: string
  /** Visible text; defaults to the question itself */
  label?: string
  className?: string
  variant?: 'chip' | 'button' | 'link'
}) {
  const base =
    variant === 'button'
      ? 'inline-flex items-center rounded-lg bg-primary-600 px-5 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-primary-700'
      : variant === 'link'
      ? 'inline-flex items-center text-primary-600 hover:underline'
      : 'inline-flex items-center rounded-full border border-gray-300 bg-white px-3.5 py-1.5 text-sm text-gray-800 transition hover:border-primary-500 hover:bg-primary-50 hover:text-primary-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100'

  return (
    <Link href={chatHref(question)} className={cn(base, className)}>
      <svg
        className="mr-1.5 h-3.5 w-3.5 shrink-0 opacity-70"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
        />
      </svg>
      {label ?? question}
    </Link>
  )
}

export function AskAIGroup({
  questions,
  heading = 'Ask the AI',
  className
}: {
  questions: string[]
  heading?: string | null
  className?: string
}) {
  return (
    <div className={cn('mt-6', className)}>
      {heading && (
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
          {heading}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        {questions.map(q => (
          <AskAI key={q} question={q} />
        ))}
      </div>
    </div>
  )
}
