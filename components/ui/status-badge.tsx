import * as React from 'react'
import { cn } from '@/lib/utils'

export interface StatusBadgeProps {
  variant?: 'pre-empirical' | 'validated' | 'developing' | 'hypothesis'
  className?: string
}

export function StatusBadge({ variant = 'pre-empirical', className }: StatusBadgeProps) {
  const variants = {
    'pre-empirical': {
      label: 'Pre-Empirical Validation',
      className: 'bg-amber-100 text-amber-900 border-amber-300'
    },
    'validated': {
      label: 'Empirically Validated',
      className: 'bg-green-100 text-green-900 border-green-300'
    },
    'developing': {
      label: 'Rapidly Developing',
      className: 'bg-blue-100 text-blue-900 border-blue-300'
    },
    'hypothesis': {
      label: 'Testable Hypothesis',
      className: 'bg-purple-100 text-purple-900 border-purple-300'
    }
  }

  const config = variants[variant]

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border-2 px-4 py-1.5 text-sm font-semibold',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  )
}
