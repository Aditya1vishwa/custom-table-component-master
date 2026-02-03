"use client"

import { useEffect, useState } from "react"

/**
 * Returns a debounced value that updates after `delay` ms of no changes.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    return () => window.clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
