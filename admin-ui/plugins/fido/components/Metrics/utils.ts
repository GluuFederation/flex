import type { TFunction } from 'i18next'
import { REGEX_HOURLY_AGGREGATION_PERIOD, REGEX_ISO_WEEK_PERIOD } from '@/utils/regex'
import { createDate, type Dayjs } from '@/utils/dayjsUtils'
import { HEATMAP_COLOR_STOPS, HOURS_OF_DAY } from './constants'
import type { AggregationType } from './constants'
import type { ActivityDataPoint, AggregationEntry, HeatmapData, MetricsDateRange } from './types'

export const hexToRgb = (hex: string): [number, number, number] => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return [r, g, b]
}

export const lerpColor = (hexA: string, hexB: string, t: number): string => {
  const [r1, g1, b1] = hexToRgb(hexA)
  const [r2, g2, b2] = hexToRgb(hexB)
  const r = Math.round(r1 + (r2 - r1) * t)
  const g = Math.round(g1 + (g2 - g1) * t)
  const b = Math.round(b1 + (b2 - b1) * t)
  return `rgb(${r},${g},${b})`
}

export const interpolateHeatmapColor = (value: number, min: number, max: number): string => {
  const t = Math.max(0, Math.min(1, (value - min) / (max - min)))
  const stops = HEATMAP_COLOR_STOPS
  for (let i = 0; i < stops.length - 1; i++) {
    const s0 = stops[i]!
    const s1 = stops[i + 1]!
    if (t >= s0.stop && t <= s1.stop) {
      const localT = (t - s0.stop) / (s1.stop - s0.stop)
      return lerpColor(s0.color, s1.color, localT)
    }
  }
  return stops[stops.length - 1]!.color
}

export const getNiceStep = (min: number, max: number, targetTicks = 6): number => {
  const range = max - min
  if (range <= 0) return 1
  const rough = range / targetTicks
  const pow10 = Math.pow(10, Math.floor(Math.log10(rough)))
  const norm = rough / pow10
  let nice: number
  if (norm < 1.5) nice = 1
  else if (norm < 3) nice = 2
  else if (norm < 7) nice = 5
  else nice = 10
  return Math.max(1, nice * pow10)
}

export const toNumber = (value: number | string | boolean | null | undefined): number => {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  return 0
}

export const toPercent = (value: number | null | undefined): number => {
  if (typeof value !== 'number' || Number.isNaN(value)) return 0
  const normalised = value > 1 ? value : value * 100
  return Math.max(0, Math.min(100, Math.round(normalised)))
}

export const formatChartValue = (value: string | number | boolean | null | undefined): string => {
  const n = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(n)) return ''
  return Number(n.toFixed(2)).toString()
}

export const formatNonZeroChartValue = (
  value: string | number | boolean | null | undefined,
): string => {
  const n = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(n) || n <= 0) return ''
  return Number(n.toFixed(2)).toString()
}

export const isoWeekToMonday = (year: number, week: number): Dayjs => {
  const jan4 = new Date(year, 0, 4)
  const dow = jan4.getDay() || 7
  const week1Mon = new Date(jan4)
  week1Mon.setDate(jan4.getDate() - (dow - 1))
  const monday = new Date(week1Mon)
  monday.setDate(week1Mon.getDate() + (week - 1) * 7)
  return createDate(monday)
}

const formatIsoWith = (iso: string, format: string): string => {
  const d = createDate(iso)
  return d.isValid() ? d.format(format) : iso
}

export const formatDashDate = (iso: string): string => formatIsoWith(iso, 'MMM-DD')

export const formatSpaceDate = (iso: string): string => formatIsoWith(iso, 'MMM DD')

export const formatMonthYear = (iso: string): string => formatIsoWith(iso, 'MMM-YYYY')

export const formatShortDate = (isoDate: string): string => formatIsoWith(isoDate, 'MMM-DD')

export const parseHourlyPeriod = (
  entry: AggregationEntry,
): { date: string; hour: number } | null => {
  const period = entry.period
  if (period) {
    const match = period.match(REGEX_HOURLY_AGGREGATION_PERIOD)
    if (match) {
      return { date: match[1]!, hour: Number(match[2]) }
    }
  }
  if (entry.startTime) {
    const date = entry.startTime.slice(0, 10)
    const hour = Number(entry.startTime.slice(11, 13))
    if (date && Number.isFinite(hour)) return { date, hour }
  }
  return null
}

