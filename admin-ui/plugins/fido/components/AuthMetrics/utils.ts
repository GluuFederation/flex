import { createDate, createUtcDate, toApiDatetime, type Dayjs } from '@/utils/dayjsUtils'
import type { ThemeConfig } from '@/context/theme/config'
import { getSecurityPalette } from '../SecurityMonitor/utils'
import type { MetricAggregationEntry, MetricDataEntry } from 'JansConfigApi'
import {
  AXIS_KEYS,
  COUNT_KEY,
  GRANULARITY_LABEL_FORMATS,
  GRANULARITY_STEP_MS,
  GRANULARITY_TIERS,
} from './constants'
import type {
  Granularity,
  JsonObject,
  JsonValue,
  MetricChartRow,
  MetricDataValues,
  MetricPoint,
  MetricRawData,
  NamedSeries,
} from './types'

// Sent without an offset, which MetricDateUtil on the server reads as UTC verbatim. toISOString()
// would append Z after converting, so a UTC+5 admin picking the 20th had the window start at 19:00
// on the 19th. The picked wall-clock is the UTC wall-clock, and the axis is rendered in UTC to
// match, so both directions stay on one clock.
const formatDateForApi = (date: Date): string => toApiDatetime(createDate(date))

// Both ends snap to the day they name, so a hand-picked date covers that whole day rather than
// starting at whatever time the picker happened to carry over. The presets already did this; the
// manual pickers did not, which made the two paths disagree for the same visible date.
const startOfDay = (date: Dayjs): Dayjs => date.startOf('day')

// 23:59 rather than 23:59:59, because toApiDatetime truncates to the minute anyway.
const endOfDay = (date: Dayjs): Dayjs => date.hour(23).minute(59).second(0).millisecond(0)

// The granularities a range may be viewed at. Driven by the span in days, so a hand-picked range
// behaves the same as a preset of the same length. A reversed range yields the finest tier rather
// than an empty list, leaving the toggle usable while the user is still mid-edit.
const granularitiesForRange = (startDate: Date, endDate: Date): readonly Granularity[] => {
  const spanDays = createDate(endDate).diff(createDate(startDate), 'day')
  const tier =
    GRANULARITY_TIERS.find((candidate) => spanDays <= candidate.maxSpanDays) ??
    GRANULARITY_TIERS[GRANULARITY_TIERS.length - 1]

  return tier.granularities
}

// The user's pick stands while the range allows it and is only overridden when it does not, so
// returning to a shorter range restores what they last chose rather than a reset default.
const resolveGranularity = (
  granularity: Granularity,
  allowed: readonly Granularity[],
): Granularity => (allowed.includes(granularity) ? granularity : allowed[0])

const isRecord = (value: JsonValue | undefined): value is JsonObject =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

// Aggregations carry `data` as a JSON string, entries as an object. Neither is described by the
// spec, so a malformed payload yields no values rather than throwing mid-render.
const toDataObject = (data: MetricRawData): JsonValue | undefined => {
  if (typeof data !== 'string') return data
  try {
    return JSON.parse(data)
  } catch {
    return null
  }
}

// Numeric leaves are collected by dotted path so nested payloads stay addressable. Numeric
// strings are included because counters frequently arrive quoted.
const collectNumericValues = (
  value: JsonValue | undefined,
  prefix = '',
  acc: MetricDataValues = {},
): MetricDataValues => {
  if (!isRecord(value)) return acc

  for (const [key, leaf] of Object.entries(value)) {
    const path = prefix ? `${prefix}.${key}` : key

    if (typeof leaf === 'number' && Number.isFinite(leaf)) {
      acc[path] = leaf
    } else if (typeof leaf === 'string' && leaf.trim() !== '' && Number.isFinite(Number(leaf))) {
      acc[path] = Number(leaf)
    } else if (isRecord(leaf)) {
      collectNumericValues(leaf, path, acc)
    }
  }

  return acc
}

const parseMetricData = (data: MetricRawData): MetricDataValues =>
  collectNumericValues(toDataObject(data))

// MetricEntry.startDate is a bare java.util.Date with no @JsonFormat, so whether the wire value
// carries a Z is decided by the server's Jackson config rather than by the API contract. Read as
// UTC either way: that is the one clock the metric endpoints store and filter in.
const toTimestamp = (value?: string): number => {
  if (!value) return 0
  const parsed = createUtcDate(value)
  return parsed.isValid() ? parsed.valueOf() : 0
}

const toMetricPoint = (
  entry: MetricAggregationEntry | MetricDataEntry,
  labelFormat: string,
): MetricPoint => {
  const timestamp = toTimestamp(entry.startDate)

  return {
    timestamp,
    label: timestamp ? createUtcDate(entry.startDate).format(labelFormat) : '',
    appType: entry.applicationType,
    metricType: entry.metricType,
    subType: entry.metricSubType,
    // The generated JsonNode is an index signature of unknown; this is the one place the
    // untyped payload crosses into the typed domain, so the cast is made explicitly here.
    values: parseMetricData(entry.data as MetricRawData),
    raw: entry.data as MetricRawData,
  }
}

