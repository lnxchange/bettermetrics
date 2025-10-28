import * as React from 'react'

export function useAtBottom(offset = 0) {
  const [isAtBottom, setIsAtBottom] = React.useState(false)
  const [hasMounted, setHasMounted] = React.useState(false)

  React.useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') return
    
    setHasMounted(true)

    const handleScroll = () => {
      setIsAtBottom(
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - offset
      )
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [offset])

  // Return false during SSR to prevent hydration mismatch
  return hasMounted ? isAtBottom : false
}
