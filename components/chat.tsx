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
import { ByokNotice } from '@/components/byok-notice'

export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[]
  id?: string
  isGuest?: boolean
  initialGuestRemaining?: number
  /** Question passed via /chat?q=... . It fills the box and is not sent until Send. */
  initialQuestion?: string
  /** Anonymous visitors cannot send until they sign in. */
  requiresAccount?: boolean
  /** Signed-in readers must save their own key before sending. */
  requiresOwnKey?: boolean
  paused?: boolean
  pausedMessage?: string
  noticeMarkdown?: string
}

export function Chat({
  id,
  initialMessages,
  className,
  isGuest = false,
  initialGuestRemaining,
  initialQuestion,
  requiresAccount = true,
  requiresOwnKey = true,
  paused = false,
  pausedMessage,
  noticeMarkdown
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
  const [serverAccountRequired, setServerAccountRequired] = useState(false)
  const [keyState, setKeyState] = useState<'unknown' | 'ready' | 'missing'>(
    isGuest || !requiresOwnKey ? 'ready' : 'unknown'
  )
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
  const accountRequired = (isGuest && requiresAccount) || serverAccountRequired
  const lastSubmittedRef = useRef<string | null>(null)

  useEffect(() => {
    if (isGuest || !requiresOwnKey) return
    let cancel = false
    fetch('/api/account/api-key')
      .then(response => (response.ok ? response.json() : null))
      .then(data => {
        if (cancel) return
        setKeyState(Array.isArray(data?.keys) && data.keys.length > 0 ? 'ready' : 'missing')
      })
      .catch(() => {
        if (!cancel) setKeyState('missing')
      })
    return () => {
      cancel = true
    }
  }, [isGuest, requiresOwnKey])
  const quotaHitRef = useRef(false)

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

        if (response.status === 401 || response.status === 403) {
          try {
            const body = await response.clone().json()
            if (body?.error === 'guest_quota') {
              quotaHitRef.current = true
              setQuotaExceeded(true)
              setGuestRemaining(0)
              return
            }
            if (body?.error === 'auth_required') {
              quotaHitRef.current = true
              setServerAccountRequired(true)
              return
            }
            if (body?.error === 'api_key_required' || body?.error === 'provider_off') {
              quotaHitRef.current = true
              setKeyState('missing')
              return
            }
            if (body?.error === 'chat_paused') {
              quotaHitRef.current = true
              return
            }
          } catch {
            // fall through to generic handling
          }
        }

        if (response.status === 401) {
          toast.error('Your session has expired. Please sign in again.')
          setTimeout(() => {
            window.location.href = '/sign-in?redirectedFrom=/chat&reason=chat'
          }, 1500)
        } else if (!response.ok) {
          let message =
            response.status >= 500
              ? 'The server had trouble answering. Please try again.'
              : `Request failed (${response.status}).`
          try {
            const body = await response.clone().json()
            if (typeof body?.message === 'string') message = body.message
          } catch {
            // keep the status message
          }
          setErrorMessage(message)
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

  // A linked question fills the box. The reader presses Send.
  useEffect(() => {
    if (initialQuestion && hasMounted && messages.length === 0) {
      setInput(initialQuestion)
    }
  }, [initialQuestion, hasMounted, messages.length, setInput])

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

  if (paused) {
    return (
      <div className={cn('mx-auto mt-10 max-w-2xl px-4', className)}>
        <div className="rounded-lg border bg-background p-6">
          <p className="text-sm text-muted-foreground">{pausedMessage}</p>
        </div>
      </div>
    )
  }

  const showNotice = Boolean(noticeMarkdown) && (accountRequired || keyState === 'missing')

  return (
    <>
      <div
        className={cn('pb-[200px] pt-4 md:pt-10', section && treatisePanelOffset, className)}
        suppressHydrationWarning
      >
        {showNotice && (
          <div className="mx-auto mb-6 max-w-2xl px-4">
            <ByokNotice markdown={noticeMarkdown || ''} />
          </div>
        )}
        {messages.length ? (
          <>
            <ChatList messages={messages} onOpenSection={setSection} targets={targets} />
            <ChatScrollAnchor trackVisibility={isLoading} />
          </>
        ) : accountRequired ? (
          <div className="mx-auto mt-6 max-w-2xl px-4">
            <div className="rounded-lg border bg-background p-6">
              <h2 className="mb-2 text-base font-semibold">Create an account to ask</h2>
              <p className="mb-4 text-sm text-muted-foreground">
                The assistant is for signed-in readers. After you create an account, add your own
                API key and questions are billed to that provider.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <Link href={`/sign-in?redirectedFrom=/chat/${chatId}&reason=chat`}>Sign in</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href={`/sign-up?redirectedFrom=/chat/${chatId}&reason=chat`}>
                    Create an account
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ) : keyState === 'missing' ? (
          <div className="mx-auto mt-6 max-w-2xl px-4">
            <div className="rounded-lg border bg-background p-6">
              <h2 className="mb-2 text-base font-semibold">Add your API key</h2>
              <p className="mb-4 text-sm text-muted-foreground">
                Chat uses your Anthropic, OpenAI, Google, or OpenRouter key, so this site does not
                pay for the answer. Save a key on your profile, then come back and ask.
              </p>
              <Button asChild>
                <Link href="/account#api-key">Add an API key</Link>
              </Button>
            </div>
          </div>
        ) : (
          keyState === 'ready' && !quotaExceeded && <EmptyScreen onAsk={submit} />
        )}
        {quotaExceeded && (
          <div className="mx-auto mt-6 max-w-2xl px-4">
            <div className="rounded-lg border bg-background p-6">
              <h2 className="mb-2 text-base font-semibold">
                You&apos;ve used your {GUEST_LIMIT} free questions
              </h2>
              <p className="mb-4 text-sm text-muted-foreground">
                {requiresOwnKey
                  ? 'Sign in, then add your API key. Further questions are billed to that provider.'
                  : 'Sign in to keep asking and to save your conversations.'}
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <Link href={`/sign-in?redirectedFrom=/chat/${chatId}&reason=chat`}>Sign in</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href={`/sign-up?redirectedFrom=/chat/${chatId}&reason=chat`}>
                    Create an account
                  </Link>
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
        guestRemaining={accountRequired ? null : guestRemaining}
        disabled={quotaExceeded || accountRequired || keyState !== 'ready' || paused}
        placeholder={
          accountRequired
            ? 'Create an account to ask'
            : keyState === 'missing'
              ? 'Add your API key to ask'
              : keyState === 'unknown'
                ? 'Checking your account…'
                : undefined
        }
        mode={chatMode}
        onModeChange={setChatMode}
        panelOpen={section !== null}
      />
      {section && (
        <TreatiseSectionPanel
          target={section}
          returnHref={`/chat/${chatId}`}
          onOpen={setSection}
          onClose={() => setSection(null)}
        />
      )}
    </>
  )
}
