import React, { useState, useCallback, useMemo } from 'react'
import { Row, Col } from 'Components'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import { GluuDatePicker } from '@/components/GluuDatePicker'
import { GluuButton } from '@/components/GluuButton'
import { createDate } from '@/utils/dayjsUtils'
import type { Dayjs } from 'dayjs'
import { BORDER_RADIUS, SPACING } from '@/constants'
import { fontFamily, fontSizes, fontWeights } from '@/styles/fonts'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'
import { ChevronIcon } from '@/components/SVG'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { useMetricsStyles } from '../MetricsPage.style'
import { AGGREGATION_TYPES, type AggregationType } from '../constants'
import { useAggregationMetrics } from '../hooks'
import type {
  AggregationEntry,
  AggregationTypeParam,
  MetricsDateRange,
  ActivityDataPoint,
  HeatmapData,
} from '../types'
import ActivityBarChart from './ActivityBarChart'
import DurationHeatmap from './DurationHeatmap'

const AGG_TYPE_MAP: Record<AggregationType, AggregationTypeParam> = {
  hourly: 'Hourly',
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
}

const SHORT_MONTHS_UPPER = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

// Convert ISO week string "YYYY-WNN" to the Monday of that week as { mm, dd, yyyy }
const isoWeekToMonday = (year: number, week: number): { mm: number; dd: number; yyyy: number } => {
  // Jan 4 is always in week 1 of the ISO year
  const jan4 = new Date(year, 0, 4)
  const dow = jan4.getDay() || 7 // 1=Mon … 7=Sun
  // Monday of week 1
  const week1Mon = new Date(jan4)
  week1Mon.setDate(jan4.getDate() - (dow - 1))
  // Add (week-1) weeks
  const monday = new Date(week1Mon)
  monday.setDate(week1Mon.getDate() + (week - 1) * 7)
  return { mm: monday.getMonth() + 1, dd: monday.getDate(), yyyy: monday.getFullYear() }
}

// "YYYY-MM-DD" → "Feb-02" (dash-separated, zero-padded day)
const formatDashDate = (iso: string): string => {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!m) return iso
  const month = SHORT_MONTHS_UPPER[Number(m[2]) - 1] ?? ''
  return `${month}-${m[3]}`
}

// "YYYY-MM-DD" → "Feb 02" (space-separated, zero-padded day)
const formatSpaceDate = (iso: string): string => {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!m) return iso
  const month = SHORT_MONTHS_UPPER[Number(m[2]) - 1] ?? ''
  return `${month} ${m[3]}`
}

// "YYYY-MM" or "YYYY-MM-DD" → "Feb-2026"
const formatMonthYear = (iso: string): string => {
  const m = iso.match(/^(\d{4})-(\d{2})/)
  if (!m) return iso
  const month = SHORT_MONTHS_UPPER[Number(m[2]) - 1] ?? ''
  return `${month}-${m[1]}`
}

const formatPeriodLabel = (entry: AggregationEntry, aggType?: AggregationType): string => {
  const raw =
    entry.period ?? (entry.startTime ? entry.startTime.slice(0, 10) : null) ?? entry.id ?? ''
  if (!raw) return ''

  // weekly: "YYYY-WNN" (ISO week) → "Feb-02"
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

// Build the range label shown as the first x-axis tick, e.g. "Weekly Feb 01\nto Feb-29"
const buildRangeLabel = (aggType: AggregationType, range: MetricsDateRange): string => {
  const startSpaceDate = range.startDate.format('MMM DD') // "Feb 01"
  const startDashDate = range.startDate.format('MMM-DD') // "Feb-01"
  const endDashDate = range.endDate.format('MMM-DD') // "Feb-29"
  const startMonthYear = range.startDate.format('MMM YYYY') // "Feb 2026"
  const endMonthYear = range.endDate.format('MMM YYYY') // "May 2026"

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

const HOURS_OF_DAY = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))

const formatShortDate = (isoDate: string): string => {
  const match = isoDate.match(/^\d{4}-(\d{2})-(\d{2})$/)
  if (!match) return isoDate
  const month = SHORT_MONTHS_UPPER[Number(match[1]) - 1] ?? ''
  return `${month}-${match[2]}`
}

