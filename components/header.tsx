'use client'

import * as React from 'react'
import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { IconSeparator } from '@/components/ui/icons'
import { ThemeToggle } from '@/components/theme-toggle'
import { UserMenu } from '@/components/user-menu'
import { SearchBar } from '@/components/search-bar'
import { AimMark } from '@/components/aim-mark'

interface HeaderProps {
  session?: any
}

const navLinks = [
  { href: '/theory', label: 'The Theory' },
  { href: '/axioms', label: 'Axioms' },
  { href: '/treatise', label: 'Treatise' },
  { href: '/glossary', label: 'Glossary' },
  { href: '/articles', label: 'Articles' },
  { href: '/about', label: 'About' }
]

function ChatIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
      />
    </svg>
  )
}

export function Header({ session }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const isAdmin = session?.user?.user_metadata?.is_admin

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full shrink-0 items-center justify-between border-b bg-white/95 px-4 backdrop-blur-xl md:px-6 lg:px-8">
      <div className="flex items-center">
        <Link href="/" className="flex items-center" aria-label="AIM home">
          <AimMark className="h-6 w-auto sm:h-7" />
        </Link>
        <div className="ml-2 flex items-center">
          <IconSeparator className="h-6 w-6 text-muted-foreground/50" />
          {session?.user ? (
            <UserMenu user={session.user} />
          ) : (
            <Link
              href="/sign-in"
              className="-ml-1 text-sm font-medium text-muted-foreground transition hover:text-foreground"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>

      {/* Desktop */}
      <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
        {navLinks.map(l => (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              'text-sm font-medium transition hover:text-foreground',
              pathname === l.href || pathname?.startsWith(l.href + '/')
                ? 'text-foreground'
                : 'text-muted-foreground'
            )}
          >
            {l.label}
          </Link>
        ))}
        <div className="hidden w-56 lg:block">
          <SearchBar />
        </div>
        <Link
          href="/chat"
          className="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-primary-700"
        >
          <ChatIcon className="mr-1.5 h-4 w-4" />
          Ask AI
        </Link>
        {isAdmin && (
          <Link
            href="/admin"
            className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            Admin
          </Link>
        )}
        <ThemeToggle />
      </nav>

      {/* Mobile */}
      <div className="flex items-center gap-2 md:hidden">
        <Link
          href="/chat"
          className="inline-flex items-center rounded-md bg-primary-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm"
        >
          <ChatIcon className="mr-1 h-3 w-3" />
          Ask AI
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </Button>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed left-0 right-0 top-16 z-40 max-h-[calc(100svh-4rem)] overflow-y-auto border-b border-gray-200 bg-white shadow-lg md:hidden">
          <div className="space-y-1 px-4 py-4">
            <div className="mb-3">
              <SearchBar onClose={() => setIsMobileMenuOpen(false)} />
            </div>
            {navLinks.map(l => (
              <Link
                key={l.href}
                href={l.href}
                className="block rounded px-3 py-2.5 text-base font-medium text-gray-800 hover:bg-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="block rounded px-3 py-2.5 text-base font-medium text-gray-800 hover:bg-gray-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className="block rounded px-3 py-2.5 text-base font-medium text-gray-800 hover:bg-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin
              </Link>
            )}
            <div className="flex items-center justify-between border-t border-gray-200 pt-3">
              <span className="px-3 text-sm text-gray-500">Theme</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
