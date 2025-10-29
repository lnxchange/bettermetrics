import { UseChatHelpers } from 'ai/react'

import { Button } from '@/components/ui/button'
import { ExternalLink } from '@/components/external-link'
import { IconArrowRight } from '@/components/ui/icons'

const exampleMessages = [
  {
    heading: 'What is the AIM Framework?',
    message: 'What is the AIM Framework?'
  },
  {
    heading: 'How can AIM help me make better decisions?',
    message: 'How can the AIM Framework help me make better decisions?'
  },
  {
    heading: 'What is Mimetic Desire?',
    message: 'What is Mimetic Desire?'
  },
  {
    heading: 'How do Appetites differ from Intrinsic Motivation?',
    message: 'How do Appetites differ from Intrinsic Motivation in the AIM Framework?'
  }
]

export function EmptyScreen({ setInput }: Pick<UseChatHelpers, 'setInput'>) {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="rounded-lg border bg-background p-8">
        <h1 className="mb-2 text-lg font-semibold">
          AIM Framework AI Assistant
        </h1>
        <p className="mb-2 leading-normal text-muted-foreground">
          Ask questions about the AIM Motivation Framework and explore how Appetites, 
          Intrinsic Motivation, and Mimetic Desire shape human behavior.
        </p>
        <div className="mb-4 rounded-md border border-amber-300 bg-amber-50 p-3">
          <p className="text-sm font-medium text-amber-900 mb-1">
            Important Guidelines:
          </p>
          <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
            <li>Don&apos;t assume responses are correct</li>
            <li>Verify responses for yourself</li>
            <li>Use your own judgement</li>
          </ul>
        </div>
        <div className="mb-4 rounded-md border border-blue-300 bg-blue-50 dark:bg-blue-900/20 p-3">
          <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
            Research Note:
          </p>
          <p className="text-sm text-blue-800 dark:text-blue-200">
            While the AIM Framework is neuroscientifically grounded, hypotheses derived from it can be tested without relying on the underlying neuroscience. The neuroscience merely provided the basis for the AIM formulation.
          </p>
        </div>
        <p className="leading-normal text-muted-foreground">
          You can start a conversation or try these example questions:
        </p>
        <div className="mt-4 flex flex-col items-start space-y-2">
          {exampleMessages.map((message, index) => (
            <Button
              key={index}
              variant="link"
              className="h-auto p-0 text-base"
              onClick={() => setInput(message.message)}
            >
              <IconArrowRight className="mr-2 text-muted-foreground" />
              {message.heading}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
