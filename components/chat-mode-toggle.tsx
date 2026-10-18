'use client'

import { Switch } from '@/components/ui/switch'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'

export function ChatModeToggle() {
  const [mode, setMode] = useLocalStorage<'academic' | 'layperson'>(
    'aim-chat-mode',
    'layperson'
  )

  return (
    <label className="flex cursor-pointer items-center gap-2 text-xs">
      <span className={mode === 'layperson' ? 'font-medium text-foreground' : ''}>
        Plain English
      </span>
      <Switch
        checked={mode === 'academic'}
        onCheckedChange={checked => setMode(checked ? 'academic' : 'layperson')}
        aria-label="Toggle academic mode"
        className="scale-75"
      />
      <span className={mode === 'academic' ? 'font-medium text-foreground' : ''}>
        Academic
      </span>
    </label>
  )
}
