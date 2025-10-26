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
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">About AIM</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <Link href="/" className="hover:text-primary-600 transition">
                  Welcome to Use Better Metrics
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary-600 transition">
                  Framework Overview
                </Link>
              </li>
              <li>
                <Link href="/understand-your-motivations" className="hover:text-primary-600 transition">
                  Understand Your Motivations
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary-600 transition">
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
                <Link href="/research" className="hover:text-primary-600 transition">
                  All Research
                </Link>
              </li>
              <li>
                <Link href="/research/economics" className="hover:text-primary-600 transition">
                  Economics
                </Link>
              </li>
              <li>
                <Link href="/research/psychology" className="hover:text-primary-600 transition">
                  Psychology
                </Link>
              </li>
              <li>
                <Link href="/research/health-policy" className="hover:text-primary-600 transition">
                  Health & Policy
                </Link>
              </li>
              <li>
                <Link href="/research/law" className="hover:text-primary-600 transition">
                  Law
                </Link>
              </li>
              <li>
                <Link href="/research/education" className="hover:text-primary-600 transition">
                  Education
                </Link>
              </li>
              <li>
                <Link href="/research/organizations" className="hover:text-primary-600 transition">
                  Organizations
                </Link>
              </li>
              <li>
                <Link href="/research/marketing" className="hover:text-primary-600 transition">
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
                <Link href="/chat" className="hover:text-primary-600 transition">
                  Try AI Chat
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Connect</h3>
            <p className="text-sm text-gray-600 mb-4">
              Join researchers, practitioners, and organizations exploring the AIM Framework.
            </p>
          </div>
        </div>

        {/* Academic Disclaimer */}
        <div className="border-t border-gray-300 mt-8 pt-8">
          <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
            <h4 className="font-semibold text-gray-900 mb-2">Academic Disclaimer</h4>
            <p className="text-sm text-gray-700">
              The AIM Motivation Framework is a theoretical synthesis that has not been empirically validated 
              through peer-reviewed research. All claims are hypotheses subject to testing and falsification. 
              We welcome critical evaluation and testing.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-600">
              © 2025 Yule Guttenbeil - All rights reserved. Material on this site may be used for validation research and personal use only.
            </div>
            <div className="text-sm text-gray-600 mt-4 md:mt-0">
              Built by Yule Guttenbeil
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
