import { type Message } from 'ai'

import { Separator } from '@/components/ui/separator'
import { ChatMessage } from '@/components/chat-message'
import { TreatiseSectionTarget } from '@/lib/treatise-citations'

export interface ChatList {
  messages: Message[]
  onOpenSection?: (target: TreatiseSectionTarget) => void
}

export function ChatList({ messages, onOpenSection }: ChatList) {
  if (!messages.length) {
    return null
  }

  return (
    <div className="relative mx-auto max-w-2xl px-4">
      {messages.map((message, index) => (
        <div key={index} className="chat-message">
          <ChatMessage message={message} onOpenSection={onOpenSection} />
          {index < messages.length - 1 && (
            <Separator className="my-4 md:my-8" />
          )}
        </div>
      ))}
    </div>
  )
}
