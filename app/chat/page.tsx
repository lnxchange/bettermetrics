import { auth } from '@/auth'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Chat } from '@/components/chat'
import { ChatHeader } from '@/components/chat-header'
import { AimNotification } from '@/components/aim-notification'

export default async function ChatPage() {
  const cookieStore = cookies()
  const session = await auth({ cookieStore })

  if (!session?.user) {
    redirect('/sign-in?redirectedFrom=/chat')
  }

  return (
    <>
      <AimNotification />
      <ChatHeader userId={session.user.id} />
      <div className="flex-1 overflow-auto">
        <Chat />
      </div>
    </>
  )
}
