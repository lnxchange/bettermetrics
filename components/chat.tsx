'use client'

import { useChat, type Message } from 'ai/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import { cn } from '@/lib/utils'
import { nanoid } from '@/lib/utils'
import { ChatList } from '@/components/chat-list'
import { ChatPanel } from '@/components/chat-panel'
import { EmptyScreen } from '@/components/empty-screen'
import { ChatScrollAnchor } from '@/components/chat-scroll-anchor'
import {
  TreatiseSectionPanel,
  treatisePanelOffset
} from '@/components/treatise-section-panel'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { CorpusIndex, TreatiseSectionTarget } from '@/lib/treatise-citations'
import { GUEST_LIMIT, GUEST_REMAINING_HEADER } from '@/lib/guest-quota'
import { useState, useEffect, useMemo, useRef } from 'react'
import { Button } from './ui/button'
import { toast } from 'react-hot-toast'

export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[]
  id?: string
  isGuest?: boolean
  initialGuestRemaining?: number
  /** Question passed via /chat?q=... ; auto-submitted once on mount. */
  initialQuestion?: string
}

export function Chat({
  id,
  initialMessages,
  className,
  isGuest = false,
  initialGuestRemaining,
  initialQuestion
}: ChatProps) {
  const router = useRouter()
  const [chatMode, setChatMode] = useLocalStorage<'academic' | 'layperson'>(
    'aim-chat-mode',
    'layperson'
  )
  const [section, setSection] = useState<TreatiseSectionTarget | null>(null)
  const [targets, setTargets] = useState<{
    index: CorpusIndex
    redirects: Record<string, { slug: string; section: string | null }>
  } | null>(null)
  const [hasMounted, setHasMounted] = useState(false)
  const [hasNavigated, setHasNavigated] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [lastFailedMessage, setLastFailedMessage] = useState<string | null>(null)
  const [quotaExceeded, setQuotaExceeded] = useState(false)
  useEffect(() => {
    let cancel = false
    fetch('/api/treatise/targets')
      .then(response => (response.ok ? response.json() : null))
      .then(data => {
        if (cancel || !data?.sections || !data?.owners || !Array.isArray(data?.chapters)) return
        setTargets({
          index: { sections: data.sections, owners: data.owners, chapters: data.chapters },
          redirects: data.redirects || {}
        })
      })
      .catch(() => {
        if (!cancel) setTargets(null)
      })
    return () => {
      cancel = true
    }
  }, [])

  const [guestRemaining, setGuestRemaining] = useState<number | null>(
    isGuest ? initialGuestRemaining ?? GUEST_LIMIT : null
  )
  const lastSubmittedRef = useRef<string | null>(null)
  const quotaHitRef = useRef(false)
  const autoSubmittedRef = useRef(false)

  // Generate a stable chat ID if one isn't provided
  const chatId = useMemo(() => id || nanoid(), [id])

  useEffect(() => {
    setHasMounted(true)
  }, [])

  // Navigate to a unique URL immediately if on root chat, carrying ?q= along.
  useEffect(() => {
    if (!id && !hasNavigated && hasMounted) {
      setHasNavigated(true)
      const q = initialQuestion ? `?q=${encodeURIComponent(initialQuestion)}` : ''
      router.replace(`/chat/${chatId}${q}`)
    }
  }, [id, chatId, hasNavigated, hasMounted, router, initialQuestion])

  const { messages, append, reload, stop, isLoading, input, setInput } =
    useChat({
      initialMessages,
      id: chatId,
      body: {
        id: chatId,
        mode: chatMode
      },
      async onResponse(response) {
        setErrorMessage(null)
        setLastFailedMessage(null)
        quotaHitRef.current = false

        const remaining = response.headers.get(GUEST_REMAINING_HEADER)
        if (remaining !== null) {
          setGuestRemaining(Number(remaining))
        }

        if (response.status === 403) {
          try {
            const body = await response.clone().json()
            if (body?.error === 'guest_quota') {
              quotaHitRef.current = true
              setQuotaExceeded(true)
              setGuestRemaining(0)
              return
            }
          } catch {
            // fall through to generic handling
          }
        }

        if (response.status === 401) {
          toast.error('Your session has expired. Please sign in again.')
          setTimeout(() => {
            window.location.href = '/sign-in?redirectedFrom=/chat'
          }, 1500)
        } else if (!response.ok) {
          setErrorMessage(
            response.status >= 500
              ? 'The server had trouble answering. Please try again.'
              : `Request failed (${response.status}).`
          )
        }
      },
      onError(error) {
        if (quotaHitRef.current) return
        console.error('Chat error:', error)
        if (lastSubmittedRef.current) {
          setLastFailedMessage(lastSubmittedRef.current)
        }
        setErrorMessage(prev => prev ?? 'Something went wrong. Your message was kept so you can retry.')
      },
      onFinish() {
        setErrorMessage(null)
        setLastFailedMessage(null)
      }
    })

  const submit = async (content: string) => {
    lastSubmittedRef.current = content
    await append({ id, content, role: 'user' })
  }

  // Auto-submit a deep-linked question once we're on the stable /chat/[id] URL.
  useEffect(() => {
    if (
      id &&
      initialQuestion &&
      hasMounted &&
      !autoSubmittedRef.current &&
      messages.length === 0 &&
      !quotaExceeded
    ) {
      autoSubmittedRef.current = true
      // Strip ?q= so a reload doesn't resend.
      if (typeof window !== 'undefined') {
        window.history.replaceState(null, '', `/chat/${id}`)
      }
      submit(initialQuestion)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, initialQuestion, hasMounted])

  // Scroll to top of new assistant messages
  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].role === 'assistant') {
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
      }, 200)
    }
  }, [messages])

  const handleRetry = () => {
    if (lastFailedMessage) {
      setErrorMessage(null)
      const messageToRetry = lastFailedMessage
      setLastFailedMessage(null)
      submit(messageToRetry)
    }
  }

  return (
    <>
      <div
        className={cn('pb-[200px] pt-4 md:pt-10', section && treatisePanelOffset, className)}
        suppressHydrationWarning
      >
        {messages.length ? (
          <>
            <ChatList messages={messages} onOpenSection={setSection} targets={targets} />
            <ChatScrollAnchor trackVisibility={isLoading} />
          </>
        ) : (
          !quotaExceeded && <EmptyScreen onAsk={submit} />
        )}
        {quotaExceeded && (
          <div className="mx-auto mt-6 max-w-2xl px-4">
            <div className="rounded-lg border bg-background p-6">
              <h2 className="mb-2 text-base font-semibold">
                You&apos;ve used your {GUEST_LIMIT} free questions
              </h2>
              <p className="mb-4 text-sm text-muted-foreground">
                Sign in to keep asking and to save your conversations. It&apos;s free.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <Link href={`/sign-in?redirectedFrom=/chat/${chatId}`}>Sign in</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href={`/sign-up?redirectedFrom=/chat/${chatId}`}>Create an account</Link>
                </Button>
              </div>
            </div>
          </div>
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
        onSubmit={submit}
        errorMessage={errorMessage}
        lastFailedMessage={lastFailedMessage}
        onRetry={handleRetry}
        guestRemaining={guestRemaining}
        disabled={quotaExceeded}
        mode={chatMode}
        onModeChange={setChatMode}
        panelOpen={section !== null}
      />
      {section && (
        <TreatiseSectionPanel
          target={section}
          onOpen={setSection}
          onClose={() => setSection(null)}
        />
      )}
    </>
  )
}
