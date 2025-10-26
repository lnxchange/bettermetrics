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

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          {/* About */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">
              About AIM
            </h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <Link href="/" className="transition hover:text-primary-600">
                  Welcome to Use Better Metrics
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="transition hover:text-primary-600"
                >
                  Framework Overview
                </Link>
              </li>
              <li>
                <Link
                  href="/understand-your-motivations"
                  className="transition hover:text-primary-600"
                >
                  Understand Your Motivations
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="transition hover:text-primary-600"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Research Areas */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">
              Research Areas
            </h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <Link
                  href="/research"
                  className="transition hover:text-primary-600"
                >
                  All Research
                </Link>
              </li>
              <li>
                <Link
                  href="/research/economics"
                  className="transition hover:text-primary-600"
                >
                  Economics
                </Link>
              </li>
              <li>
                <Link
                  href="/research/psychology"
                  className="transition hover:text-primary-600"
                >
                  Psychology
                </Link>
              </li>
              <li>
                <Link
                  href="/research/health-policy"
                  className="transition hover:text-primary-600"
                >
                  Health & Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/research/law"
                  className="transition hover:text-primary-600"
                >
                  Law
                </Link>
              </li>
              <li>
                <Link
                  href="/research/education"
                  className="transition hover:text-primary-600"
                >
                  Education
                </Link>
              </li>
              <li>
                <Link
                  href="/research/organizations"
                  className="transition hover:text-primary-600"
                >
                  Organizations
                </Link>
              </li>
              <li>
                <Link
                  href="/research/marketing"
                  className="transition hover:text-primary-600"
                >
                  Marketing
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <Link
                  href="/chat"
                  className="transition hover:text-primary-600"
                >
                  Try AI Chat
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">
              Connect
            </h3>
            <p className="mb-4 text-sm text-gray-600">
              Join researchers, practitioners, and organizations exploring the
              AIM Framework.
            </p>
          </div>
        </div>

        {/* Academic Disclaimer */}
        <div className="mt-8 border-t border-gray-300 pt-8">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-6">
            <h4 className="mb-2 font-semibold text-gray-900">
              Academic Disclaimer
            </h4>
            <p className="text-sm text-gray-700">
              The AIM Motivation Framework is a theoretical synthesis that has
              not been empirically validated through peer-reviewed research. All
              claims are hypotheses subject to testing and falsification. We
              welcome critical evaluation and testing.
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="text-sm text-gray-600">
              © 2025 Yule Guttenbeil - All rights reserved. Material on this
              site may be used for validation research and personal use only.
            </div>
            <div className="mt-4 text-sm text-gray-600 md:mt-0">
              Built by Yule Guttenbeil
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
