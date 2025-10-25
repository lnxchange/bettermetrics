import * as React from 'react'
import Link from 'next/link'

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
              {/* @ts-ignore */}
              <SidebarList userId={session?.user?.id} />
            </React.Suspense>
            <SidebarFooter>
              <ThemeToggle />
              <ClearHistory clearChats={clearChats} />
            </SidebarFooter>
          </Sidebar>
        ) : (
          <Link href="/" target="_blank" rel="nofollow">
            <IconNextChat className="mr-2 h-6 w-6 dark:hidden" inverted />
            <IconNextChat className="mr-2 hidden h-6 w-6 dark:block" />
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
      <div className="hidden md:flex items-center space-x-6">
        <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition">
          About
        </Link>
        
        {/* Research Dropdown */}
        <div className="relative group">
          <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition flex items-center">
            For Researchers
            <svg className="ml-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <div className="absolute hidden group-hover:block top-full left-0 w-64 bg-white border-2 border-gray-200 rounded-lg shadow-xl z-50">
            <div className="p-2">
              <Link href="/research-resources" className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 rounded">
                Research Documents
              </Link>
              <Link href="/research-resources#predictions" className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 rounded">
                Testable Predictions
              </Link>
              <Link href="/research" className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 rounded">
                Research Areas
              </Link>
              <Link href="/contact" className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 rounded">
                Collaborate
              </Link>
            </div>
          </div>
        </div>
        
        {/* For Everyone Dropdown */}
        <div className="relative group">
          <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition flex items-center">
            For Everyone
            <svg className="ml-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <div className="absolute hidden group-hover:block top-full left-0 w-64 bg-white border-2 border-gray-200 rounded-lg shadow-xl z-50">
            <div className="p-2">
              <Link href="/understand-yourself" className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 rounded">
                Understand Your Motivations
              </Link>
              <Link href="/understand-yourself#career" className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 rounded">
                Career & Relationships
              </Link>
              <Link href="/understand-yourself#red-flags" className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 rounded">
                Red Flags & Patterns
              </Link>
            </div>
          </div>
        </div>
        
        <Link href="/contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition">
          Contact
        </Link>
        <Link href="/chat" className="text-sm font-medium text-muted-foreground hover:text-foreground transition">
          AI Chat
        </Link>
      </div>
      
    </header>
  )
}