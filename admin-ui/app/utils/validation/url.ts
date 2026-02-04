export const isValidUrl = (url: string): boolean => {
  if (!url.trim()) return true
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

export const isValidUrlAnyProtocol = (url: string): boolean => {
  if (!url.trim()) return true
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}
