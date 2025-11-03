'use client'
import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export function GAListener({ measurementId }: { measurementId: string }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    if (!measurementId) return
    if (typeof window === 'undefined') return

    const queryString = searchParams?.toString()
    const page_path = `${pathname}${queryString ? `?${queryString}` : ''}`

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


