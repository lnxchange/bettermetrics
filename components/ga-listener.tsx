'use client'
import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export function GAListener({ measurementId }: { measurementId: string }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const timeoutRef = useRef<number | null>(null)
  const hasSentInitialPageView = useRef(false)

  useEffect(() => {
    if (!measurementId) return
    if (typeof window === 'undefined') return

    const queryString = searchParams?.toString()
    const page_path = `${pathname}${queryString ? `?${queryString}` : ''}`

    // Send initial page view on first mount
    if (!hasSentInitialPageView.current) {
      // @ts-ignore
      if (window.gtag) {
        // @ts-ignore
        window.gtag('config', measurementId, { 
          page_path,
          send_page_view: true 
        })
        hasSentInitialPageView.current = true
        return
      }
    }

    // Debounce subsequent route changes
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = window.setTimeout(() => {
      // @ts-ignore
      if (window.gtag) {
        // @ts-ignore
        window.gtag('config', measurementId, { page_path })
      }
    }, 50)

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [pathname, searchParams, measurementId])

  return null
}


