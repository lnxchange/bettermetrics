import { Metadata } from 'next'
import { auth } from '@/auth'
import { cookies } from 'next/headers'
import { Chat } from '@/components/chat'
import { ChatHeader } from '@/components/chat-header'
import { guestsAllowed } from '@/lib/chat-access'
import { loadChatSettings, PAUSED_MESSAGE } from '@/lib/chat-settings'
import { adminSiteKey, isSiteAdmin } from '@/lib/site-keys'

export const metadata: Metadata = {
  robots: { index: false, follow: false }
}
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
  const requiresAccount = !guestsAllowed()
  const settings = await loadChatSettings()
  const paused = process.env.CHAT_PAUSED === 'true' || settings.paused
  const pausedMessage = process.env.CHAT_PAUSED === 'true' ? PAUSED_MESSAGE : settings.pausedMessage
  const usesSiteKey = isSiteAdmin(session?.user) && adminSiteKey(settings.providers) !== null

  return (
    <>
      <ChatHeader userId={session?.user?.id} isGuest={isGuest} requiresAccount={requiresAccount} />
      <div className="flex-1 overflow-auto">
        <Chat
          isGuest={isGuest}
          initialGuestRemaining={guestRemaining}
          initialQuestion={searchParams?.q}
          requiresAccount={requiresAccount}
          requiresOwnKey
          usesSiteKey={usesSiteKey}
          paused={paused}
          pausedMessage={pausedMessage}
          noticeMarkdown={settings.noticeMarkdown}
        />
      </div>
    </>
  )
}
