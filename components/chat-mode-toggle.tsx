'use client'

import { Switch } from '@/components/ui/switch'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'

export function ChatModeToggle() {
  const [mode, setMode] = useLocalStorage<'academic' | 'layperson'>(
    'aim-chat-mode',
    'academic'
  )

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className={mode === 'academic' ? 'font-medium' : 'text-muted-foreground'}>
        Academic Mode
      </span>
      <Switch
        checked={mode === 'academic'}
        onCheckedChange={checked => setMode(checked ? 'academic' : 'layperson')}
        aria-label="Toggle Academic Mode — turn off for plain English explanations"
      />
    </div>
  )
}
