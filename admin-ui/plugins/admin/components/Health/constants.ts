import { JANS_SERVICES } from '@/constants'

export { STATUS_MAP, DEFAULT_STATUS, STATUS_LABEL_KEYS } from '@/constants'

export const HEALTH_PAGE_EXCLUDED_SERVICES = [JANS_SERVICES.LOCK, JANS_SERVICES.LINK] as const

export const HEALTH_CACHE_CONFIG = {
  STALE_TIME: 5 * 60 * 1000,
  GC_TIME: 10 * 60 * 1000,
} as const
