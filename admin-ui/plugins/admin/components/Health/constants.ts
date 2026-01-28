import customColors from '@/customColors'
import type { ServiceStatusValue } from './types'

export const HEALTH_CACHE_CONFIG = {
  STALE_TIME: 30 * 1000,
  GC_TIME: 60 * 1000,
} as const

export const STATUS_COLORS: Record<ServiceStatusValue, string> = {
  up: customColors.statusActive,
  down: customColors.statusInactive,
} as const

export const STATUS_MAP = {
  'Running': 'up',
  'UP': 'up',
  'up': 'up',
  'DOWN': 'down',
  'down': 'down',
  'DEGRADED': 'down',
  'degraded': 'down',
  'Not present': 'down',
  'not present': 'down',
  'unknown': 'down',
} as const satisfies Record<string, ServiceStatusValue>

export const DEFAULT_STATUS: ServiceStatusValue = 'down'

export const STATUS_LABEL_KEYS: Record<ServiceStatusValue, string> = {
  up: 'messages.status_online',
  down: 'messages.status_offline',
} as const

export const STATUS_BADGE_COLOR: Record<ServiceStatusValue, string> = {
  up: 'success',
  down: 'danger',
} as const
