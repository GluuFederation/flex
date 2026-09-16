import customColors from '@/customColors'

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
