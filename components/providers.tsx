'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes'
import { ThemeProviderProps } from 'next-themes/dist/types'

import { TooltipProvider } from '@/components/ui/tooltip'

function LightUnlessChosen() {
  const { theme, setTheme } = useTheme()
  React.useEffect(() => {
    if (theme === 'system') setTheme('light')
  }, [theme, setTheme])
  return null
}

export function Providers({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <LightUnlessChosen />
      <TooltipProvider>{children}</TooltipProvider>
    </NextThemesProvider>
  )
}
