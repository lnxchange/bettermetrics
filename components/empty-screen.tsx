import { Button } from '@/components/ui/button'
import { IconArrowRight } from '@/components/ui/icons'

const exampleMessages = [
  'What are the three sources of motivation in the AIM Framework, in plain terms?',
  'Why can\u2019t I tell where a desire came from just by thinking about it?',
  'What is Object Parasitism, and what is the Mimetic Premium?',
  'Why does status-seeking never feel finished?',
  'What are the two questions in the Two-Question Diagnostic?',
  'How does the AIM Framework explain scapegoating?'
]

export function EmptyScreen({ onAsk }: { onAsk: (question: string) => void }) {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="rounded-lg border bg-background p-8">
        <h1 className="mb-2 text-lg font-semibold">Ask the AI about the AIM Framework</h1>
        <p className="mb-6 leading-normal text-muted-foreground">
          Answers come from the AIM Treatise and research corpus, which is kept
          current. Ask anything, or start with one of these:
        </p>
        <div className="flex flex-col items-start space-y-2">
          {exampleMessages.map((message, index) => (
            <Button
              key={index}
              variant="link"
              className="h-auto p-0 text-left text-base"
              onClick={() => onAsk(message)}
            >
              <IconArrowRight className="mr-2 shrink-0 text-muted-foreground" />
              {message}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