export const formatPeriodLabel = (entry: AggregationEntry, aggType?: AggregationType): string => {
  const raw =
    entry.period ?? (entry.startTime ? entry.startTime.slice(0, 10) : null) ?? entry.id ?? ''
  if (!raw) return ''

  if (aggType === 'weekly') {
    const isoWeek = raw.match(REGEX_ISO_WEEK_PERIOD)
    if (isoWeek) {
      return isoWeekToMonday(Number(isoWeek[1]), Number(isoWeek[2])).format('MMM-DD')
    }
    return formatDashDate(raw)
  }

  if (aggType === 'monthly') return formatMonthYear(raw)
  if (aggType === 'daily') return formatSpaceDate(raw)

  return raw
}

export const formatHourlyActivityLabel = (entry: AggregationEntry): string => {
  const parsed = parseHourlyPeriod(entry)
  if (!parsed) return formatPeriodLabel(entry)
  return `${formatShortDate(parsed.date)} H${String(parsed.hour).padStart(2, '0')}`
}

export const buildRangeLabel = (
  aggType: AggregationType,
  range: MetricsDateRange,
  t: TFunction,
): string => {
  const start =
    aggType === 'weekly'
      ? range.startDate.format('MMM DD')
      : aggType === 'monthly'
        ? range.startDate.format('MMM YYYY')
        : range.startDate.format('MMM-DD')
  const end =
    aggType === 'monthly' ? range.endDate.format('MMM YYYY') : range.endDate.format('MMM-DD')
  return t('fields.agg_range_label', { type: t(`fields.agg_type_${aggType}`), start, end })
}

export const entriesToActivityData = (
  entries: AggregationEntry[],
  aggType?: AggregationType,
): ActivityDataPoint[] =>
  entries.map((e) => ({
    label: aggType === 'hourly' ? formatHourlyActivityLabel(e) : formatPeriodLabel(e, aggType),
    regSuccess: e.registrationSuccesses ?? 0,
    regAttempts: e.registrationAttempts ?? 0,
    authAttempts: e.authenticationAttempts ?? 0,
    authSuccess: e.authenticationSuccesses ?? 0,
  }))

export const entriesToHeatmapData = (
  entries: AggregationEntry[],
  aggType: AggregationType | undefined,
  t: TFunction,
): HeatmapData => {
  const dateCols = entries.map((e) => formatPeriodLabel(e, aggType))

  const isWeekly = aggType === 'weekly'
  const cols = isWeekly
    ? dateCols.map((_, i) => t('fields.agg_week_number', { number: i + 1 }))
    : dateCols
  const colsSub = isWeekly ? dateCols : undefined

  const authRow = entries.map((e) => e.authenticationAvgDuration ?? 0)
  const regRow = entries.map((e) => e.registrationAvgDuration ?? 0)
  const allVals = [...regRow, ...authRow]
  const minVal = allVals.length ? Math.min(...allVals) : 0
  const maxVal = allVals.length ? Math.max(...allVals) : 1
  return {
    rows: [t('fields.authentication'), t('fields.registration')],
    cols,
    ...(colsSub ? { colsSub } : {}),
    data: [authRow, regRow],
    minVal: Math.max(0, minVal),
    maxVal: maxVal > minVal ? maxVal : minVal + 1,
  }
}

export const entriesToHourlyHeatmap = (
  entries: AggregationEntry[],
  metric: 'registration' | 'authentication',
): HeatmapData => {
  const dateSet = new Set<string>()
  const matrix: Record<string, Record<number, number>> = {}
  entries.forEach((entry) => {
    const parsed = parseHourlyPeriod(entry)
    if (!parsed) return
    const { date, hour } = parsed
    const value =
      metric === 'registration'
        ? (entry.registrationAvgDuration ?? 0)
        : (entry.authenticationAvgDuration ?? 0)
    dateSet.add(date)
    matrix[date] ??= {}
    matrix[date]![hour] = value
  })
  const sortedDates = Array.from(dateSet).sort((a, b) => b.localeCompare(a))
  const data = sortedDates.map((date) => HOURS_OF_DAY.map((_, ci) => matrix[date]?.[ci] ?? 0))
  const allVals = data.flat()
  const minVal = allVals.length ? Math.min(...allVals) : 0
  const maxVal = allVals.length ? Math.max(...allVals) : 1
  return {
    rows: sortedDates.map(formatShortDate),
    cols: HOURS_OF_DAY,
    data,
    minVal: Math.max(0, minVal),
    maxVal: maxVal > minVal ? maxVal : minVal + 1,
  }
}
