import { useEffect, useState } from 'react'

export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState<T>(initialValue)
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
    // Only run on client-side after mounting
    if (typeof window !== 'undefined') {
      const item = window.localStorage.getItem(key)
      if (item) {
        setStoredValue(JSON.parse(item))
      }
    }
  }, [key])

  const setValue = (value: T) => {
    setStoredValue(value)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, JSON.stringify(value))
    }
  }

  // Return initial value during SSR, actual value after mounting
  return [hasMounted ? storedValue : initialValue, setValue]
}
