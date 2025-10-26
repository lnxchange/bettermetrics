'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import Chat component to ensure it only loads on client-side
const Chat = dynamic(() => import('@/components/chat').then(mod => ({ default: mod.Chat })), {
  ssr: false,
  loading: () => null
})

export function HiddenChat() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render anything until mounted (prevents hydration mismatch)
  if (!mounted) {
    return null
  }

  return (
    <div className="hidden">
      <Chat id="hidden-chat-id" />
    </div>
  )
}
