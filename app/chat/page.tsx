import { auth } from '@/auth'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Chat } from '@/components/chat'

export default async function ChatPage() {
  const cookieStore = cookies()
  const session = await auth({ cookieStore })

  if (!session?.user) {
    redirect('/sign-in?redirectedFrom=/chat')
  }

  // Create a new chat directly on this page
  return <Chat />
}
