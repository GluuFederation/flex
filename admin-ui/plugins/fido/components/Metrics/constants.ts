import customColors from '@/customColors'

export const METRICS_CACHE_CONFIG = {
  STALE_TIME: 5 * 60 * 1000,
  GC_TIME: 10 * 60 * 1000,
} as const

export const METRICS_CHART_COLORS = {
  successRate: customColors.statusActive,
  errorRate: customColors.statusInactive,
  dropOffRate: customColors.orange,
  newUsers: customColors.statusActive,
  totalUsers: customColors.chartBlue,
  adoptionRate: customColors.chartPurple,

  minDuration: customColors.chartPurple,
  avgDuration: customColors.chartCoral,
  maxDuration: customColors.chartCyan,
} as const

// The trend contrasts passed against failed, so each of the four lines takes a clearly
// separated hue rather than the two near-identical warm tones the activity bars use.
export const ACTIVITY_TREND_SERIES_COLORS = {
  authAttempts: customColors.chartBlue,
  authSuccess: customColors.statusActive,
  authFailed: customColors.statusInactive,
} as const

export const ACTIVITY_LINE_DOT_RADIUS = 2.5

export const ACTIVITY_LINE_STROKE_WIDTH = 1.8

// Past this many buckets the markers touch and the line reads as a solid band, so the trend
// keeps the same look by dropping to a plain stroke instead.
export const ACTIVITY_LINE_MAX_DOTS = 60

// Small gutter at each end so the first and last tick labels are not clipped by the card.
export const ACTIVITY_LINE_AXIS_PADDING = { left: 12, right: 24 } as const

export const ACTIVITY_DENSE_BUCKET_COUNT = 24

export const ACTIVITY_MOBILE_DENSE_BUCKET_COUNT = 3

export const ACTIVITY_COMPACT_DENSE_BUCKET_COUNT = 8

export const ACTIVITY_MIN_BUCKET_WIDTH = { MOBILE: 68, COMPACT: 68, DESKTOP: 80 } as const

export const AGGREGATION_SERIES_COLORS = {
  regSuccess: customColors.orange,
  regAttempts: customColors.chartLightBlue,
  authAttempts: customColors.statusActive,
  authSuccess: customColors.chartCoral,
} as const

export const HEATMAP_COLOR_STOPS = [
  { stop: 0, color: customColors.heatmapStop0 },
  { stop: 0.2, color: customColors.heatmapStop1 },
  { stop: 0.45, color: customColors.heatmapStop2 },
  { stop: 0.65, color: customColors.heatmapStop3 },
  { stop: 0.85, color: customColors.heatmapStop4 },
  { stop: 1, color: customColors.heatmapStop5 },
] as const

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

export const AGGREGATION_TYPES = ['hourly', 'daily', 'weekly', 'monthly'] as const
export type AggregationType = (typeof AGGREGATION_TYPES)[number]

export const HOURS_OF_DAY = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))

export const EMPTY_HEATMAP_DATA_DEFAULT = {
  rows: [] as readonly string[],
  cols: [] as readonly string[],
  data: [] as readonly (readonly number[])[],
  minVal: 1,
  maxVal: 3.5,
} as const

export const RADIAN = Math.PI / 180
export const METRICS_CHART_HEIGHT = {
  DESKTOP: 360,
  MOBILE: 180,
  COMPACT: 300,
  FULLSCREEN: 560,
} as const

export const METRICS_MOBILE_CHART = {
  PIE_MARGIN: { top: 8, right: 26, bottom: 8, left: 26 },
  PIE_OUTER_RADIUS: '78%',
  PIE_LABEL_OFFSET: 16,
  PIE_LABEL_LINE_OFFSET: 8,
  PIE_LABEL_FONT_SIZE: 9,
  PIE_LABEL_LINE_GAP: 11,
  PIE_LABEL_LINE_TOP: 5.5,
  AXIS_WIDTH: 38,
  AXIS_FONT_SIZE: 9,
  TICK_FONT_SIZE: 10,
  BAR_SIZE: 12,
  ONBOARDING_BAR_SIZE: 18,
  ONBOARDING_BAR_GAP: 2,
  LINE_MARGIN: { top: 12, right: 12, left: 0 },
  BAR_MARGIN: { top: 12, right: 12, left: 0 },
} as const

export const METRICS_DESKTOP_CHART = {
  PIE_MARGIN: { top: 30, right: 110, bottom: 30, left: 110 },
  PIE_OUTER_RADIUS: '80%',
  PIE_LABEL_OFFSET: 36,
  PIE_LABEL_LINE_OFFSET: 22,
  PIE_LABEL_FONT_SIZE: 13,
  PIE_LABEL_LINE_GAP: 20,
  PIE_LABEL_LINE_TOP: 8,
  AXIS_WIDTH: 45,
  AXIS_FONT_SIZE: 12,
  TICK_FONT_SIZE: 12,
  BAR_SIZE: 28,
  ONBOARDING_BAR_SIZE: 40,
  ONBOARDING_BAR_GAP: 4,
  LINE_MARGIN: { top: 20, right: 32, left: 10 },
  BAR_MARGIN: { top: 20, left: 10 },
} as const

export const METRICS_ZOOM = { MIN: 1, MAX: 3, STEP: 0.25, DEFAULT: 1 } as const

export const RECHARTS_INITIAL_DIMENSION = { width: 100, height: 100 }

export const CHART_SCROLLBAR_GUTTER = 10
