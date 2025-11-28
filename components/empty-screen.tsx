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
    heading: 'What is Mimetic desire?',
    message: 'What is Mimetic desire?'
  },
  {
    heading: 'I hate my job but I\'m scared to leave.',
    message: 'I hate my job but I\'m scared to leave. Can AIM help me understand why?'
  },
  {
    heading: 'Why do I buy things I don\'t need?',
    message: 'Why do I buy things I don\'t need?'
  }
]

export function EmptyScreen({ setInput }: Pick<UseChatHelpers, 'setInput'>) {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="rounded-lg border bg-background p-8">
        <h1 className="mb-2 text-lg font-semibold">
          The AIM Decoder
        </h1>
        <p className="mb-4 leading-normal text-muted-foreground">
          Life is messy. The framework is clear. Ask a question to get started.
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
            The AIM Framework is neuroscientifically grounded, providing a workable, observable taxonomy of three distinct motivational sources. This grounding makes neuroscience applicable to human behaviour observation. While hypotheses derived from the framework can be tested through behavioural observations, the neuroscience provides the foundational basis that enables the framework&apos;s unique predictive power.
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
