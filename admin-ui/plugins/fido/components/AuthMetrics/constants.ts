export const AUTH_METRICS_CACHE_CONFIG = {
  STALE_TIME: 5 * 60 * 1000,
  GC_TIME: 10 * 60 * 1000,
} as const

export const PAGE_SIZE = {
  SERIES: 500,
} as const

export const MAX_ENTRY_PAGES = 200

export const METRIC_TYPES = {
  AUTH_SUCCESS: 'user_authentication_success',
  AUTH_FAILURE: 'user_authentication_failure',
  AUTH_RATE: 'user_authentication_rate',
  DCR_RATE: 'dynamic_client_registration_rate',
  ACCESS_TOKEN: 'tkn_access_token_count',
  ID_TOKEN: 'tkn_id_token_count',
  REFRESH_TOKEN: 'tkn_refresh_token_count',
  AUTHORIZATION_CODE: 'tkn_authorization_code_count',
  LOGOUT_STATUS_JWT: 'tkn_logout_status_jwt_count',
  LONG_LIVED_ACCESS_TOKEN: 'tkn_long_lived_access_token_count',
} as const

export const COUNT_KEY = 'count'

export const AXIS_KEYS = {
  TIMESTAMP: '__timestamp',
  LABEL: '__label',
} as const

export const GRANULARITIES = {
  HOURLY: 'HOURLY',
  HOURS_3: 'HOURS_3',
  HOURS_12: 'HOURS_12',
  HOURS_24: 'HOURS_24',
  DAILY: 'DAILY',
  DAYS_3: 'DAYS_3',
  DAYS_7: 'DAYS_7',
  DAYS_15: 'DAYS_15',
  DAYS_21: 'DAYS_21',
  DAYS_30: 'DAYS_30',
} as const

const HOUR_MS = 3_600_000
const DAY_MS = 86_400_000

export const GRANULARITY_STEP_MS = {
  [GRANULARITIES.HOURLY]: HOUR_MS,
  [GRANULARITIES.HOURS_3]: 3 * HOUR_MS,
  [GRANULARITIES.HOURS_12]: 12 * HOUR_MS,
  [GRANULARITIES.HOURS_24]: DAY_MS,
  [GRANULARITIES.DAILY]: DAY_MS,
  [GRANULARITIES.DAYS_3]: 3 * DAY_MS,
  [GRANULARITIES.DAYS_7]: 7 * DAY_MS,
  [GRANULARITIES.DAYS_15]: 15 * DAY_MS,
  [GRANULARITIES.DAYS_21]: 21 * DAY_MS,
  [GRANULARITIES.DAYS_30]: 30 * DAY_MS,
}

export const GRANULARITY_LABEL_FORMATS = {
  [GRANULARITIES.HOURLY]: 'MMM-DD HH:00',
  [GRANULARITIES.HOURS_3]: 'MMM-DD HH:00',
  [GRANULARITIES.HOURS_12]: 'MMM-DD HH:00',
  [GRANULARITIES.HOURS_24]: 'MMM-DD',
  [GRANULARITIES.DAILY]: 'MMM-DD',
  [GRANULARITIES.DAYS_3]: 'MMM-DD',
  [GRANULARITIES.DAYS_7]: 'MMM-DD',
  [GRANULARITIES.DAYS_15]: 'MMM-DD',
  [GRANULARITIES.DAYS_21]: 'MMM-DD',
  [GRANULARITIES.DAYS_30]: 'MMM-DD',
}

export const GRANULARITY_TIERS = [
  {
    maxSpanDays: 2,
    granularities: [
      GRANULARITIES.HOURLY,
      GRANULARITIES.HOURS_3,
      GRANULARITIES.HOURS_12,
      GRANULARITIES.HOURS_24,
    ],
  },
  {
    maxSpanDays: 14,
    granularities: [GRANULARITIES.DAILY, GRANULARITIES.DAYS_3, GRANULARITIES.DAYS_7],
  },
  {
    maxSpanDays: Number.POSITIVE_INFINITY,
    granularities: [
      GRANULARITIES.DAILY,
      GRANULARITIES.DAYS_3,
      GRANULARITIES.DAYS_7,
      GRANULARITIES.DAYS_15,
      GRANULARITIES.DAYS_21,
      GRANULARITIES.DAYS_30,
    ],
  },
] as const

export const DEFAULT_GRANULARITY = GRANULARITIES.DAILY

export const POINT_LABEL_FORMAT = 'MMM-DD HH:mm'

export const SPARSE_SERIES_MAX_POINTS = 40

export const DEFAULT_SELECTED_RANGE_DAYS = 7

export const DATE_PRESETS = [
  { labelKey: 'fields.date_preset_24h', value: 1 },
  { labelKey: 'fields.date_preset_7d', value: 7 },
  { labelKey: 'fields.date_preset_30d', value: 30 },
] as const
