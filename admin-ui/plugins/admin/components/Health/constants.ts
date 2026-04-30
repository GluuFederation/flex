export {
  STATUS_MAP,
  DEFAULT_STATUS,
  STATUS_LABEL_KEYS,
  STATUS_COLORS,
  STATUS_BADGE_COLOR,
} from '@/constants'

export const HEALTH_PAGE_EXCLUDED_SERVICES = ['jans-lock', 'jans-link'] as const

export const HEALTH_CACHE_CONFIG = {
  STALE_TIME: 5 * 60 * 1000,
  GC_TIME: 10 * 60 * 1000,
} as const
