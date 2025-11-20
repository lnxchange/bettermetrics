import { Message } from 'ai'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'

import { cn } from '@/lib/utils'
import { CodeBlock } from '@/components/ui/codeblock'
import { Mermaid } from '@/components/ui/mermaid'
import { MemoizedReactMarkdown } from '@/components/markdown'
import { IconPerplexity, IconUser } from '@/components/ui/icons'
import { ChatMessageActions } from '@/components/chat-message-actions'

export interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message, ...props }: ChatMessageProps) {
  return (
    <div
      className={cn('group relative mb-4 flex items-start md:-ml-12')}
      {...props}
    >
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow',
          message.role === 'user'
            ? 'bg-background'
            : 'bg-primary text-primary-foreground'
        )}
      >
        {message.role === 'user' ? <IconUser /> : <IconPerplexity />}
      </div>
      <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
        <MemoizedReactMarkdown
          className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
          remarkPlugins={[remarkGfm, remarkMath]}
          components={{
            p({ children }) {
              return <p className="mb-2 last:mb-0">{children}</p>
            },
            a({ href, children, ...props }) {
              // Style citation links as buttons
              // Citations are typically [1], [2], etc.
              const isCitation = /^\[\d+\]$/.test(children?.toString() || '')
              
              if (isCitation) {
                return (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center min-w-[32px] h-7 mx-1 px-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-md no-underline transition-colors shadow-sm active:scale-95 transform"
                    {...props}
                  >
                    {children}
                  </a>
                )
              }
              
              // Regular links
              return (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                  {...props}
                >
                  {children}
                </a>
              )
            },
            code({ node, inline, className, children, ...props }) {
              if (children.length) {
                if (children[0] == '▍') {
                  return (
                    <span className="mt-1 animate-pulse cursor-default">▍</span>
                  )
                }

                children[0] = (children[0] as string).replace('`▍`', '▍')
              }

              const match = /language-(\w+)/.exec(className || '')
              const language = match && match[1]

              if (inline) {
                return (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              }

              // Render Mermaid diagrams with the Mermaid component
              if (language === 'mermaid') {
                return (
                  <Mermaid
                    key={`mermaid-${message.id}-${children.length}`}
                    chart={String(children).replace(/\n$/, '')}
                  />
                )
              }

              return (
                <CodeBlock
                  key={`codeblock-${message.id}-${children.length}`}
                  language={language || ''}
                  value={String(children).replace(/\n$/, '')}
                  {...props}
                />
              )
            }
          }}
        >
          {message.content}
        </MemoizedReactMarkdown>
        <ChatMessageActions message={message} />
      </div>
    </div>
  )
}
