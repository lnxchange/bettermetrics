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
    <header className="sticky top-0 z-50 flex h-16 w-full shrink-0 items-center justify-between border-b bg-white/95 backdrop-blur-xl px-4 md:px-6 lg:px-8">
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
            <Button variant="default" asChild className="-ml-2 bg-gray-900 text-white hover:bg-gray-800">
              <Link href="/sign-in">Login</Link>
            </Button>
          )}
        </div>
      </div>

      {/* Desktop Navigation - Three Primary Audiences */}
      <div className="hidden items-center space-x-6 md:flex">
        <Link
          href="/about"
          className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >
          About
        </Link>

        {/* For Individuals Dropdown */}
        <div className="group relative">
          <button className="flex items-center text-sm font-medium text-muted-foreground transition hover:text-foreground">
            For Individuals
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
          <div className="absolute left-0 top-full z-50 hidden w-72 rounded-lg border-2 border-gray-200 bg-white shadow-xl group-hover:block">
            <div className="p-2">
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                Practical Tools
              </div>
              <Link
                href="/understand-your-motivations"
                className="block rounded px-4 py-2 text-sm text-gray-700 hover:bg-teal-50"
              >
                <div className="font-semibold">Understand Your Motivations</div>
                <div className="text-xs text-gray-500">Self-diagnosis tools and everyday examples</div>
              </Link>
              <Link
                href="/understand-yourself"
                className="block rounded px-4 py-2 text-sm text-gray-700 hover:bg-teal-50"
              >
                <div className="font-semibold">Apply to Your Life</div>
                <div className="text-xs text-gray-500">Career, relationships, and personal growth</div>
              </Link>
              <div className="my-2 border-t border-gray-200"></div>
              <Link
                href="/chat"
                className="block rounded px-4 py-2 text-sm text-gray-700 hover:bg-primary-50"
              >
                <div className="font-semibold">Ask the AI Chatbot</div>
                <div className="text-xs text-gray-500">Get personalized answers about AIM</div>
              </Link>
            </div>
          </div>
        </div>

        {/* For Practitioners Dropdown */}
        <div className="group relative">
          <button className="flex items-center text-sm font-medium text-muted-foreground transition hover:text-foreground">
            For Practitioners
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
          <div className="absolute left-0 top-full z-50 hidden w-80 rounded-lg border-2 border-gray-200 bg-white shadow-xl group-hover:block">
            <div className="p-2">
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                Applications by Domain
              </div>
              <Link
                href="/research/organizations"
                className="block rounded px-4 py-2 text-sm text-gray-700 hover:bg-amber-50"
              >
                <div className="font-semibold">🏢 Organizations</div>
                <div className="text-xs text-gray-500">From status tournaments to mission-driven work</div>
              </Link>
              <Link
                href="/research/health-policy"
                className="block rounded px-4 py-2 text-sm text-gray-700 hover:bg-amber-50"
              >
                <div className="font-semibold">🏥 Health & Policy</div>
                <div className="text-xs text-gray-500">Separating need from social amplification</div>
              </Link>
              <Link
                href="/research/economics"
                className="block rounded px-4 py-2 text-sm text-gray-700 hover:bg-amber-50"
              >
                <div className="font-semibold">💰 Economics</div>
                <div className="text-xs text-gray-500">Endogenous preferences and market dynamics</div>
              </Link>
              <Link
                href="/research/law"
                className="block rounded px-4 py-2 text-sm text-gray-700 hover:bg-amber-50"
              >
                <div className="font-semibold">⚖️ Law</div>
                <div className="text-xs text-gray-500">Defining fairness, justice, and respect</div>
              </Link>
              <Link
                href="/research/psychology"
                className="block rounded px-4 py-2 text-sm text-gray-700 hover:bg-amber-50"
              >
                <div className="font-semibold">🧠 Psychology</div>
                <div className="text-xs text-gray-500">Protecting intrinsic motivation</div>
              </Link>
              <Link
                href="/research/marketing"
                className="block rounded px-4 py-2 text-sm text-gray-700 hover:bg-amber-50"
              >
                <div className="font-semibold">📈 Marketing</div>
                <div className="text-xs text-gray-500">Authentic engagement vs viral trends</div>
              </Link>
              <Link
                href="/research/education"
                className="block rounded px-4 py-2 text-sm text-gray-700 hover:bg-amber-50"
              >
                <div className="font-semibold">📚 Education</div>
                <div className="text-xs text-gray-500">Protecting curiosity from status competition</div>
              </Link>
              <div className="my-2 border-t border-gray-200"></div>
              <Link
                href="/research"
                className="block rounded px-4 py-2 text-sm font-semibold text-primary-600 hover:bg-primary-50"
              >
                View All Applications →
              </Link>
            </div>
          </div>
        </div>

        {/* For Researchers Dropdown */}
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
          <div className="absolute left-0 top-full z-50 hidden w-80 rounded-lg border-2 border-gray-200 bg-white shadow-xl group-hover:block">
            <div className="p-2">
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                Framework & Theory
              </div>
              <Link
                href="/about"
                className="block rounded px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
              >
                <div className="font-semibold">About AIM Framework</div>
                <div className="text-xs text-gray-500">Core concepts and neural foundation</div>
              </Link>
              <Link
                href="/research/theories"
                className="block rounded px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
              >
                <div className="font-semibold">AIM & Existing Theories</div>
                <div className="text-xs text-gray-500">How AIM relates to SDT, Girard, economics</div>
              </Link>
              <Link
                href="/research/definitions"
                className="block rounded px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
              >
                <div className="font-semibold">Scientific Definitions</div>
                <div className="text-xs text-gray-500">Precise terminology and measurements</div>
              </Link>
              <Link
                href="/research/hypothesis"
                className="block rounded px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
              >
                <div className="font-semibold">Research Hypothesis</div>
                <div className="text-xs text-gray-500">Formal proposal for empirical testing</div>
              </Link>
              <div className="my-2 border-t border-gray-200"></div>
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                Research Programme
              </div>
              <Link
                href="/research-resources"
                className="block rounded px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
              >
                <div className="font-semibold">Research Documents</div>
                <div className="text-xs text-gray-500">Comprehensive reports and papers</div>
              </Link>
              <Link
                href="/research-resources#predictions"
                className="block rounded px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
              >
                <div className="font-semibold">Testable Predictions</div>
                <div className="text-xs text-gray-500">Falsifiable hypotheses by domain</div>
              </Link>
              <Link
                href="/contact"
                className="block rounded px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
              >
                <div className="font-semibold">Collaborate</div>
                <div className="text-xs text-gray-500">Join the research programme</div>
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
        
        {session?.user?.user_metadata?.is_admin && (
          <Link
            href="/admin"
            className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            Admin
          </Link>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className="flex items-center space-x-2 md:hidden">
        <ThemeToggle />
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-gray-900 hover:text-gray-700"
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

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute left-0 right-0 top-16 z-40 border-b border-gray-200 bg-white shadow-lg md:hidden">
          <div className="mx-auto max-w-7xl space-y-1 px-4 py-4">
            <Link
              href="/about"
              className="block rounded px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            
            {/* For Individuals Section */}
            <div className="border-t border-gray-200 pt-2">
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                For Individuals
              </div>
              <Link
                href="/understand-your-motivations"
                className="block rounded px-4 py-2 text-sm text-gray-700 hover:bg-teal-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Understand Your Motivations
              </Link>
              <Link
                href="/understand-yourself"
                className="block rounded px-4 py-2 text-sm text-gray-700 hover:bg-teal-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Apply to Your Life
              </Link>
              <Link
                href="/chat"
                className="block rounded px-4 py-2 text-sm text-gray-700 hover:bg-primary-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Ask the AI Chatbot
              </Link>
            </div>

            {/* For Practitioners Section */}
            <div className="border-t border-gray-200 pt-2">
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                For Practitioners
              </div>
              <Link
                href="/research/organizations"
                className="block rounded px-4 py-2 text-sm text-gray-700 hover:bg-amber-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                🏢 Organizations
              </Link>
              <Link
                href="/research/health-policy"
                className="block rounded px-4 py-2 text-sm text-gray-700 hover:bg-amber-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                🏥 Health & Policy
              </Link>
              <Link
                href="/research/economics"
                className="block rounded px-4 py-2 text-sm text-gray-700 hover:bg-amber-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                💰 Economics
              </Link>
              <Link
                href="/research/law"
                className="block rounded px-4 py-2 text-sm text-gray-700 hover:bg-amber-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                ⚖️ Law
              </Link>
              <Link
                href="/research/psychology"
                className="block rounded px-4 py-2 text-sm text-gray-700 hover:bg-amber-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                🧠 Psychology
              </Link>
              <Link
                href="/research/marketing"
                className="block rounded px-4 py-2 text-sm text-gray-700 hover:bg-amber-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                📈 Marketing
              </Link>
              <Link
                href="/research/education"
                className="block rounded px-4 py-2 text-sm text-gray-700 hover:bg-amber-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                📚 Education
              </Link>
            </div>

            {/* For Researchers Section */}
            <div className="border-t border-gray-200 pt-2">
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                For Researchers
              </div>
              <Link
                href="/research/theories"
                className="block rounded px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                AIM & Existing Theories
              </Link>
              <Link
                href="/research/definitions"
                className="block rounded px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Scientific Definitions
              </Link>
              <Link
                href="/research/hypothesis"
                className="block rounded px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Research Hypothesis
              </Link>
              <Link
                href="/research-resources"
                className="block rounded px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Research Documents
              </Link>
              <Link
                href="/contact"
                className="block rounded px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Collaborate
              </Link>
            </div>

            <div className="border-t border-gray-200 pt-2">
              <Link
                href="/contact"
                className="block rounded px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </div>

            {session?.user?.user_metadata?.is_admin && (
              <div className="border-t border-gray-200 pt-2">
                <Link
                  href="/admin"
                  className="block rounded px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Admin
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
