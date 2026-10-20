import Link from 'next/link'
import { HiArrowRight } from 'react-icons/hi'

type FrameworkChapter = {
  slug: string
  href: string
  label: string
  title: string
}

const defaults = [
  {
    slug: '4',
    href: '/treatise/4',
    label: 'Chapter 4',
    title: 'The Axiomatic and Architectural Foundation of AIM',
    role: 'States the axioms and the architecture.'
  },
  {
    slug: 'appendix-a',
    href: '/treatise/appendix-a',
    label: 'Appendix A',
    title: 'The Mathematical Structure of the AIM System',
    role: 'The mathematics of that same system.'
  }
]

export function FrameworkCore({
  chapters,
  className
}: {
  chapters?: FrameworkChapter[]
  className?: string
}) {
  const items = defaults.map(item => {
    const loaded = chapters?.find(chapter => chapter.slug === item.slug)
    return loaded ? { ...item, ...loaded } : item
  })

  return (
    <div className={className}>
      <p className="mb-5 max-w-3xl text-lg text-gray-700">
        The framework itself is Chapter 4 and Appendix A, taken together. Chapter 4 states
        the axioms and the architecture. Appendix A is the mathematics of that system. The
        rest of the treatise explains what the framework is and how it plays out.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map(item => (
          <Link
            key={item.slug}
            href={item.href}
            className="group rounded-xl border-2 border-blue-200 bg-white p-5 transition hover:border-blue-400 hover:shadow-md"
          >
            <p className="text-sm font-semibold text-blue-700">{item.label}</p>
            <p className="mt-1 font-bold text-gray-900">{item.title}</p>
            <p className="mt-2 text-sm text-gray-600">{item.role}</p>
            <span className="mt-3 inline-flex items-center text-sm font-semibold text-blue-700 group-hover:underline">
              Read <HiArrowRight className="ml-1 h-4 w-4" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
