import type { Dayjs } from 'dayjs'

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

export const toEpochSecondsFromDayjs = (dayjsValue: Dayjs | null): number | null => {
  try {
    if (!dayjsValue) {
      return null
    }
    const ms = dayjsValue.toDate().getTime()
    if (Number.isFinite(ms)) {
      return Math.floor(ms / 1000)
    }
    return null
  } catch {
    return null
  }
}
