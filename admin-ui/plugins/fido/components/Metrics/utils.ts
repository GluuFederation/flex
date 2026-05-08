import { HEATMAP_COLOR_STOPS, HOURS_OF_DAY, SHORT_MONTHS_UPPER } from './constants'
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

export const isoWeekToMonday = (
  year: number,
  week: number,
): { mm: number; dd: number; yyyy: number } => {
  const jan4 = new Date(year, 0, 4)
  const dow = jan4.getDay() || 7
  const week1Mon = new Date(jan4)
  week1Mon.setDate(jan4.getDate() - (dow - 1))
  const monday = new Date(week1Mon)
  monday.setDate(week1Mon.getDate() + (week - 1) * 7)
  return { mm: monday.getMonth() + 1, dd: monday.getDate(), yyyy: monday.getFullYear() }
}

export const formatDashDate = (iso: string): string => {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!m) return iso
  const month = SHORT_MONTHS_UPPER[Number(m[2]) - 1] ?? ''
  return `${month}-${m[3]}`
}

export const formatSpaceDate = (iso: string): string => {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!m) return iso
  const month = SHORT_MONTHS_UPPER[Number(m[2]) - 1] ?? ''
  return `${month} ${m[3]}`
}

export const formatMonthYear = (iso: string): string => {
  const m = iso.match(/^(\d{4})-(\d{2})/)
  if (!m) return iso
  const month = SHORT_MONTHS_UPPER[Number(m[2]) - 1] ?? ''
  return `${month}-${m[1]}`
}

export const formatShortDate = (isoDate: string): string => {
  const match = isoDate.match(/^\d{4}-(\d{2})-(\d{2})$/)
  if (!match) return isoDate
  const month = SHORT_MONTHS_UPPER[Number(match[1]) - 1] ?? ''
  return `${month}-${match[2]}`
}

export const parseHourlyPeriod = (
  entry: AggregationEntry,
): { date: string; hour: number } | null => {
  const period = entry.period
  if (period) {
    const match = period.match(/^(\d{4}-\d{2}-\d{2})-(\d{1,2})$/)
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
    const isoWeek = raw.match(/^(\d{4})-W(\d{1,2})$/)
    if (isoWeek) {
      const { mm, dd } = isoWeekToMonday(Number(isoWeek[1]), Number(isoWeek[2]))
      const month = SHORT_MONTHS_UPPER[mm - 1] ?? ''
      return `${month}-${String(dd).padStart(2, '0')}`
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

export const buildRangeLabel = (aggType: AggregationType, range: MetricsDateRange): string => {
  const startSpaceDate = range.startDate.format('MMM DD')
  const startDashDate = range.startDate.format('MMM-DD')
  const endDashDate = range.endDate.format('MMM-DD')
  const startMonthYear = range.startDate.format('MMM YYYY')
  const endMonthYear = range.endDate.format('MMM YYYY')

  switch (aggType) {
    case 'hourly':
      return `Hourly ${startDashDate}\nto ${endDashDate}`
    case 'daily':
      return `Daily ${startDashDate}\nto ${endDashDate}`
    case 'weekly':
      return `Weekly ${startSpaceDate}\nto ${endDashDate}`
    case 'monthly':
      return `Monthly ${startMonthYear}\nto ${endMonthYear}`
  }
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
  aggType?: AggregationType,
): HeatmapData => {
  const dateCols = entries.map((e) => formatPeriodLabel(e, aggType))

  const isWeekly = aggType === 'weekly'
  const cols = isWeekly ? dateCols.map((_, i) => `Week ${i + 1}`) : dateCols
  const colsSub = isWeekly ? dateCols : undefined

  const authRow = entries.map((e) => e.authenticationAvgDuration ?? 0)
  const regRow = entries.map((e) => e.registrationAvgDuration ?? 0)
  const allVals = [...regRow, ...authRow]
  const minVal = allVals.length ? Math.min(...allVals) : 0
  const maxVal = allVals.length ? Math.max(...allVals) : 1
  return {
    rows: ['Authentication', 'Registration'],
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
  const sortedDates = Array.from(dateSet).sort()
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
