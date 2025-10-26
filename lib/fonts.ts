import { Inter as FontSans } from 'next/font/google'

export const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans'
})

// Use system monospace fonts instead of JetBrains Mono to avoid Google Fonts timeout issues
export const fontMono = {
  variable: '--font-mono',
  className: 'font-mono'
}
