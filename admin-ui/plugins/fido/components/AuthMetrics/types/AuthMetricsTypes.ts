import type { MetricRawData } from './JsonTypes'
import type { GRANULARITIES } from '../constants'

type Granularity = (typeof GRANULARITIES)[keyof typeof GRANULARITIES]

type MetricRange = {
  startDate: Date
  endDate: Date
}

type MetricDataValues = Record<string, number>

type MetricPoint = {
  timestamp: number
  label: string
  appType?: string
  metricType?: string
  subType?: string
  values: MetricDataValues
  raw: MetricRawData
}

type MetricQueryOptions = {
  enabled?: boolean
}

type NamedSeries = {
  key: string
  label?: string
  points: MetricPoint[]
}

type MetricChartRow = Record<string, number | string>

export type {
  Granularity,
  GranularityMenuOption,
  GranularityMenuProps,
  MetricChartRow,
  MetricDataValues,
  MetricPoint,
  MetricQueryOptions,
  MetricRange,
  NamedSeries,
}

type GranularityMenuOption = {
  value: Granularity
  label: string
}

type GranularityMenuProps = {
  options: readonly GranularityMenuOption[]
  value: Granularity
  onSelect: (value: Granularity) => void
  onDismiss: () => void
  ariaLabel: string
}
