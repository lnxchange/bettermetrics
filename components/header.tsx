'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  IconGitHub,
  IconNextChat,
  IconSeparator,
  IconVercel
} from '@/components/ui/icons'
import { ThemeToggle } from '@/components/theme-toggle'
import { UserMenu } from '@/components/user-menu'

interface HeaderProps {
  session?: any
}

export function Header({ session }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full shrink-0 items-center justify-between border-b bg-white/95 backdrop-blur-xl">
      <div className="flex items-center">
        <Link href="/" className="flex items-center">
          <Image
            src="/AIM Logo.png"
            alt="AIM Framework"
            width={24}
            height={24}
            className="mr-2"
          />
        </Link>
        <div className="flex items-center">
          <IconSeparator className="h-6 w-6 text-muted-foreground/50" />
          {session?.user ? (
            <UserMenu user={session.user} />
          ) : (
            <Button variant="outline" asChild className="-ml-2">
              <Link href="/sign-in">Login</Link>
            </Button>
          )}
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden items-center space-x-6 md:flex">
        <Link
          href="/about"
          className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >
          About
        </Link>

        {/* Research Dropdown */}
        <div className="group relative">
          <button className="flex items-center text-sm font-medium text-muted-foreground transition hover:text-foreground">
            For Researchers
            <svg
              className="ml-1 h-4 w-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <div className="absolute left-0 top-full z-50 hidden w-64 rounded-lg border-2 border-gray-200 bg-white shadow-xl group-hover:block">
            <div className="p-2">
              <Link
                href="/research-resources"
                className="block rounded px-4 py-2 text-sm text-gray-700 hover:bg-primary-50"
              >
                Research Documents
              </Link>
              <Link
                href="/research/definitions"
                className="block rounded px-4 py-2 text-sm text-gray-700 hover:bg-primary-50"
              >
                Scientific Definitions
              </Link>
              <Link
                href="/research-resources#predictions"
                className="block rounded px-4 py-2 text-sm text-gray-700 hover:bg-primary-50"
              >
                Testable Predictions
              </Link>
              <Link
                href="/research"
                className="block rounded px-4 py-2 text-sm text-gray-700 hover:bg-primary-50"
              >
                Research Areas
              </Link>
              <Link
                href="/contact"
                className="block rounded px-4 py-2 text-sm text-gray-700 hover:bg-primary-50"
              >
                Collaborate
              </Link>
            </div>
          </div>
        </div>

        {/* For Everyone Dropdown */}
        <div className="group relative">
          <button className="flex items-center text-sm font-medium text-muted-foreground transition hover:text-foreground">
            For Everyone
            <svg
              className="ml-1 h-4 w-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <div className="absolute left-0 top-full z-50 hidden w-64 rounded-lg border-2 border-gray-200 bg-white shadow-xl group-hover:block">
            <div className="p-2">
              <Link
                href="/understand-yourself"
                className="block rounded px-4 py-2 text-sm text-gray-700 hover:bg-primary-50"
              >
                Understand Your Motivations
              </Link>
              <Link
                href="/understand-yourself#career"
                className="block rounded px-4 py-2 text-sm text-gray-700 hover:bg-primary-50"
              >
                Career & Relationships
              </Link>
              <Link
                href="/understand-yourself#red-flags"
                className="block rounded px-4 py-2 text-sm text-gray-700 hover:bg-primary-50"
              >
                Red Flags & Patterns
              </Link>
            </div>
          </div>
        </div>

        <Link
          href="/contact"
          className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >
          Contact
        </Link>
        <Link
          href="/chat"
          className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >
          AI Chat
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <div className="flex items-center space-x-2 md:hidden">
        <ThemeToggle />
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-muted-foreground hover:text-foreground"
          aria-label="Toggle mobile menu"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 z-40 bg-white border-b shadow-lg md:hidden">
          <div className="px-4 py-4 space-y-4">
            <Link
              href="/about"
              className="block text-sm font-medium text-muted-foreground hover:text-foreground"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>

            {/* Mobile Research Section */}
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-2">
                For Researchers
              </div>
              <div className="ml-4 space-y-2">
                <Link
                  href="/research-resources"
                  className="block text-sm text-gray-600 hover:text-foreground"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Research Documents
                </Link>
                <Link
                  href="/research/definitions"
                  className="block text-sm text-gray-600 hover:text-foreground"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Scientific Definitions
                </Link>
                <Link
                  href="/research-resources#predictions"
                  className="block text-sm text-gray-600 hover:text-foreground"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Testable Predictions
                </Link>
                <Link
                  href="/research"
                  className="block text-sm text-gray-600 hover:text-foreground"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Research Areas
                </Link>
                <Link
                  href="/contact"
                  className="block text-sm text-gray-600 hover:text-foreground"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Collaborate
                </Link>
              </div>
            </div>

            {/* Mobile Everyone Section */}
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-2">
                For Everyone
              </div>
              <div className="ml-4 space-y-2">
                <Link
                  href="/understand-yourself"
                  className="block text-sm text-gray-600 hover:text-foreground"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Understand Your Motivations
                </Link>
                <Link
                  href="/understand-yourself#career"
                  className="block text-sm text-gray-600 hover:text-foreground"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Career & Relationships
                </Link>
                <Link
                  href="/understand-yourself#red-flags"
                  className="block text-sm text-gray-600 hover:text-foreground"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Red Flags & Patterns
                </Link>
              </div>
            </div>

            <Link
              href="/contact"
              className="block text-sm font-medium text-muted-foreground hover:text-foreground"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              href="/chat"
              className="block text-sm font-medium text-muted-foreground hover:text-foreground"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              AI Chat
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
