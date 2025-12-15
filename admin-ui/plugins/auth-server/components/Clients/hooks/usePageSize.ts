import { useState, useCallback } from 'react'
import { DEFAULT_PAGE_SIZE } from '../helper/constants'

const STORAGE_KEY = 'paggingSize'

export const usePageSize = (defaultSize = DEFAULT_PAGE_SIZE) => {
  const getInitialPageSize = (): number => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return defaultSize
    const parsed = parseInt(stored, 10)
    return Number.isNaN(parsed) ? defaultSize : parsed
  }

  const [pageSize, setPageSizeState] = useState<number>(getInitialPageSize())

  const setPageSize = useCallback((size: number) => {
    setPageSizeState(size)
    localStorage.setItem(STORAGE_KEY, String(size))
  }, [])

  return [pageSize, setPageSize] as const
}
