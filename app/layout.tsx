import { Metadata } from 'next'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/react'
import { GAListener } from '@/components/ga-listener'

import { ToasterWrapper } from '@/components/toaster-wrapper'

import '@/app/globals.css'
import { fontMono, fontSans } from '@/lib/fonts'
import { cn } from '@/lib/utils'
import { TailwindIndicator } from '@/components/tailwind-indicator'
import { Providers } from '@/components/providers'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { AIMJsonLd } from '@/components/aim-jsonld'
import { auth } from '@/auth'
import { cookies } from 'next/headers'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.usebettermetrics.com'),
  title: {
    default: 'Use Better Metrics | AIM Motivation Framework',
    template: '%s | Use Better Metrics'
  },
  description:
    'A Unifying General Theory of Human Motivation: Taxonomic synthesis integrating neuroscience, behavioral economics, Self-Determination Theory, and Girardian mimetic theory. Resolves Code Drift through three neurologically distinct sources—Appetites (A), Intrinsic Motivation (I), and Mimetic Desire (M).',
  keywords: [
    'AIM Framework',
    'motivational taxonomy',
    'theoretical synthesis',
    'behavioral economics',
    'definitional framework',
    'systems architecture',
    'neuroscience integration',
    'intrinsic motivation',
    'mimetic desire',
    'heuristic utility model',
    'Code Drift',
    'Self-Determination Theory',
    'Girardian theory',
    'construct validity',
    'falsifiable predictions'
  ],
  authors: [{ name: 'Yule Guttenbeil', url: 'https://www.usebettermetrics.com' }],
  creator: 'Yule Guttenbeil',
  publisher: 'Use Better Metrics',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.usebettermetrics.com',
    siteName: 'Use Better Metrics',
    title: 'AIM Framework | A Unifying General Theory of Human Motivation',
    description:
      'Taxonomic synthesis resolving definitional inconsistencies in motivation science through three neurologically distinct sources: Appetites, Intrinsic Motivation, and Mimetic Desire.',
    images: [
      {
        url: '/AIM Logo.png',
        width: 1200,
        height: 630,
        alt: 'AIM Framework - Appetites, Intrinsic Motivation, Mimetic Desire'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AIM Framework | A Unifying General Theory of Human Motivation',
    description:
      'Taxonomic synthesis resolving Code Drift in motivation science. Three neurologically distinct sources: Appetites (A), Intrinsic Motivation (I), Mimetic Desire (M).',
    images: ['/AIM Logo.png'],
    creator: '@usebettermetrics'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' }
  ],
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' }
    ],
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png'
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION
  },
  alternates: {
    canonical: 'https://www.usebettermetrics.com'
  }
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const cookieStore = cookies()
  const session = await auth({ cookieStore })
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          'font-sans antialiased',
          fontSans.variable,
          fontMono.variable
        )}
      >
        <AIMJsonLd />
        {gaId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);} 
                gtag('js', new Date());
                gtag('config', '${gaId}', { send_page_view: false });
              `}
            </Script>
          </>
        ) : null}
        <Providers attribute="class" defaultTheme="system" enableSystem>
          <ToasterWrapper />
          <div className="flex min-h-screen flex-col">
            <Header session={session} />
            <main className="flex flex-1 flex-col bg-muted/50">{children}</main>
            <Footer />
          </div>
          <TailwindIndicator />
          {gaId ? <GAListener measurementId={gaId} /> : null}
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
