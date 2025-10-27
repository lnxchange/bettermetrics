import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AIM Framework Chat',
  description: 'Chat with the AIM Framework AI Assistant'
}

interface ChatLayoutProps {
  children: React.ReactNode
}

export default function ChatLayout({ children }: ChatLayoutProps) {
  return (
    <div className="flex h-screen flex-col pt-16">
      {/* pt-16 accounts for fixed header height */}
      {children}
    </div>
  )
}
