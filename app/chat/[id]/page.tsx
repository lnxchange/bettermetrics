import { type Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import { auth } from '@/auth'
import { getChat } from '@/app/actions'
import { Chat } from '@/components/chat'
import { ChatHeader } from '@/components/chat-header'
import { AimNotification } from '@/components/aim-notification'
import { cookies } from 'next/headers'

export const runtime = 'edge'
export const preferredRegion = 'home'

export interface ChatPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({
  params
}: ChatPageProps): Promise<Metadata> {
  const cookieStore = cookies()
  const session = await auth({ cookieStore })

  if (!session?.user) {
    return {}
  }

  const chat = await getChat(params.id)
  return {
    title: chat?.title.toString().slice(0, 50) ?? 'Chat'
  }
}

export default async function ChatPage({ params }: ChatPageProps) {
  const cookieStore = cookies()
  const session = await auth({ cookieStore })

  if (!session?.user) {
    redirect(`/sign-in?next=/chat/${params.id}`)
  }

  const chat = await getChat(params.id)

  if (!chat) {
    // If chat doesn't exist yet (race condition), redirect to root chat
    // This can happen when navigating immediately after sending first message
    redirect('/chat')
  }

  if (chat?.userId !== session?.user?.id) {
    notFound()
  }

  return (
    <>
      <AimNotification />
      <ChatHeader userId={session.user.id} />
      <div className="flex-1 overflow-auto">
        <Chat id={chat.id} initialMessages={chat.messages} />
      </div>
    </>
  )
}
