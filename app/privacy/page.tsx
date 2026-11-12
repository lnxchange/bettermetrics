import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy',
  description: 'How Ask the AI handles questions and API keys.'
}

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl space-y-4 px-4 py-16 text-sm leading-relaxed text-slate-700">
      <h1 className="text-2xl font-semibold text-slate-900">Privacy</h1>
      <p>
        Ask the AI sends your question, the conversation so far, and the Treatise passages used to answer it to the provider whose key you saved: Anthropic, OpenAI, Google, or OpenRouter. That provider bills you under its own terms. Your key is stored encrypted on this site, is used only to make your own requests, is not shown again, and is deleted when you remove it or delete your account. The site does not charge you for these questions.
      </p>
    </main>
  )
}
