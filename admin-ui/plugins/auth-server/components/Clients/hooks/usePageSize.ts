import { useState, useCallback } from 'react'
import { DEFAULT_PAGE_SIZE } from '../helper/constants'

// Note: Key spelling preserved for backward compatibility with existing user preferences
const STORAGE_KEY = 'paggingSize'

type SetPageSize = (size: number) => void

export const usePageSize = (defaultSize = DEFAULT_PAGE_SIZE): readonly [number, SetPageSize] => {
  const safeDefault =
    Number.isFinite(defaultSize) && defaultSize > 0 ? Math.round(defaultSize) : DEFAULT_PAGE_SIZE

  const [pageSize, setPageSizeState] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return safeDefault
      const parsed = parseInt(stored, 10)
      return Number.isNaN(parsed) ? safeDefault : parsed
    } catch {
      // localStorage unavailable (security restrictions, disabled, etc.)
      return safeDefault
    }
  })

  const setPageSize = useCallback(
    (size: number) => {
      const validatedSize = Number.isFinite(size) && size > 0 ? Math.round(size) : safeDefault
      setPageSizeState(validatedSize)
      try {
        localStorage.setItem(STORAGE_KEY, String(validatedSize))
      } catch {
        // Ignore localStorage errors (private browsing, quota exceeded, storage disabled)
      }
    },
    [safeDefault],
  )

  return [pageSize, setPageSize] as const
}
