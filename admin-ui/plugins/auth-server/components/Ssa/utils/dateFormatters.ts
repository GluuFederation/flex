export const formatExpirationDate = (expirationTimestamp: number, locale?: string): string => {
  if (expirationTimestamp === null || expirationTimestamp === undefined) {
    return 'Never'
  }

  const dateLocale =
    locale || (typeof navigator !== 'undefined' ? navigator.language : undefined) || 'en-US'

  return new Date(expirationTimestamp * 1000).toLocaleDateString(dateLocale, {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  })
}
