export const getPagingSize = (defaultSize: number = 10): number => {
  // Guard against SSR/test environments where localStorage is unavailable
  if (typeof window === 'undefined' || !window.localStorage) {
    return defaultSize
  }

  try {
    const stored = localStorage.getItem('gluu.pagingSize')

    if (!stored) return defaultSize

    const parsed = parseInt(stored, 10)
    // Only return if it's a valid positive integer (>0)
    if (!isNaN(parsed) && parsed > 0) {
      return parsed
    }

    return defaultSize
  } catch (error) {
    // Silently handle localStorage errors (quota exceeded, privacy mode, etc.)
    console.warn('Failed to read paging size from localStorage:', error)
    return defaultSize
  }
}

export const savePagingSize = (size: number): void => {
  // Validate and coerce input to a positive integer
  const validSize = Math.floor(size)
  if (validSize <= 0) {
    console.warn('Invalid paging size:', size, '- must be a positive integer')
    return
  }

  // Guard against SSR/test environments where localStorage is unavailable
  if (typeof window === 'undefined' || !window.localStorage) {
    return
  }

  try {
    localStorage.setItem('gluu.pagingSize', String(validSize))
  } catch (error) {
    // Silently handle localStorage errors (quota exceeded, privacy mode, etc.)
    console.warn('Failed to save paging size to localStorage:', error)
  }
}
