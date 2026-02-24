import { useState, useCallback } from 'react'
import { devLogger } from '@/utils/devLogger'

export const ROWS_PER_PAGE_OPTIONS = [5, 10, 25, 50] as const

export const DEFAULT_PAGING_SIZE = 10

const STORAGE_KEY = 'gluu.pagingSize'

export const PAGING_SIZE_CHANGED_EVENT = 'gluu:pagingSizeChanged'

export const getPagingSize = (defaultSize: number = DEFAULT_PAGING_SIZE): number => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return defaultSize
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)

    if (!stored) return defaultSize

    const parsed = parseInt(stored, 10)
    if (!isNaN(parsed) && parsed > 0) {
      return parsed
    }

    return defaultSize
  } catch (error) {
    devLogger.warn('Failed to read paging size from localStorage:', error)
    return defaultSize
  }
}

export const getDefaultPagingSize = (): number => {
  const stored = getPagingSize(DEFAULT_PAGING_SIZE)
  return (ROWS_PER_PAGE_OPTIONS as readonly number[]).includes(stored)
    ? stored
    : DEFAULT_PAGING_SIZE
}

export const getRowsPerPageOptions = (): number[] => [...ROWS_PER_PAGE_OPTIONS]

export const savePagingSize = (size: number): void => {
  const validSize = Math.floor(size)
  if (validSize <= 0) {
    devLogger.warn('Invalid paging size:', size, '- must be a positive integer')
    return
  }

  if (!(ROWS_PER_PAGE_OPTIONS as readonly number[]).includes(validSize)) {
    devLogger.warn('Invalid paging size:', validSize, '- must be one of', ROWS_PER_PAGE_OPTIONS)
    return
  }

  if (typeof window === 'undefined' || !window.localStorage) {
    return
  }

  try {
    localStorage.setItem(STORAGE_KEY, String(validSize))
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(PAGING_SIZE_CHANGED_EVENT, { detail: validSize }))
    }
  } catch (error) {
    devLogger.warn('Failed to save paging size to localStorage:', error)
  }
}

export function usePaginationState() {
  const [limit, setLimit] = useState(getDefaultPagingSize)
  const [pageNumber, setPageNumber] = useState(0)
  const onPagingSizeSync = useCallback((newSize: number) => {
    setLimit(newSize)
    setPageNumber(0)
  }, [])
  return { limit, setLimit, pageNumber, setPageNumber, onPagingSizeSync }
}
