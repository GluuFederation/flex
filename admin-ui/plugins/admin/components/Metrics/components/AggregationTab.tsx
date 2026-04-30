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
import { MOCK_AGGREGATION, AGGREGATION_TYPES, type AggregationType } from '../constants'
import { useAggregationMetrics } from '../hooks'
import type { AggregationEntry, AggregationTypeParam, MetricsDateRange } from '../types'
import type { ActivityDataPoint } from './ActivityBarChart'
import type { HeatmapData } from './DurationHeatmap'
import ActivityBarChart from './ActivityBarChart'
import DurationHeatmap from './DurationHeatmap'

const AGG_TYPE_MAP: Record<AggregationType, AggregationTypeParam> = {
  hourly: 'Hourly',
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
}

const formatPeriodLabel = (entry: AggregationEntry): string => {
  if (entry.period) return entry.period
  if (entry.startTime) return entry.startTime.slice(0, 10)
  return entry.id ?? ''
}

const entriesToActivityData = (entries: AggregationEntry[]): ActivityDataPoint[] =>
  entries.map((e) => ({
    label: formatPeriodLabel(e),
    regSuccess: e.registrationSuccesses ?? 0,
    regAttempts: e.registrationAttempts ?? 0,
    authAttempts: e.authenticationAttempts ?? 0,
    authSuccess: e.authenticationSuccesses ?? 0,
  }))

const entriesToHeatmapData = (entries: AggregationEntry[]): HeatmapData => {
  const cols = entries.map(formatPeriodLabel)
  const regRow = entries.map((e) => e.registrationAvgDuration ?? 0)
  const authRow = entries.map((e) => e.authenticationAvgDuration ?? 0)
  const allVals = [...regRow, ...authRow]
  const minVal = allVals.length ? Math.min(...allVals) : 0
  const maxVal = allVals.length ? Math.max(...allVals) : 1
  return {
    rows: ['Registration', 'Authentication'],
    cols,
    data: [regRow, authRow],
    minVal: Math.max(0, minVal),
    maxVal: maxVal > minVal ? maxVal : minVal + 1,
  }
}

const HOURS_OF_DAY = Array.from({ length: 24 }, (_, i) => String(i + 1))

const SHORT_MONTHS = [
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

const formatShortDate = (isoDate: string): string => {
  const match = isoDate.match(/^\d{4}-(\d{2})-(\d{2})$/)
  if (!match) return isoDate
  const month = SHORT_MONTHS[Number(match[1]) - 1] ?? ''
  return `${month}-${Number(match[2])}`
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
  const data = sortedDates.map((date) => HOURS_OF_DAY.map((_, ci) => matrix[date]?.[ci + 1] ?? 0))
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
  const [aggType, setAggType] = useState<AggregationType | ''>('')
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
  const useMockFallback = !isAggLoading && (!aggApiData?.entries || aggApiData.entries.length === 0)

  const activityData: ActivityDataPoint[] = useMemo(() => {
    const entries = aggApiData?.entries
    if (!entries || entries.length === 0) {
      if (useMockFallback) {
        return [...MOCK_AGGREGATION[appliedAggType].activity] as ActivityDataPoint[]
      }
      return []
    }
    return entriesToActivityData(entries)
  }, [aggApiData, appliedAggType, useMockFallback])

  const heatmapData: HeatmapData = useMemo(() => {
    const entries = aggApiData?.entries
    if (!entries || entries.length === 0) {
      if (useMockFallback) {
        switch (appliedAggType) {
          case 'hourly':
            return MOCK_AGGREGATION.hourly.registrationHeatmap as HeatmapData
          case 'daily':
            return MOCK_AGGREGATION.daily.combinedHeatmap as HeatmapData
          case 'weekly':
            return MOCK_AGGREGATION.weekly.durationHeatmap as HeatmapData
          case 'monthly':
            return MOCK_AGGREGATION.monthly.combinedHeatmap as HeatmapData
        }
      }
      return { rows: [], cols: [], data: [], minVal: 0, maxVal: 1 }
    }
    if (appliedAggType === 'hourly') {
      return entriesToHourlyHeatmap(entries, 'registration')
    }
    return entriesToHeatmapData(entries)
  }, [aggApiData, appliedAggType, useMockFallback])

  const authHeatmapData: HeatmapData = useMemo(() => {
    const entries = aggApiData?.entries
    if (!entries || entries.length === 0) {
      if (useMockFallback) {
        return MOCK_AGGREGATION.hourly.authHeatmap as HeatmapData
      }
      return { rows: [], cols: [], data: [], minVal: 0, maxVal: 1 }
    }
    if (appliedAggType === 'hourly') {
      return entriesToHourlyHeatmap(entries, 'authentication')
    }
    return entriesToHeatmapData(entries)
  }, [aggApiData, appliedAggType, useMockFallback])

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
              <Col xs={12} lg={7} className="mb-4 mb-lg-0">
                <ActivityBarChart title={t('titles.agg_weekly_activity')} data={activityData} />
              </Col>
              <Col xs={12} lg={5}>
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
              <Col xs={12} lg={6} className="mb-4 mb-lg-0">
                <ActivityBarChart
                  title={t('titles.agg_monthly_activity')}
                  data={activityData}
                  barSize={18}
                  barCategoryGap="35%"
                />
              </Col>
              <Col xs={12} lg={6}>
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
