export const isValidUrl = (url: string): boolean => {
  const trimmed = url.trim()
  if (!trimmed) return true
  try {
    const parsed = new URL(trimmed)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

export const isValidUrlAnyProtocol = (url: string): boolean => {
  const trimmed = url.trim()
  if (!trimmed) return true
  try {
    new URL(trimmed)
    return true
  } catch {
    return false
  }
}
