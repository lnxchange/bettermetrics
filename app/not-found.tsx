import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true }
}

const destinations = [
  { href: '/theory', label: 'The Theory', note: 'The AIM architecture in seven short sections.' },
  { href: '/articles', label: 'Articles', note: 'The framework applied to economics, law, psychology and more.' },
  { href: '/treatise', label: 'The Treatise', note: 'The current working text of the book.' },
  { href: '/glossary', label: 'Glossary', note: 'Every defined term in the framework.' }
]

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col justify-center px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">404</p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
        This page could not be found
      </h1>
      <p className="mt-4 text-lg text-gray-600">
        The address may have changed when the site moved to aimtheory.org, or the page may have been
        retired. Everything that is published lives under one of the sections below.
      </p>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2">
        {destinations.map(item => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="block rounded-lg border border-gray-200 bg-white p-5 transition hover:border-primary-300 hover:shadow-sm"
            >
              <span className="block text-base font-semibold text-gray-900">{item.label}</span>
              <span className="mt-1 block text-sm text-gray-600">{item.note}</span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-10 text-sm text-gray-500">
        <Link href="/" className="font-medium text-primary-600 hover:text-primary-700">
          Return to the home page
        </Link>
      </p>
    </div>
  )
}
