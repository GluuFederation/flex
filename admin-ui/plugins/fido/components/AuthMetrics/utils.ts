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

const formatDateForApi = (date: Date): string => toApiDatetime(createDate(date))

const startOfDay = (date: Dayjs): Dayjs => date.startOf('day')

const endOfDay = (date: Dayjs): Dayjs => date.hour(23).minute(59).second(0).millisecond(0)

const granularitiesForRange = (startDate: Date, endDate: Date): readonly Granularity[] => {
  const spanDays = createDate(endDate).diff(createDate(startDate), 'day')
  const tier =
    GRANULARITY_TIERS.find((candidate) => spanDays <= candidate.maxSpanDays) ??
    GRANULARITY_TIERS[GRANULARITY_TIERS.length - 1]

  return tier.granularities
}

const resolveGranularity = (
  granularity: Granularity,
  allowed: readonly Granularity[],
): Granularity => (allowed.includes(granularity) ? granularity : allowed[0])

const isRecord = (value: JsonValue | undefined): value is JsonObject =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const toDataObject = (data: MetricRawData): JsonValue | undefined => {
  if (typeof data !== 'string') return data
  try {
    return JSON.parse(data)
  } catch {
    return null
  }
}

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

const acrColorAt = (themeColors: ThemeConfig, index: number): string => {
  const { errorCategories } = getSecurityPalette(themeColors)
  return errorCategories[index % errorCategories.length]
}

const plainPoints = (points: readonly MetricPoint[]): MetricPoint[] =>
  points.filter((point) => !point.subType)

const subTypePoints = (points: readonly MetricPoint[]): MetricPoint[] =>
  points.filter((point) => !!point.subType)

const countOf = (point: MetricPoint): number => point.values[COUNT_KEY] ?? 0

const sumCounts = (points: readonly MetricPoint[]): number =>
  points.reduce((total, point) => total + countOf(point), 0)

const toUtcWallClockMs = (date: Date): number => createUtcDate(formatDateForApi(date)).valueOf()

const bucketStart = (timestamp: number, granularity: Granularity, anchorMs: number): number => {
  const step = GRANULARITY_STEP_MS[granularity]

  return anchorMs + Math.floor((timestamp - anchorMs) / step) * step
}

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
