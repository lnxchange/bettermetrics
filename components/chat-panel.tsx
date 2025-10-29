import { type UseChatHelpers } from 'ai/react'

import { Button } from '@/components/ui/button'
import { PromptForm } from '@/components/prompt-form'
import { ButtonScrollToBottom } from '@/components/button-scroll-to-bottom'
import { IconRefresh, IconStop } from '@/components/ui/icons'

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
  errorMessage?: string | null
  lastFailedMessage?: string | null
  onRetry?: () => void
}

export function ChatPanel({
  id,
  isLoading,
  stop,
  append,
  reload,
  input,
  setInput,
  messages,
  errorMessage,
  lastFailedMessage,
  onRetry
}: ChatPanelProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 bg-gradient-to-b from-muted/10 from-10% to-muted/30 to-50%">
      <ButtonScrollToBottom />
      <div className="mx-auto sm:max-w-2xl sm:px-4">
        {errorMessage && lastFailedMessage && onRetry && (
          <div className="mb-2 rounded-lg bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-800 dark:text-red-200">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <strong>Message Failed:</strong>
                <p className="mt-1 text-xs opacity-90">{errorMessage}</p>
                <p className="mt-2 text-xs font-medium">Your message: &quot;{lastFailedMessage.substring(0, 100)}{lastFailedMessage.length > 100 ? '...' : ''}&quot;</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Retry
              </Button>
            </div>
          </div>
        )}
        {isLoading && (
          <div className="mb-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 px-4 py-3 text-sm text-blue-800 dark:text-blue-200">
            <div className="flex items-center gap-2">
              <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              <div>
                <strong>Generating response...</strong>
                <p className="text-xs mt-0.5 opacity-90">
                  Responses may take up to 10 minutes due to the novelty of the AIM Framework and the advanced reasoning model analyzing multiple sources and logical pathways.
                </p>
              </div>
            </div>
          </div>
        )}
        <div className="flex h-10 items-center justify-center">
          {isLoading ? (
            <Button
              variant="outline"
              onClick={() => stop()}
              className="bg-background"
            >
              <IconStop className="mr-2" />
              Stop generating
            </Button>
          ) : (
            messages?.length > 0 && (
              <Button
                variant="outline"
                onClick={() => reload()}
                className="bg-background"
              >
                <IconRefresh className="mr-2" />
                Regenerate response
              </Button>
            )
          )}
        </div>
        <div className="space-y-4 border-t bg-background px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4">
          <PromptForm
            onSubmit={async value => {
              await append({
                id,
                content: value,
                role: 'user'
              })
            }}
            input={input}
            setInput={setInput}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  )
}
