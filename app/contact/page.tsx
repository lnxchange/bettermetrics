import type { Metadata } from 'next'
import { ContactPage } from '@/components/contact-page'
import { SITE_OG_IMAGE } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Contact Yule Guttenbeil',
  description:
    'Get in touch about the AIM Framework: research collaboration, speaking, challenges to the theory, or questions about applying it.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact Yule Guttenbeil | AIM Theory',
    description: 'Research collaboration, speaking, challenges to the theory, or questions about applying it.',
    url: '/contact',
    images: [SITE_OG_IMAGE],
    type: 'website'
  }
}

export default function Page() {
  return <ContactPage />
}
