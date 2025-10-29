export const getPagingSize = (defaultSize: number = 10): number => {
  const stored = localStorage.getItem('pagingSize')
  if (!stored) return defaultSize
  const parsed = parseInt(stored, 10)
  return isNaN(parsed) ? defaultSize : parsed
}

export const savePagingSize = (size: number): void => {
  localStorage.setItem('pagingSize', String(size))
}
