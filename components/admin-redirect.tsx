'use client'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'

export function AdminRedirect({ hash }: { hash: string }) {
  const params = useParams()
  useEffect(() => {
    const id = typeof params?.id === 'string' ? params.id : ''
    const target = hash.includes(':id') ? hash.replace(':id', id) : hash
    window.location.replace(`/admin#${target}`)
  }, [hash, params])
  return null
}
