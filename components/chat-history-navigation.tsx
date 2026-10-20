'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'

import { IconSpinner } from '@/components/ui/icons'

interface ChatHistoryNavigationValue {
  pendingHref: string | null
  selectChat: (href: string) => void
}

const ChatHistoryNavigationContext = createContext<ChatHistoryNavigationValue>({
  pendingHref: null,
  selectChat: () => {}
})

export function useChatHistoryNavigation() {
  return useContext(ChatHistoryNavigationContext)
}

export function ChatHistoryNavigation({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [pendingHref, setPendingHref] = useState<string | null>(null)
  const selectChat = useCallback((href: string) => {
    setPendingHref(href)
  }, [])
  const value = useMemo(() => ({ pendingHref, selectChat }), [pendingHref, selectChat])

  useEffect(() => {
    setPendingHref(null)
  }, [pathname])

  useEffect(() => {
    if (!pendingHref) return
    const timer = window.setTimeout(() => setPendingHref(null), 20000)
    return () => window.clearTimeout(timer)
  }, [pendingHref])

  return (
    <ChatHistoryNavigationContext.Provider value={value}>
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      {pendingHref && (
        <div
          className="fixed inset-x-0 bottom-0 top-[7.5rem] z-40 flex animate-in fade-in flex-col items-center justify-center gap-3 bg-background text-muted-foreground duration-150"
          role="status"
          aria-live="polite"
        >
          <IconSpinner className="h-6 w-6" />
          <p className="text-sm">Loading chat</p>
        </div>
      )}
    </ChatHistoryNavigationContext.Provider>
  )
}