const parseHourlyPeriod = (entry: AggregationEntry): { date: string; hour: number } | null => {
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

// Hourly activity label: "YYYY-MM-DD" + hour → "Feb-02 H12"
const formatHourlyActivityLabel = (entry: AggregationEntry): string => {
  const parsed = parseHourlyPeriod(entry)
  if (!parsed) return formatPeriodLabel(entry)
  return `${formatShortDate(parsed.date)} H${String(parsed.hour).padStart(2, '0')}`
}

const entriesToActivityData = (
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

const entriesToHeatmapData = (
  entries: AggregationEntry[],
  aggType?: AggregationType,
): HeatmapData => {
  const dateCols = entries.map((e) => formatPeriodLabel(e, aggType))

  // Weekly: cols = "Week N", colsSub = "Feb-DD" date labels
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

const entriesToHourlyHeatmap = (
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

const HOURLY_MIN_VAL = 1
const HOURLY_MAX_VAL = 3.5

const AggregationTab: React.FC = () => {
  const { t } = useTranslation()
  const { state } = useTheme()
  const themeColors = useMemo(() => getThemeColor(state.theme), [state.theme])
  const isDark = state.theme === THEME_DARK
  useMetricsStyles({ isDark, themeColors })

  const [startDate, setStartDate] = useState<Dayjs>(() =>
    createDate().startOf('month').startOf('day').millisecond(0),
  )
  const [endDate, setEndDate] = useState<Dayjs>(() =>
    createDate().hour(23).minute(59).second(0).millisecond(0),
  )
  const [aggType, setAggType] = useState<AggregationType | ''>('hourly')
  const [appliedAggType, setAppliedAggType] = useState<AggregationType>('hourly')
  const [appliedRange, setAppliedRange] = useState<MetricsDateRange>(() => ({
    startDate: createDate().startOf('month').startOf('day').millisecond(0),
    endDate: createDate().hour(23).minute(59).second(0).millisecond(0),
  }))

  const isApplyEnabled = !!(startDate && endDate)

  const handleStartDateChange = useCallback((d: Dayjs | null) => {
    if (d) setStartDate(d)
  }, [])
  const handleEndDateChange = useCallback((d: Dayjs | null) => {
    if (d) setEndDate(d)
  }, [])
  const handleApply = useCallback(() => {
    setAppliedRange({ startDate, endDate })
    setAppliedAggType(aggType || 'hourly')
  }, [startDate, endDate, aggType])

  const {
    data: aggApiData,
    isLoading: aggLoading,
    isFetching: aggFetching,
  } = useAggregationMetrics(AGG_TYPE_MAP[appliedAggType], appliedRange)

  const isAggLoading = aggLoading || aggFetching

  const activityData: ActivityDataPoint[] = useMemo(() => {
    const entries = aggApiData?.entries
    if (!entries || entries.length === 0) return []
    const rangeEntry: ActivityDataPoint = {
      label: buildRangeLabel(appliedAggType, appliedRange),
      regSuccess: 0,
      regAttempts: 0,
      authAttempts: 0,
      authSuccess: 0,
    }
    return [rangeEntry, ...entriesToActivityData(entries, appliedAggType)]
  }, [aggApiData, appliedAggType, appliedRange])

  const rawHeatmapData: HeatmapData = useMemo(() => {
    const entries = aggApiData?.entries
    if (!entries || entries.length === 0) {
      const isHourly = appliedAggType === 'hourly'
      return {
        rows: [],
        cols: [],
        data: [],
        minVal: isHourly ? 1 : 140,
        maxVal: isHourly ? 3.5 : 250,
      }
    }
    if (appliedAggType === 'hourly') {
      return entriesToHourlyHeatmap(entries, 'registration')
    }
    return entriesToHeatmapData(entries, appliedAggType)
  }, [aggApiData, appliedAggType])

  const rawAuthHeatmapData: HeatmapData = useMemo(() => {
    const entries = aggApiData?.entries
    if (!entries || entries.length === 0) {
      return { rows: [], cols: [], data: [], minVal: 1, maxVal: 3.5 }
    }
    if (appliedAggType === 'hourly') {
      return entriesToHourlyHeatmap(entries, 'authentication')
    }
    return entriesToHeatmapData(entries, appliedAggType)
  }, [aggApiData, appliedAggType])

  const heatmapData: HeatmapData = useMemo(() => {
    if (appliedAggType !== 'hourly') return rawHeatmapData
    return { ...rawHeatmapData, minVal: HOURLY_MIN_VAL, maxVal: HOURLY_MAX_VAL }
  }, [appliedAggType, rawHeatmapData])

  const authHeatmapData: HeatmapData = useMemo(() => {
    if (appliedAggType !== 'hourly') return rawAuthHeatmapData
    return { ...rawAuthHeatmapData, minVal: HOURLY_MIN_VAL, maxVal: HOURLY_MAX_VAL }
  }, [appliedAggType, rawAuthHeatmapData])

  const cardBg = themeColors.settings?.cardBackground ?? themeColors.card?.background
  const inputBg = themeColors.inputBackground
  const inputBorder = isDark ? 'transparent' : themeColors.borderColor
  const applyButtonColors = useMemo(
    () => ({
      backgroundColor: themeColors.formFooter?.apply?.backgroundColor,
      textColor: themeColors.formFooter?.apply?.textColor,
    }),
    [themeColors],
  )

  const cardBorderStyle = getCardBorderStyle({ isDark, borderRadius: BORDER_RADIUS.DEFAULT })

  const aggOptions = AGGREGATION_TYPES.map((v) => ({
    value: v,
    label: t(`fields.agg_type_${v}`),
  }))

  const chartContent = useMemo(() => {
    switch (appliedAggType) {
      case 'hourly':
        return (
          <>
            <Row className="mb-4">
              <Col xs={12}>
                <ActivityBarChart title={t('titles.agg_hourly_activity')} data={activityData} />
              </Col>
            </Row>
            <Row>
              <Col xs={12} lg={6} className="mb-4 mb-lg-0">
                <DurationHeatmap
                  title={t('titles.agg_hourly_reg_heatmap')}
                  heatmapData={heatmapData}
                  xAxisLabel={t('fields.agg_time_series_hours')}
                  yAxisLabel={t('fields.agg_date')}
                  colorBarLabel={t('fields.agg_duration_seconds')}
                  compact
                  maxCellHeight={140}
                  minColorBarHeight={320}
                />
              </Col>
              <Col xs={12} lg={6}>
                <DurationHeatmap
                  title={t('titles.agg_hourly_auth_heatmap')}
                  heatmapData={authHeatmapData}
                  xAxisLabel={t('fields.agg_time_series_hours')}
                  yAxisLabel={t('fields.agg_date')}
                  colorBarLabel={t('fields.agg_duration_seconds')}
                  compact
                  maxCellHeight={140}
                  minColorBarHeight={320}
                />
              </Col>
            </Row>
          </>
        )

      case 'daily':
        return (
          <>
            <Row className="mb-4">
              <Col xs={12}>
                <ActivityBarChart title={t('titles.agg_daily_activity')} data={activityData} />
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <DurationHeatmap
                  title={t('titles.agg_daily_heatmap')}
                  heatmapData={heatmapData}
                  caption={t('fields.agg_avg_duration_heatmap_caption')}
                  yAxisLabel={t('fields.metrics')}
                  colorBarLabel={t('fields.agg_mili_seconds')}
                  verticalRowLabels
                  colLabelsBottom
                />
              </Col>
            </Row>
          </>
        )

      case 'weekly':
        return (
          <>
            <Row className="mb-4">
              <Col xs={12} xxl={7} className="mb-4 mb-xxl-0">
                <ActivityBarChart title={t('titles.agg_weekly_activity')} data={activityData} />
              </Col>
              <Col xs={12} xxl={5}>
                <DurationHeatmap
                  title={t('titles.agg_weekly_heatmap')}
                  heatmapData={heatmapData}
                  caption={t('fields.agg_avg_duration_heatmap_caption')}
                  yAxisLabel={t('fields.metrics')}
                  colorBarLabel={t('fields.agg_mili_seconds')}
                  minHeight={500}
                  maxCellHeight={200}
                />
              </Col>
            </Row>
          </>
        )

      case 'monthly':
        return (
          <>
            <Row className="mb-4">
              <Col xs={12} xxl={6} className="mb-4 mb-xxl-0">
                <ActivityBarChart title={t('titles.agg_monthly_activity')} data={activityData} />
              </Col>
              <Col xs={12} xxl={6}>
                <DurationHeatmap
                  title={t('titles.agg_monthly_heatmap')}
                  heatmapData={heatmapData}
                  caption={t('fields.agg_monthly_avg_duration_heatmap_caption')}
                  yAxisLabel={t('fields.metrics')}
                  colorBarLabel={t('fields.agg_mili_seconds')}
                  minHeight={500}
                  maxCellHeight={160}
                />
              </Col>
            </Row>
          </>
        )

      default:
        return null
    }
  }, [appliedAggType, t, activityData, heatmapData, authHeatmapData])

  return (
    <GluuLoader blocking={isAggLoading}>
      <div
        style={{
          width: '100%',
          backgroundColor: cardBg,
          ...cardBorderStyle,
          borderRadius: BORDER_RADIUS.DEFAULT,
          padding: `${SPACING.CARD_PADDING}px 20px`,
          marginBottom: SPACING.CARD_GAP,
          position: 'relative',
          zIndex: 0,
          overflow: 'visible',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ position: 'relative', zIndex: 2, isolation: 'isolate' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ flex: 2, minWidth: 280 }}>
              <GluuDatePicker
                mode="range"
                layout="row"
                labelAsTitle
                showTime
                inputHeight={52}
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={handleStartDateChange}
                onEndDateChange={handleEndDateChange}
                startDateLabel={t('dashboard.start_date_time')}
                endDateLabel={t('dashboard.end_date_time')}
                textColor={themeColors.fontColor}
                backgroundColor={cardBg}
              />
            </div>

            <div
              style={{ flex: 1, minWidth: 180, display: 'flex', flexDirection: 'column', gap: 6 }}
            >
              <span
                style={{
                  fontSize: fontSizes.base,
                  fontWeight: fontWeights.semiBold,
                  color: themeColors.fontColor,
                  fontFamily,
                }}
              >
                {t('fields.agg_metrics_type_label')}:
              </span>
              <div style={{ position: 'relative', width: '100%' }}>
                <select
                  value={aggType}
                  onChange={(e) =>
                    setAggType(e.target.value === '' ? '' : (e.target.value as AggregationType))
                  }
                  style={{
                    width: '100%',
                    height: 52,
                    padding: '0 36px 0 16px',
                    border: `1px solid ${inputBorder}`,
                    borderRadius: BORDER_RADIUS.SMALL,
                    backgroundColor: inputBg,
                    color: themeColors.fontColor,
                    fontSize: fontSizes.base,
                    fontWeight: fontWeights.medium,
                    fontFamily,
                    outline: 'none',
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    cursor: 'pointer',
                    boxSizing: 'border-box',
                  }}
                >
                  <option value="">{t('fields.agg_type_placeholder')}</option>
                  {aggOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <span
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                    display: 'flex',
                    color: themeColors.fontColor,
                  }}
                >
                  <ChevronIcon width={20} height={20} direction="down" />
                </span>
              </div>
            </div>

            <div style={{ alignSelf: 'flex-end', minWidth: 120 }}>
              <GluuButton
                type="button"
                size="md"
                minHeight={52}
                block
                backgroundColor={applyButtonColors.backgroundColor}
                textColor={applyButtonColors.textColor}
                borderColor={applyButtonColors.backgroundColor}
                useOpacityOnHover
                disabled={!isApplyEnabled}
                onClick={handleApply}
              >
                {t('actions.apply')}
              </GluuButton>
            </div>
          </div>
        </div>
      </div>

      {chartContent}
    </GluuLoader>
  )
}

export default AggregationTab
