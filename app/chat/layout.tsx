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
    <div className="fixed inset-x-0 top-16 bottom-0 z-10 flex flex-col bg-background">
      {children}
    </div>
  )
}
