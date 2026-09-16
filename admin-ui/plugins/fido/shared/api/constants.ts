export const METRICS_CACHE_CONFIG = {
  STALE_TIME: 5 * 60 * 1000,
  GC_TIME: 10 * 60 * 1000,
} as const

export const METRICS_ENTRIES_PAGE_SIZE = 200

export const AGGREGATION_BUCKET_UNITS = {
  Hourly: 'hour',
  Daily: 'day',
  Weekly: 'week',
  Monthly: 'month',
} as const

export const AGGREGATION_LIMIT_BOUNDS = { MIN: 50, MAX: 1000 } as const

export const METRIC_OPERATION_TYPES = {
  AUTHENTICATION: 'AUTHENTICATION',
  REGISTRATION: 'REGISTRATION',
} as const

export const METRIC_STATUS = {
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE',
  ABANDONED: 'ABANDONED',
  // Precursor row written when an operation starts; it is later paired with a SUCCESS,
  // FAILURE or ABANDONED row, so counting it as an outcome double-counts the operation.
  ATTEMPT: 'ATTEMPT',
} as const
