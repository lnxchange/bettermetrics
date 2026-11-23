import { Metadata } from 'next'

import { LegalProse } from '@/components/legal-prose'

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'Terms of Use for aimtheory.org and Ask the AI.',
  alternates: { canonical: '/terms' }
}

export default function TermsPage() {
  return (
    <main>
      <LegalProse name="terms" />
    </main>
  )
}
