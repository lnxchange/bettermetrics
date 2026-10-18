import { auth } from '@/auth'
import { cookies } from 'next/headers'
import { Chat } from '@/components/chat'
import { ChatHeader } from '@/components/chat-header'
import { GUEST_COOKIE, GUEST_LIMIT, peekGuestCount } from '@/lib/guest-quota'

export default async function ChatPage({
  searchParams
}: {
  searchParams?: { q?: string }
}) {
  const cookieStore = cookies()
  const session = await auth({ cookieStore })
  const isGuest = !session?.user

  const guestRemaining = isGuest
    ? Math.max(0, GUEST_LIMIT - peekGuestCount(cookieStore.get(GUEST_COOKIE)?.value))
    : undefined

  return (
    <>
      <ChatHeader userId={session?.user?.id} isGuest={isGuest} />
      <div className="flex-1 overflow-auto">
        <Chat
          isGuest={isGuest}
          initialGuestRemaining={guestRemaining}
          initialQuestion={searchParams?.q}
        />
      </div>
    </>
  )
}
