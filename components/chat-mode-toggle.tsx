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
        Academic
      </span>
      <Switch
        checked={mode === 'layperson'}
        onCheckedChange={checked => setMode(checked ? 'layperson' : 'academic')}
        aria-label="Toggle between Academic and Plain English response mode"
      />
      <span className={mode === 'layperson' ? 'font-medium' : 'text-muted-foreground'}>
        Plain English
      </span>
    </div>
  )
}
