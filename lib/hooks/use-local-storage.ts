import { useEffect, useState } from 'react'

export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState(initialValue)

  useEffect(() => {
    // Only run on client-side
    if (typeof window !== 'undefined') {
      // Retrieve from localStorage
      const item = window.localStorage.getItem(key)
      if (item) {
        setStoredValue(JSON.parse(item))
      }
    }
  }, [key])

  const setValue = (value: T) => {
    // Save state
    setStoredValue(value)
    // Save to localStorage only on client-side
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, JSON.stringify(value))
    }
  }
  return [storedValue, setValue]
}
