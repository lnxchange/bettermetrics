'use client'

import { useChat, type Message } from 'ai/react'
import { useRouter } from 'next/navigation'

import { cn } from '@/lib/utils'
import { nanoid } from '@/lib/utils'
import { ChatList } from '@/components/chat-list'
import { ChatPanel } from '@/components/chat-panel'
import { EmptyScreen } from '@/components/empty-screen'
import { ChatScrollAnchor } from '@/components/chat-scroll-anchor'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { useState, useEffect, useMemo } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { toast } from 'react-hot-toast'

const IS_PREVIEW = process.env.VERCEL_ENV === 'preview'
export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[]
  id?: string
}

export function Chat({ id, initialMessages, className }: ChatProps) {
  const router = useRouter()
  const [previewToken, setPreviewToken] = useLocalStorage<string | null>(
    'ai-token',
    null
  )
  const [previewTokenDialog, setPreviewTokenDialog] = useState(false)
  const [previewTokenInput, setPreviewTokenInput] = useState('')
  const [hasMounted, setHasMounted] = useState(false)
  const [hasNavigated, setHasNavigated] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [lastFailedMessage, setLastFailedMessage] = useState<string | null>(null)

  // Generate a stable chat ID if one isn't provided
  const chatId = useMemo(() => id || nanoid(), [id])

  // Set preview dialog state after hydration
  useEffect(() => {
    setHasMounted(true)
    if (IS_PREVIEW) {
      setPreviewTokenDialog(true)
      setPreviewTokenInput(previewToken ?? '')
    }
  }, [previewToken])

  // Navigate to unique URL immediately if on root chat
  useEffect(() => {
    if (!id && !hasNavigated && hasMounted) {
      setHasNavigated(true)
      router.replace(`/chat/${chatId}`) // Use replace to avoid history entry
    }
  }, [id, chatId, hasNavigated, hasMounted, router])

  const { messages, append, reload, stop, isLoading, input, setInput } =
    useChat({
      initialMessages,
      id: chatId,
      body: {
        id: chatId,
        previewToken
      },
      onResponse(response) {
        // Clear error state on successful response
        setErrorMessage(null)
        setLastFailedMessage(null)

        if (response.status === 401) {
          const error = 'Authentication failed. Please sign in again.'
          setErrorMessage(error)
          toast.error(error)
          // Redirect to sign-in after a short delay
          setTimeout(() => {
            window.location.href = '/sign-in'
          }, 2000)
        } else if (response.status >= 500) {
          const error = `Server error (${response.status}). The server encountered an issue.`
          setErrorMessage(error)
          toast.error(error)
        } else if (!response.ok) {
          const error = `Request failed: ${response.status} ${response.statusText}`
          setErrorMessage(error)
          toast.error(error)
        }
      },
      onError(error) {
        console.error('Chat error:', error)
        const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred'
        const displayError = `Chat request failed: ${errorMsg}`

        // Store the failed message for retry
        if (input) {
          setLastFailedMessage(input)
        }
        setErrorMessage(displayError)
        toast.error(`${displayError}. Your message has been preserved - click Retry to resend.`)
      },
      onFinish() {
        // Clear error state on successful completion
        setErrorMessage(null)
        setLastFailedMessage(null)
        
        // No navigation needed - we're already on the unique URL
      }
    })

  // Scroll to top of new assistant messages
  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].role === 'assistant') {
      // Small delay to ensure DOM is updated and streaming is complete
      setTimeout(() => {
        const messageElements = document.querySelectorAll('.chat-message')
        const lastMessage = messageElements[messageElements.length - 1]
        if (lastMessage) {
          lastMessage.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          })
        }
      }, 200) // Slightly longer delay for streaming completion
    }
  }, [messages])

  // Retry handler
  const handleRetry = () => {
    if (lastFailedMessage) {
      setErrorMessage(null)
      const messageToRetry = lastFailedMessage
      setLastFailedMessage(null)
      append({
        content: messageToRetry,
        role: 'user'
      })
    }
  }

  // Don't render preview dialog until mounted to prevent hydration mismatch
  if (!hasMounted) {
    return (
      <>
        <div className={cn('pb-[200px] pt-4 md:pt-10', className)}>
          {messages.length ? (
            <>
              <ChatList messages={messages} />
              <ChatScrollAnchor trackVisibility={isLoading} />
            </>
          ) : (
            <EmptyScreen setInput={setInput} />
          )}
        </div>
        <ChatPanel
          id={id}
          isLoading={isLoading}
          stop={stop}
          append={append}
          reload={reload}
          messages={messages}
          input={input}
          setInput={setInput}
          errorMessage={errorMessage}
          lastFailedMessage={lastFailedMessage}
          onRetry={handleRetry}
        />
      </>
    )
  }
  return (
    <>
      <div className={cn('pb-[200px] pt-4 md:pt-10', className)} suppressHydrationWarning>
        {messages.length ? (
          <>
            <ChatList messages={messages} />
            <ChatScrollAnchor trackVisibility={isLoading} />
          </>
        ) : (
          <EmptyScreen setInput={setInput} />
        )}
      </div>
      <ChatPanel
        id={id}
        isLoading={isLoading}
        stop={stop}
        append={append}
        reload={reload}
        messages={messages}
        input={input}
        setInput={setInput}
        errorMessage={errorMessage}
        lastFailedMessage={lastFailedMessage}
        onRetry={handleRetry}
      />

      {hasMounted && (
        <Dialog open={previewTokenDialog} onOpenChange={setPreviewTokenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter your OpenAI Key</DialogTitle>
            <DialogDescription>
              If you have not obtained your OpenAI API key, you can do so by{' '}
              <a
                href="https://platform.openai.com/signup/"
                className="underline"
              >
                signing up
              </a>{' '}
              on the OpenAI website. This is only necessary for preview
              environments so that the open source community can test the app.
              The token will be saved to your browser&apos;s local storage under
              the name <code className="font-mono">ai-token</code>.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={previewTokenInput}
            placeholder="OpenAI API key"
            onChange={e => setPreviewTokenInput(e.target.value)}
          />
          <DialogFooter className="items-center">
            <Button
              onClick={() => {
                setPreviewToken(previewTokenInput)
                setPreviewTokenDialog(false)
              }}
            >
              Save Token
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      )}
    </>
  )
}
