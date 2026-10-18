import React from 'react'
import Link from 'next/link'
import { Sidebar } from '@/components/sidebar'
import { SidebarList } from '@/components/sidebar-list'
import { Button } from '@/components/ui/button'
import { IconPlus } from '@/components/ui/icons'
import { ThemeToggle } from '@/components/theme-toggle'

export async function ChatHeader({
  userId,
  isGuest = false
}: {
  userId?: string
  isGuest?: boolean
}) {
  return (
    <div className="flex h-14 shrink-0 items-center justify-between border-b bg-background px-4">
      <div className="flex items-center gap-2">
        {!isGuest && (
          <Sidebar>
            <React.Suspense fallback={<div>Loading...</div>}>
              <SidebarList userId={userId} />
            </React.Suspense>
          </Sidebar>
        )}
        <Button variant="outline" size="icon" asChild>
          <Link href="/chat">
            <IconPlus />
            <span className="sr-only">New Chat</span>
          </Link>
        </Button>
        <span className="ml-2 text-sm font-medium">Ask the AI</span>
      </div>
      <div className="flex items-center gap-3">
        {isGuest && (
          <Link
            href="/sign-in?redirectedFrom=/chat"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Sign in to save chats
          </Link>
        )}
        <ThemeToggle />
      </div>
    </div>
  )
}
