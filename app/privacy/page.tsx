import { Metadata } from 'next'

import { LegalProse } from '@/components/legal-prose'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How aimtheory.org handles accounts, API keys and questions.',
  alternates: { canonical: '/privacy' }
}

export default function PrivacyPage() {
  return (
    <main>
      <LegalProse name="privacy" />
    </main>
  )
}
