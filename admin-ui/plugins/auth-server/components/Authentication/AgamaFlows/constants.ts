export const ACCEPTED_PROJECT_TYPES = {
  'application/octet-stream': ['.gama'],
  'application/x-zip-compressed': ['.zip'],
} as const

export const ACCEPTED_SHA_TYPES = {
  'text/plain': ['.sha256sum'],
} as const

/**
 * The Agama projects endpoint accepts only `start`/`count`, so searching is done
 * client-side over a single wide fetch instead of a server-side pattern query.
 */
export const SEARCH_FETCH_COUNT = 1000

export const DATE_TIME_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  year: '2-digit',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
} as const
