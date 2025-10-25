interface StatusBadgeProps {
  variant: 'hypothesis' | 'seeking-validation' | 'pre-empirical'
  className?: string
}

export function StatusBadge({ variant, className }: StatusBadgeProps) {
  const badges = {
    'hypothesis': {
      text: 'Hypothesis - Seeking Validation',
      classes: 'bg-amber-100 text-amber-800 border-amber-300'
    },
    'seeking-validation': {
      text: 'Seeking Research Collaborators',
      classes: 'bg-blue-100 text-blue-800 border-blue-300'
    },
    'pre-empirical': {
      text: 'Pre-Empirical Testing Phase',
      classes: 'bg-purple-100 text-purple-800 border-purple-300'
    }
  }
  
  const badge = badges[variant]
  
  return (
    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border-2 ${badge.classes} ${className}`}>
      {badge.text}
    </span>
  )
}
