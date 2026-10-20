import type { Metadata } from 'next'
import { DiagnosticPage } from '@/components/diagnostic-page'
import { SITE_OG_IMAGE } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Motivational Self-Diagnosis',
  description:
    'A short set of scenarios showing which source of motivation, Appetite, Intrinsic Motivation or Mimetic Desire, is driving a decision, using the AIM Framework.',
  alternates: { canonical: '/diagnostic' },
  openGraph: {
    title: 'Motivational Self-Diagnosis | AIM Theory',
    description: 'Which source of motivation is driving your decision? A short diagnostic built on the AIM Framework.',
    url: '/diagnostic',
    images: [SITE_OG_IMAGE],
    type: 'website'
  }
}

export default function Page() {
  return <DiagnosticPage />
}
