import type { MetricRawData } from './JsonTypes'
import type { GRANULARITIES } from '../constants'

type Granularity = (typeof GRANULARITIES)[keyof typeof GRANULARITIES]

type MetricRange = {
  startDate: Date
  endDate: Date
}

// The spec leaves `data` opaque: a JSON string on aggregations, an untyped JsonNode on entries.
// Every numeric leaf is captured by path so a chart can pick the key it needs once the real
// shape is known, rather than the parser guessing at field names up front.
type MetricDataValues = Record<string, number>

type MetricPoint = {
  timestamp: number
  label: string
  appType?: string
  metricType?: string
  subType?: string
  values: MetricDataValues
  // Retained so an unrecognised payload can be inspected instead of silently dropped.
  raw: MetricRawData
}

type MetricQueryOptions = {
  enabled?: boolean
}

// One series ready to be folded onto a shared time axis; `key` becomes the recharts dataKey and
// `label` is what a legend shows, so an acr name never has to double as a safe object key.
type NamedSeries = {
  key: string
  label?: string
  points: MetricPoint[]
}

// A recharts row: the underscored axis fields from AXIS_KEYS plus one numeric entry per series
// sharing the bucket. Addressed through an index signature because series keys are only known at
// runtime.
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
