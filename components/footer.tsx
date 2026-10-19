import React from 'react'
import Link from 'next/link'

import { cn } from '@/lib/utils'

export function FooterText({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      className={cn(
        'px-2 text-center text-xs leading-normal text-muted-foreground',
        className
      )}
      {...props}
    >
      AIM Framework website built with Next.js and Supabase.
    </p>
  )
}

const links = [
  { href: '/theory', label: 'The Theory' },
  { href: '/axioms', label: 'Axioms' },
  { href: '/treatise', label: 'Treatise' },
  { href: '/glossary', label: 'Glossary' },
  { href: '/articles', label: 'Articles' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' }
]

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm" aria-label="Footer">
            {links.map(l => (
              <Link key={l.href} href={l.href} className="text-gray-600 transition hover:text-primary-600">
                {l.label}
              </Link>
            ))}
            <Link href="/chat" className="font-medium text-primary-600 transition hover:text-primary-700">
              Ask AI
            </Link>
          </nav>
          <p className="max-w-md text-xs text-gray-500">
            AIM is a theoretical synthesis awaiting peer-reviewed validation. Its claims are
            stated so they can be tested; critical evaluation and research collaboration are
            welcome.
          </p>
        </div>
        <div className="mt-8 flex flex-col items-start justify-between gap-2 border-t border-gray-200 pt-6 text-xs text-gray-500 md:flex-row">
          <span>
            © {new Date().getFullYear()} Yule Guttenbeil. Material on this site may be used for
            validation research and personal use.
          </span>
        </div>
      </div>
    </footer>
  )
}
