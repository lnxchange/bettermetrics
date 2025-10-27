'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { IconClose } from '@/components/ui/icons'

export function AimNotification() {
  const [isVisible, setIsVisible] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)
  
  useEffect(() => {
    setHasMounted(true)
    const dismissed = sessionStorage.getItem('aim-notification-dismissed')
    if (!dismissed) {
      setIsVisible(true)
    }
  }, [])
  
  const handleDismiss = () => {
    sessionStorage.setItem('aim-notification-dismissed', 'true')
    setIsVisible(false)
  }
  
  // Don't render until mounted to prevent hydration mismatch
  if (!hasMounted) return null
  if (!isVisible) return null
  
  return (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-sm text-gray-700">
      <div className="flex items-center justify-between">
        <span>
          <strong>Note:</strong> AIM is a theoretical hypothesis seeking
          validation. Responses reflect proposed predictions, not established
          findings. This AI has access to the latest research documentation.
          <Link
            href="/research-resources"
            className="ml-2 text-primary-600 hover:underline"
          >
            Learn more →
          </Link>
        </span>
        <button onClick={handleDismiss} className="ml-4 shrink-0">
          <IconClose className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
