import { Metadata } from 'next'
import { ToasterWrapper } from '@/components/toaster-wrapper'
import { fontMono, fontSans } from '@/lib/fonts'
import { cn } from '@/lib/utils'
import { Providers } from '@/components/providers'

export const metadata: Metadata = {
  title: 'AIM Framework Chat',
  description: 'Chat with the AIM Framework AI Assistant'
}

interface ChatLayoutProps {
  children: React.ReactNode
}

export default function ChatLayout({ children }: ChatLayoutProps) {
  return (
    <div className="flex h-screen flex-col">
      {children}
    </div>
  )
}
