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
  'running': 'Running',
  'online': 'Online',
  'not present': 'Unknown',
} as const

export const STATUS_COLOR_MAP: Record<string, string> = {
  'up': 'success',
  'down': 'danger',
  'degraded': 'warning',
  'unknown': 'secondary',
  'running': 'success',
  'online': 'success',
  'not present': 'secondary',
} as const

export function getStatusDisplay(status: string): string {
  return STATUS_DISPLAY_MAP[status.toLowerCase()] ?? 'Unknown'
}

export function getStatusColor(status: string): string {
  return STATUS_COLOR_MAP[status.toLowerCase()] ?? 'secondary'
}
