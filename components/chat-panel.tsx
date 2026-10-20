import { type UseChatHelpers } from 'ai/react'

import { Button } from '@/components/ui/button'
import { PromptForm } from '@/components/prompt-form'
import { ButtonScrollToBottom } from '@/components/button-scroll-to-bottom'
import { IconRefresh, IconStop } from '@/components/ui/icons'
import { ChatModeToggle } from '@/components/chat-mode-toggle'
import { cn } from '@/lib/utils'
import { treatisePanelRight } from '@/components/treatise-section-panel'

export interface ChatPanelProps
  extends Pick<
    UseChatHelpers,
    | 'append'
    | 'isLoading'
    | 'reload'
    | 'messages'
    | 'stop'
    | 'input'
    | 'setInput'
  > {
  id?: string
  onSubmit: (value: string) => Promise<void>
  errorMessage?: string | null
  lastFailedMessage?: string | null
  onRetry?: () => void
  /** null for signed-in users; a number for guests */
  guestRemaining?: number | null
  disabled?: boolean
  mode: 'academic' | 'layperson'
  onModeChange: (mode: 'academic' | 'layperson') => void
  panelOpen?: boolean
}

export function ChatPanel({
  isLoading,
  stop,
  reload,
  input,
  setInput,
  messages,
  onSubmit,
  errorMessage,
  lastFailedMessage,
  onRetry,
  guestRemaining,
  disabled = false,
  mode,
  onModeChange,
  panelOpen = false
}: ChatPanelProps) {
  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 bg-gradient-to-b from-muted/10 from-10% to-muted/30 to-50%',
        panelOpen && treatisePanelRight
      )}
    >
      <ButtonScrollToBottom />
      <div className="mx-auto sm:max-w-2xl sm:px-4">
        {errorMessage && (
          <div className="mb-2 flex items-center justify-between gap-3 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-200">
            <span>{errorMessage}</span>
            {lastFailedMessage && onRetry && (
              <Button variant="outline" size="sm" onClick={onRetry} className="shrink-0">
                Retry
              </Button>
            )}
          </div>
        )}
        <div className="flex h-10 items-center justify-center">
          {isLoading ? (
            <Button variant="outline" onClick={() => stop()} className="bg-background">
              <IconStop className="mr-2" />
              Stop generating
            </Button>
          ) : (
            messages?.length > 0 && (
              <Button variant="outline" onClick={() => reload()} className="bg-background">
                <IconRefresh className="mr-2" />
                Regenerate response
              </Button>
            )
          )}
        </div>
        <div className="space-y-2 border-t bg-background px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-3">
          <PromptForm
            onSubmit={onSubmit}
            input={input}
            setInput={setInput}
            isLoading={isLoading}
            disabled={disabled}
          />
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-1 text-xs text-muted-foreground">
            <span>
              Answers are drawn from the AIM corpus. Verify, and use your own judgement.
              {typeof guestRemaining === 'number' && (
                <>
                  {' '}
                  · Guest · {guestRemaining} {guestRemaining === 1 ? 'question' : 'questions'} left
                </>
              )}
            </span>
            <ChatModeToggle mode={mode} onChange={onModeChange} />
          </div>
        </div>
      </div>
    </div>
  )
}
