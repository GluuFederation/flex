export const AUTH_METRICS_CACHE_CONFIG = {
  STALE_TIME: 5 * 60 * 1000,
  GC_TIME: 10 * 60 * 1000,
} as const

// Rows per request. The spec states no maximum, so this stays conservative and the caller pages.
export const PAGE_SIZE = {
  SERIES: 500,
} as const

// Ceiling on the page walk, so a server that keeps reporting a larger total cannot loop forever.
// 200 pages covers roughly two months of five-minute rows, well past the retention window.
export const MAX_ENTRY_PAGES = 200

// Names taken verbatim from the auth server's MetricType enum rather than from /metric/types,
// which only lists types that already hold rows. A type absent from discovery is idle, not
// unsupported, so charting against the enum keeps a series present once its events start.
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

// Every metric payload observed so far carries exactly one numeric leaf.
export const COUNT_KEY = 'count'

// Underscored so a metric subtype can never collide with them: series keys are acr names taken
// straight from the API, and one literally called "label" would otherwise overwrite the axis.
export const AXIS_KEYS = {
  TIMESTAMP: '__timestamp',
  LABEL: '__label',
} as const

// Buckets are folded client-side because /metric/aggregations stays empty until its producer task
// is deployed. Rows arrive at the auth server's metricReporterInterval, five minutes on the test
// deployment, so an hour is the finest bucket offered here.
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

// Bucket width. Every tier ends on a bucket as wide as its own range, which is the total for that
// range in a single point, so no separate "total" option is needed.
export const GRANULARITY_STEP_MS = {
  [GRANULARITIES.HOURLY]: HOUR_MS,
  [GRANULARITIES.HOURS_3]: 3 * HOUR_MS,
  [GRANULARITIES.HOURS_12]: 12 * HOUR_MS,
  // Same width as DAILY, kept separate only so the hour tier can end on "24 Hours" instead of
  // switching units mid-list. The day tiers still read "Daily".
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

// What each range may be viewed at, keyed by span in days rather than by which preset was clicked,
// so a hand-picked range of the same length is offered the same buckets. Ordered coarsest-last, and
// the first entry is what an out-of-range selection falls back to.
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

// The default range is a week, whose tier opens on daily.
export const DEFAULT_GRANULARITY = GRANULARITIES.DAILY

// A raw row's own timestamp, at the reporter's own resolution. Independent of the chart bucket:
// this labels the entry that came back, not the bucket it later folds into.
export const POINT_LABEL_FORMAT = 'MMM-DD HH:mm'

// Below this many points a line is drawn with its markers shown. Hiding them keeps a dense series
// clean, but a coarse bucket can leave two points or one, and a lone point with no marker draws
// nothing at all.
export const SPARSE_SERIES_MAX_POINTS = 40

// Opening window for the date filter. Retention is driven by metricReporterKeepDataDays, 15 days
// on the test deployment, so a much longer default would open on a mostly empty chart.
export const DEFAULT_SELECTED_RANGE_DAYS = 7

// Days rather than the MAU dashboard's months: auth rows expire on metricReporterKeepDataDays,
// so a quarter-length preset would ask for history the store has already dropped.
export const DATE_PRESETS = [
  { labelKey: 'fields.date_preset_24h', value: 1 },
  { labelKey: 'fields.date_preset_7d', value: 7 },
  { labelKey: 'fields.date_preset_30d', value: 30 },
] as const
