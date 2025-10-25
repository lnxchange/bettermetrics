import React from 'react'
import Link from 'next/link'

import { cn } from '@/lib/utils'
import { ExternalLink } from '@/components/external-link'

export function FooterText({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      className={cn(
        'px-2 text-center text-xs leading-normal text-muted-foreground',
        className
      )}
      {...props}
    >
      Open source AI chatbot built with{' '}
      <ExternalLink href="https://nextjs.org">Next.js</ExternalLink> and{' '}
      <ExternalLink href="https://supabase.com">Supabase</ExternalLink>.
    </p>
  )
}

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">About AIM</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <Link href="/about" >
                  Framework Overview
                </Link>
              </li>
              <li>
                <Link href="/understand-your-motivations" >
                  Understand Your Motivations
                </Link>
              </li>
              <li>
                <Link href="/contact" >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Research Areas */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Research Areas</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <Link href="/research" >
                  All Research
                </Link>
              </li>
              <li>
                <Link href="/research/economics" >
                  Economics
                </Link>
              </li>
              <li>
                <Link href="/research/psychology" >
                  Psychology
                </Link>
              </li>
              <li>
                <Link href="/research/health-policy" >
                  Health & Policy
                </Link>
              </li>
              <li>
                <Link href="/research/law" >
                  Law
                </Link>
              </li>
              <li>
                <Link href="/research/education" >
                  Education
                </Link>
              </li>
              <li>
                <Link href="/research/organizations" >
                  Organizations
                </Link>
              </li>
              <li>
                <Link href="/research/marketing" >
                  Marketing
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <Link href="/chat" >
                  Try AI Chat
                </Link>
              </li>
              <li>
                <Link href="/contact" >
                  Collaborate
                </Link>
              </li>
              <li>
                <ExternalLink href="https://github.com/lnxchange/bettermetrics" >
                  GitHub
                </ExternalLink>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Connect</h3>
            <p className="text-sm text-gray-600 mb-4">
              Join researchers, practitioners, and organizations exploring the AIM Framework.
            </p>
            <div className="flex space-x-4">
              <ExternalLink href="https://github.com/lnxchange/bettermetrics" >
                <span className="sr-only">GitHub</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                </svg>
              </ExternalLink>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-600">
              © 2024 Use Better Metrics. All rights reserved.
            </div>
            <div className="text-sm text-gray-600 mt-4 md:mt-0">
              Built with the AIM Motivation Framework
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
