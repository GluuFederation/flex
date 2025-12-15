export const DASHBOARD_CACHE_CONFIG = {
  STALE_TIME: 30 * 1000,
  GC_TIME: 60 * 1000,
} as const

export const REPORTS_CACHE_CONFIG = {
  STALE_TIME: 60 * 1000,
  GC_TIME: 2 * 60 * 1000,
} as const

export const STATUS_DISPLAY_MAP: Record<string, string> = {
  'up': 'Running',
  'down': 'Down',
  'degraded': 'Degraded',
  'unknown': 'Unknown',
  'RUNNING': 'Running',
  'ONLINE': 'Online',
  'DOWN': 'Down',
  'Not present': 'Unknown',
} as const

export const STATUS_COLOR_MAP: Record<string, string> = {
  up: 'success',
  down: 'danger',
  degraded: 'warning',
  unknown: 'secondary',
} as const