const toMetricPoints = (
  entries: readonly (MetricAggregationEntry | MetricDataEntry)[] | undefined,
  labelFormat: string,
): MetricPoint[] =>
  (entries ?? [])
    .map((entry) => toMetricPoint(entry, labelFormat))
    .sort((a, b) => a.timestamp - b.timestamp)

// Series colours come from the Security Monitor palette rather than a second set defined here, so
// success and failure read the same across both FIDO dashboards in either theme.
const getSeriesColors = (themeColors: ThemeConfig) => {
  const { chart } = getSecurityPalette(themeColors)

  return {
    success: chart.success,
    failure: chart.failures,
    accessToken: themeColors.chart.blue,
    idToken: themeColors.chart.lightBlue,
    refreshToken: themeColors.chart.purple,
    authorizationCode: themeColors.chart.cyan,
  }
}

// ACR names are discovered at runtime, which is exactly what errorCategories exists for: a themed
// list long enough for arbitrary categories. Cycled so an unexpected count repeats a colour rather
// than rendering an invisible series.
const acrColorAt = (themeColors: ThemeConfig, index: number): string => {
  const { errorCategories } = getSecurityPalette(themeColors)
  return errorCategories[index % errorCategories.length]
}

// With subType omitted the endpoint returns both plain and per-subtype rows for the same window.
// Summing them together double counts, so every caller has to pick a side deliberately.
const plainPoints = (points: readonly MetricPoint[]): MetricPoint[] =>
  points.filter((point) => !point.subType)

const subTypePoints = (points: readonly MetricPoint[]): MetricPoint[] =>
  points.filter((point) => !!point.subType)

const countOf = (point: MetricPoint): number => point.values[COUNT_KEY] ?? 0

const sumCounts = (points: readonly MetricPoint[]): number =>
  points.reduce((total, point) => total + countOf(point), 0)

// The request carries local wall-clock that the server reads as UTC, and rows come back on that
// same clock, so the bucket anchor has to be expressed in it too. Anchoring off a local Date would
// phase every multi-hour bucket by the viewer's offset.
const toUtcWallClockMs = (date: Date): number => createUtcDate(formatDateForApi(date)).valueOf()

// Buckets are measured from the start of the range rather than from the epoch, so "3 Days" means
// three days into the window the user asked for instead of an arbitrary offset inherited from 1970.
// The widest bucket a tier offers spans its whole range, so it lands everything on the anchor and
// gives the range total in one point.
const bucketStart = (timestamp: number, granularity: Granularity, anchorMs: number): number => {
  const step = GRANULARITY_STEP_MS[granularity]

  return anchorMs + Math.floor((timestamp - anchorMs) / step) * step
}

// Folds several named series onto a shared time axis: one row per bucket, one key per series.
// Absent keys are zero-filled so a line never breaks where a neighbouring series has data.
const buildChartRows = (
  series: readonly NamedSeries[],
  granularity: Granularity,
  anchorMs: number,
): MetricChartRow[] => {
  const labelFormat = GRANULARITY_LABEL_FORMATS[granularity]
  const rows = new Map<number, MetricChartRow>()

  for (const { key, points } of series) {
    for (const point of points) {
      if (!point.timestamp) continue
      const bucket = bucketStart(point.timestamp, granularity, anchorMs)
      const row = rows.get(bucket) ?? {
        [AXIS_KEYS.TIMESTAMP]: bucket,
        [AXIS_KEYS.LABEL]: createUtcDate(bucket).format(labelFormat),
      }
      row[key] = (typeof row[key] === 'number' ? row[key] : 0) + countOf(point)
      rows.set(bucket, row)
    }
  }

  const zeroed = Object.fromEntries(series.map(({ key }) => [key, 0]))

  return [...rows.values()]
    .sort((a, b) => Number(a[AXIS_KEYS.TIMESTAMP]) - Number(b[AXIS_KEYS.TIMESTAMP]))
    .map((row) => ({ ...zeroed, ...row }))
}

// Each distinct subtype becomes its own series. Sorted so colour assignment stays stable between
// renders rather than following whatever order the API happened to return.
const groupBySubType = (points: readonly MetricPoint[]): NamedSeries[] => {
  const groups = new Map<string, MetricPoint[]>()

  for (const point of subTypePoints(points)) {
    const key = point.subType as string
    groups.set(key, [...(groups.get(key) ?? []), point])
  }

  return [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, grouped]) => ({ key, points: grouped }))
}

export {
  acrColorAt,
  buildChartRows,
  countOf,
  endOfDay,
  formatDateForApi,
  getSeriesColors,
  granularitiesForRange,
  toUtcWallClockMs,
  groupBySubType,
  parseMetricData,
  plainPoints,
  resolveGranularity,
  startOfDay,
  subTypePoints,
  sumCounts,
  toMetricPoints,
}
