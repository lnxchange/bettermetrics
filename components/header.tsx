import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'

import { cn } from '@/lib/utils'
import { auth } from '@/auth'
import { clearChats } from '@/app/actions'
import { Button, buttonVariants } from '@/components/ui/button'
import { Sidebar } from '@/components/sidebar'
import { SidebarList } from '@/components/sidebar-list'
import {
  IconGitHub,
  IconNextChat,
  IconSeparator,
  IconVercel
} from '@/components/ui/icons'
import { SidebarFooter } from '@/components/sidebar-footer'
import { ThemeToggle } from '@/components/theme-toggle'
import { ClearHistory } from '@/components/clear-history'
import { UserMenu } from '@/components/user-menu'
import { cookies } from 'next/headers'

export async function Header() {
  const cookieStore = cookies()
  const session = await auth({ cookieStore })
  return (
    <header className="sticky top-0 z-50 flex h-16 w-full shrink-0 items-center justify-between border-b bg-gradient-to-b from-background/10 via-background/50 to-background/80 px-4 backdrop-blur-xl">
      <div className="flex items-center">
        {session?.user ? (
          <Sidebar>
            <React.Suspense fallback={<div className="flex-1 overflow-auto" />}>
              <SidebarList userId={session?.user?.id} />
            </React.Suspense>
            <SidebarFooter>
              <ThemeToggle />
              <ClearHistory clearChats={clearChats} />
            </SidebarFooter>
          </Sidebar>
        ) : (
          <Link href="/" className="flex items-center">
            <Image
              src="/AIM Logo.png"
              alt="AIM Framework"
              width={24}
              height={24}
              className="mr-2"
            />
          </Link>
        )}
        <div className="flex items-center">
          <IconSeparator className="h-6 w-6 text-muted-foreground/50" />
          {session?.user ? (
            <UserMenu user={session.user} />
          ) : (
            <Button variant="link" asChild className="-ml-2">
              <Link href="/sign-in">Login</Link>
            </Button>
          )}
        </div>
      </div>

      {/* AIM Framework Navigation */}
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
    </header>
  )
}
