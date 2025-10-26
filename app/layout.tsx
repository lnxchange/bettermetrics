import { Metadata } from 'next'

import { ToasterWrapper } from '@/components/toaster-wrapper'

import '@/app/globals.css'
import { fontMono, fontSans } from '@/lib/fonts'
import { cn } from '@/lib/utils'
import { TailwindIndicator } from '@/components/tailwind-indicator'
import { Providers } from '@/components/providers'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { auth } from '@/auth'
import { cookies } from 'next/headers'

export const metadata: Metadata = {
  title: {
    default: 'Use Better Metrics | AIM Motivation Framework',
    template: '%s | Use Better Metrics'
  },
  description:
    'The AIM Motivation Framework distinguishes three neural sources—Appetites, Intrinsic Motivation, and Mimetic Desire—to transform understanding across economics, psychology, health, law, and policy.',
  keywords: [
    'AIM Framework',
    'motivation science',
    'behavioral economics',
    'intrinsic motivation',
    'mimetic desire'
  ],
  authors: [{ name: 'Yule Guttenbeil' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.usebettermetrics.com',
    siteName: 'Use Better Metrics'
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
  }
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const cookieStore = cookies()
  const session = await auth({ cookieStore })

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
        <Providers attribute="class" defaultTheme="system" enableSystem>
          <ToasterWrapper />
          <div className="flex min-h-screen flex-col">
            <Header session={session} />
            <main className="flex flex-1 flex-col bg-muted/50">{children}</main>
            <Footer />
          </div>
          <TailwindIndicator />
        </Providers>
      </body>
    </html>
  )
}
