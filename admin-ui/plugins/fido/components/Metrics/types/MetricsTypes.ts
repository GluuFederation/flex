import type { MetricsDateRange } from 'Plugins/fido/shared/api'

export type HeatmapData = {
  rows: readonly string[]
  cols: readonly string[]
  colsSub?: readonly string[]
  data: readonly (readonly number[])[]
  minVal: number
  maxVal: number
}

export type DurationHeatmapProps = {
  title: string
  heatmapData: HeatmapData
  xAxisLabel?: string
  yAxisLabel?: string
  caption?: string
  colorBarLabel?: string
  compact?: boolean
  minHeight?: number
  maxCellHeight?: number
  minColorBarHeight?: number
  verticalRowLabels?: boolean
  colLabelsBottom?: boolean
  showExpand?: boolean
}

export type ActivityChartProps = {
  title: string
  caption?: string
  data: readonly ActivityDataPoint[]
  height?: number
}

export type ActivityBarChartProps = ActivityChartProps & {
  barSize?: number
  barCategoryGap?: string | number
}

export type PasskeyAuthChartProps = {
  dateRange: MetricsDateRange | null
}

export type PasskeyAdoptionChartProps = {
  dateRange: MetricsDateRange | null
}

export type OnboardingTimeChartProps = {
  dateRange: MetricsDateRange | null
}

export type ActivityDataPoint = {
  label: string
  regSuccess: number
  regAttempts: number
  authAttempts: number
  authSuccess: number
  authFailed: number
}

export type AggregationTabProps = {
  filterSheetOpen: boolean
  onFilterSheetClose: () => void
}

export type OnboardingTimeEntry = {
  category: string
  minDuration: number
  avgDuration: number
  maxDuration: number
}

export type AdoptionSurface = 'card' | 'fullscreen'

export type ChartSurfaceSize = {
  width: number
  height: number
}

export type AdoptionDonutBox = {
  left: number
  right: number
}
