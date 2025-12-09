import type { ServiceStatusValue } from './types'

export const HEALTH_CACHE_CONFIG = {
  STALE_TIME: 30 * 1000,
  GC_TIME: 60 * 1000,
} as const

export const STATUS_COLORS: Record<ServiceStatusValue, string> = {
  up: '#28a745',
  down: '#dc3545',
  degraded: '#ffc107',
  unknown: '#ffc107',
} as const

export const STATUS_MAP = {
  'Running': 'up',
  'UP': 'up',
  'up': 'up',
  'DOWN': 'down',
  'down': 'down',
  'DEGRADED': 'degraded',
  'degraded': 'degraded',
  'Not present': 'unknown',
  'not present': 'unknown',
  'unknown': 'unknown',
} as const satisfies Record<string, ServiceStatusValue>

export const DEFAULT_STATUS: ServiceStatusValue = 'unknown'

export const STATUS_LABEL_KEYS: Record<ServiceStatusValue, string> = {
  up: 'messages.status_online',
  down: 'messages.status_offline',
  degraded: 'messages.status_degraded',
  unknown: 'messages.status_unknown',
} as const

export const STATUS_BADGE_COLOR: Record<ServiceStatusValue, string> = {
  up: 'success',
  down: 'danger',
  degraded: 'warning',
  unknown: 'warning',
} as const
