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
export const RECHARTS_INITIAL_DIMENSION = { width: 100, height: 100 }
