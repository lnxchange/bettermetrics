'use client'

import { useEffect, useState } from 'react'
import { Chat } from '@/components/chat'
import { nanoid } from '@/lib/utils'

export function HiddenChat() {
  const [id, setId] = useState<string | null>(null)

  useEffect(() => {
    // Generate ID on client-side only
    setId(nanoid())
  }, [])

  if (!id) {
    return null
  }

  return (
    <div className="hidden">
      <Chat id={id} />
    </div>
  )
}
