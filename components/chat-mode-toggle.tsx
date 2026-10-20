'use client'

import { Switch } from '@/components/ui/switch'

export function ChatModeToggle({
  mode,
  onChange
}: {
  mode: 'academic' | 'layperson'
  onChange: (mode: 'academic' | 'layperson') => void
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-xs">
      <span className={mode === 'layperson' ? 'font-medium text-foreground' : ''}>
        Plain English
      </span>
      <Switch
        checked={mode === 'academic'}
        onCheckedChange={checked => onChange(checked ? 'academic' : 'layperson')}
        aria-label="Toggle academic mode"
        className="scale-75"
      />
      <span className={mode === 'academic' ? 'font-medium text-foreground' : ''}>
        Academic
      </span>
    </label>
  )
}
