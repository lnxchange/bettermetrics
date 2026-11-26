'use client'

import { useEffect, useRef } from 'react'

import { FeatureImageApp } from '@/lib/feature-image-app'

export function FeatureImageTool() {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = root.current
    if (!node) return
    return FeatureImageApp.mount(node)
  }, [])

  return <div ref={root} />
}
