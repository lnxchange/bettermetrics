'use client'

import * as React from 'react'
import { useInView } from 'react-intersection-observer'

import { useAtBottom } from '@/lib/hooks/use-at-bottom'

interface ChatScrollAnchorProps {
  trackVisibility?: boolean
}

export function ChatScrollAnchor({ trackVisibility }: ChatScrollAnchorProps) {
  const [hasMounted, setHasMounted] = React.useState(false)
  const isAtBottom = useAtBottom()
  
  const { ref, entry, inView } = useInView({
    trackVisibility: hasMounted && trackVisibility,
    delay: 100,
    rootMargin: '0px 0px -150px 0px'
  })

  React.useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') return
    
    setHasMounted(true)
  }, [])

  React.useEffect(() => {
    // Only run on client-side after mounting
    if (!hasMounted || typeof window === 'undefined') return
    
    if (isAtBottom && trackVisibility && !inView) {
      entry?.target.scrollIntoView({
        block: 'start'
      })
    }
  }, [inView, entry, isAtBottom, trackVisibility, hasMounted])

  return <div ref={ref} className="h-px w-full" />
}
