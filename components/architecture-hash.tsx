'use client'

import { useEffect } from 'react'
import { ArchitectureFragments } from '@/scripts/architecture-fragments'

/** Fragments are not visible to the server redirect, so numbered links from the retired page land here. */
export function ArchitectureHash() {
  useEffect(() => {
    const next = ArchitectureFragments.destination(window.location.hash)
    if (!next || next === window.location.hash) return
    const id = next.slice(1)
    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}${window.location.search}${next}`
    )
    document.getElementById(id)?.scrollIntoView()
  }, [])
  return null
}
