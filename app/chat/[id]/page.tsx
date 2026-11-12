import { type Metadata } from 'next'
import { notFound } from 'next/navigation'

import { auth } from '@/auth'
import { getChat } from '@/app/actions'
import { Chat } from '@/components/chat'
import { ChatHeader } from '@/components/chat-header'
import { cookies } from 'next/headers'
import { guestsAllowed } from '@/lib/chat-access'
import { loadChatSettings, PAUSED_MESSAGE } from '@/lib/chat-settings'
import { GUEST_COOKIE, GUEST_LIMIT, peekGuestCount } from '@/lib/guest-quota'

export const runtime = 'edge'
export const preferredRegion = 'home'

export interface ChatPageProps {
  params: {
    id: string
  }
  searchParams?: { q?: string }
}

export async function generateMetadata({
  params
}: ChatPageProps): Promise<Metadata> {
  const cookieStore = cookies()
  const session = await auth({ cookieStore })

  const robots = { index: false, follow: false }
  if (!session?.user) {
    return { title: 'Ask the AI', robots }
  }

  const chat = await getChat(params.id)
  return {
    title: chat?.title.toString().slice(0, 50) ?? 'Chat',
    robots
  }
}

export default async function ChatPage({ params, searchParams }: ChatPageProps) {
  const cookieStore = cookies()
  const session = await auth({ cookieStore })

  const requiresAccount = !guestsAllowed()
  const settings = await loadChatSettings()
  const paused = process.env.CHAT_PAUSED === 'true' || settings.paused
  const pausedMessage = process.env.CHAT_PAUSED === 'true' ? PAUSED_MESSAGE : settings.pausedMessage
  const chatProps = {
    requiresAccount,
    requiresOwnKey: true as const,
    paused,
    pausedMessage,
    noticeMarkdown: settings.noticeMarkdown
  }

  // Guests get a fresh, unsaved conversation at this URL.
  if (!session?.user) {
    const guestRemaining = Math.max(
      0,
      GUEST_LIMIT - peekGuestCount(cookieStore.get(GUEST_COOKIE)?.value)
    )
    return (
      <>
        <ChatHeader isGuest requiresAccount={requiresAccount} />
        <div className="flex-1 overflow-auto">
          <Chat
            id={params.id}
            initialMessages={[]}
            isGuest
            initialGuestRemaining={guestRemaining}
            initialQuestion={searchParams?.q}
            {...chatProps}
          />
        </div>
      </>
    )
  }

  const chat = await getChat(params.id)

  if (!chat) {
    // New chat: the URL was created before any message was sent.
    return (
      <>
        <ChatHeader userId={session.user.id} requiresAccount={requiresAccount} />
        <div className="flex-1 overflow-auto">
          <Chat
            id={params.id}
            initialMessages={[]}
            initialQuestion={searchParams?.q}
            {...chatProps}
          />
        </div>
      </>
    )
  }

  if (chat?.userId !== session?.user?.id) {
    notFound()
  }

  return (
    <>
      <ChatHeader userId={session.user.id} requiresAccount={requiresAccount} />
      <div className="flex-1 overflow-auto">
        <Chat
          id={chat.id}
          initialMessages={chat.messages}
          {...chatProps}
        />
      </div>
    </>
  )
}
