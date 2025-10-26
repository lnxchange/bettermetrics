'use client'

import { useEffect, useState } from 'react'
import { Chat } from '@/components/chat'
import { nanoid } from '@/lib/utils'

export function HiddenChat() {
  const [id, setId] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Ensure we're on client-side
    setMounted(true)
    // Generate ID on client-side only
    setId(nanoid())
  }, [])

  // Don't render anything until mounted (prevents hydration mismatch)
  if (!mounted || !id) {
    return null
  }

  return (
    <div className="hidden">
      <Chat id={id} />
    </div>
  )
}
