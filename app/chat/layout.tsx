import { Metadata } from 'next'

import Link from 'next/link'

import { ChatHistoryNavigation } from '@/components/chat-history-navigation'

export const metadata: Metadata = {
  title: 'AIM Framework Chat',
  description: 'Chat with the AIM Framework AI Assistant'
}

interface ChatLayoutProps {
  children: React.ReactNode
}

export default function ChatLayout({ children }: ChatLayoutProps) {
  return (
    <div className="fixed inset-x-0 top-16 bottom-0 z-10 flex flex-col bg-background">
      <ChatHistoryNavigation>{children}</ChatHistoryNavigation>
      <footer className="flex gap-4 border-t px-4 py-2 text-xs text-slate-500">
        <Link href="/terms" className="underline">Terms of Use</Link>
        <Link href="/privacy" className="underline">Privacy Policy</Link>
      </footer>
    </div>
  )
}
