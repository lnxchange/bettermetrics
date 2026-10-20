import { Metadata } from 'next'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import { GAListener } from '@/components/ga-listener'
import { SITE_AUTHOR, SITE_NAME, SITE_URL } from '@/lib/site'

import { ToasterWrapper } from '@/components/toaster-wrapper'

import 'katex/dist/katex.min.css'
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
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | A General Theory of Human Motivation`,
    template: `%s | ${SITE_NAME}`
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
  authors: [{ name: SITE_AUTHOR, url: SITE_URL }],
  creator: SITE_AUTHOR,
  publisher: SITE_NAME,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: 'AIM Framework | A Unifying General Theory of Human Motivation',
    description:
      'Taxonomic synthesis resolving definitional inconsistencies in motivation science through three neurologically distinct sources: Appetites, Intrinsic Motivation, and Mimetic Desire.',
    images: [
      {
        url: '/aim-og.png',
        width: 1200,
        height: 630,
        alt: 'AIM — Appetites, Intrinsic Motivation, Mimetic Desire'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AIM Framework | A Unifying General Theory of Human Motivation',
    description:
      'Taxonomic synthesis resolving Code Drift in motivation science. Three neurologically distinct sources: Appetites (A), Intrinsic Motivation (I), Mimetic Desire (M).',
    images: ['/aim-og.png']
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
  themeColor: '#ffffff',
  icons: {
    icon: [
      { url: '/aim-icon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/aim-icon-32.png', sizes: '32x32', type: 'image/png' }
    ],
    shortcut: '/aim-icon-32.png',
    apple: '/apple-touch-icon.png'
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION
  }
  // No site-wide canonical here: an inherited canonical would mark every page
  // as a duplicate of the homepage. Each page declares its own.
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
              strategy="lazyOnload"
            />
            <Script id="ga-init" strategy="lazyOnload">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);} 
                gtag('js', new Date());
                gtag('config', '${gaId}', { send_page_view: false });
              `}
            </Script>
          </>
        ) : null}
        <Providers attribute="class" defaultTheme="light" enableSystem={false}>
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
        {/*
          Vercel Speed Insights, loaded as the plain script rather than the
          @vercel/speed-insights package: the package's optional Svelte peer
          range conflicts with the `ai` SDK pin and cannot be installed without
          rewriting the lockfile. The script records the same Core Web Vitals.
          Enable Speed Insights on the project in the Vercel dashboard once.
        */}
        <Script id="vercel-speed-insights-init" strategy="afterInteractive">
          {`window.si = window.si || function () { (window.siq = window.siq || []).push(arguments); };`}
        </Script>
        <Script src="/_vercel/speed-insights/script.js" strategy="afterInteractive" />
      </body>
    </html>
  )
}
