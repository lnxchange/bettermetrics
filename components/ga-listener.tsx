'use client'
import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export function GAListener({ measurementId }: { measurementId: string }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!measurementId) return
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')
    // @ts-ignore
    window.gtag?.('config', measurementId, {
      page_path: url
    })
  }, [pathname, searchParams, measurementId])

  return null
}


