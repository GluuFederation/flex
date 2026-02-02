export {
  STATUS_MAP,
  DEFAULT_STATUS,
  STATUS_LABEL_KEYS,
  STATUS_COLORS,
  STATUS_BADGE_COLOR,
} from '@/constants'

export const HEALTH_CACHE_CONFIG = {
  STALE_TIME: 30 * 1000,
  GC_TIME: 60 * 1000,
} as const
