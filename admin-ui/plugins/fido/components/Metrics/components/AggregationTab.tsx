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
import { ChevronIcon } from '@/components/SVG'
import { useMetricsStyles } from '../MetricsPage.style'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { AGGREGATION_TYPES, EMPTY_HEATMAP_DATA_DEFAULT, type AggregationType } from '../constants'
import { useAggregationMetrics } from '../hooks'
import type {
  ActivityDataPoint,
  AggregationTypeParam,
  HeatmapData,
  MetricsDateRange,
} from '../types'
import {
  buildRangeLabel,
  entriesToActivityData,
  entriesToHeatmapData,
  entriesToHourlyHeatmap,
} from '../utils'
import ActivityBarChart from './ActivityBarChart'
import ActivityLineChart from './ActivityLineChart'
import DurationHeatmap from './DurationHeatmap'

const AGG_TYPE_MAP: Record<AggregationType, AggregationTypeParam> = {
  hourly: 'Hourly',
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
}

const AggregationTab: React.FC = () => {
  const { t } = useTranslation()
  const { state } = useTheme()
  const themeColors = useMemo(() => getThemeColor(state.theme), [state.theme])
  const isDark = state.theme === THEME_DARK
  const { classes } = useMetricsStyles({ isDark, themeColors })

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

  const isApplyEnabled = !!(startDate && endDate && !endDate.isBefore(startDate))

  const handleStartDateChange = useCallback((d: Dayjs | null) => {
    if (d) setStartDate(d)
  }, [])
  const handleEndDateChange = useCallback((d: Dayjs | null) => {
    if (d) setEndDate(d)
  }, [])
  const handleApply = useCallback(() => {
    if (!startDate || !endDate || endDate.isBefore(startDate)) return
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
      label: buildRangeLabel(appliedAggType, appliedRange, t),
      regSuccess: 0,
      regAttempts: 0,
      authAttempts: 0,
      authSuccess: 0,
      authFailed: 0,
    }
    return [rangeEntry, ...entriesToActivityData(entries, appliedAggType)]
  }, [aggApiData, appliedAggType, appliedRange, t])

  // The bar chart leads with a zeroed range summary row; a line would read that as a dip to
  // zero, so the trend chart plots the buckets only.
  const trendData: readonly ActivityDataPoint[] = useMemo(
    () => activityData.slice(1),
    [activityData],
  )

  const rawHeatmapData: HeatmapData = useMemo(() => {
    const entries = aggApiData?.entries
    if (!entries || entries.length === 0) {
      return EMPTY_HEATMAP_DATA_DEFAULT
    }
    if (appliedAggType === 'hourly') {
      return entriesToHourlyHeatmap(entries, 'registration')
    }
    return entriesToHeatmapData(entries, appliedAggType, t)
  }, [aggApiData, appliedAggType, t])

  const rawAuthHeatmapData: HeatmapData = useMemo(() => {
    const entries = aggApiData?.entries
    if (!entries || entries.length === 0) {
      return EMPTY_HEATMAP_DATA_DEFAULT
    }
    if (appliedAggType === 'hourly') {
      return entriesToHourlyHeatmap(entries, 'authentication')
    }
    return entriesToHeatmapData(entries, appliedAggType, t)
  }, [aggApiData, appliedAggType, t])

  const heatmapData: HeatmapData = rawHeatmapData
  const authHeatmapData: HeatmapData = rawAuthHeatmapData

  const cardBg = themeColors.settings?.cardBackground ?? themeColors.card?.background
  const applyButtonColors = useMemo(
    () => ({
      backgroundColor: themeColors.formFooter?.apply?.backgroundColor,
      textColor: themeColors.formFooter?.apply?.textColor,
    }),
    [themeColors],
  )

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
                <ActivityLineChart title={t('titles.agg_hourly_trend')} data={trendData} />
              </Col>
            </Row>
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
                  colorBarLabel={t('fields.agg_mili_seconds')}
                  compact
                  colLabelsBottom
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
                  colorBarLabel={t('fields.agg_mili_seconds')}
                  compact
                  colLabelsBottom
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
                <ActivityLineChart title={t('titles.agg_daily_trend')} data={trendData} />
              </Col>
            </Row>
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
                  showExpand={false}
                />
              </Col>
            </Row>
          </>
        )

      case 'weekly':
        return (
          <>
            <Row className="mb-4">
              <Col xs={12}>
                <ActivityLineChart title={t('titles.agg_weekly_trend')} data={trendData} />
              </Col>
            </Row>
            <Row className="mb-4">
              <Col xs={12} xxl={6} className="mb-4 mb-xxl-0">
                <ActivityBarChart title={t('titles.agg_weekly_activity')} data={activityData} />
              </Col>
              <Col xs={12} xxl={6}>
                <DurationHeatmap
                  title={t('titles.agg_weekly_heatmap')}
                  heatmapData={heatmapData}
                  caption={t('fields.agg_avg_duration_heatmap_caption')}
                  yAxisLabel={t('fields.metrics')}
                  colorBarLabel={t('fields.agg_mili_seconds')}
                  minHeight={500}
                  maxCellHeight={200}
                  showExpand={false}
                />
              </Col>
            </Row>
          </>
        )

      case 'monthly':
        return (
          <>
            <Row className="mb-4">
              <Col xs={12}>
                <ActivityLineChart title={t('titles.agg_monthly_trend')} data={trendData} />
              </Col>
            </Row>
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
                  colLabelsBottom
                  showExpand={false}
                />
              </Col>
            </Row>
          </>
        )

      default:
        return null
    }
  }, [appliedAggType, t, activityData, trendData, heatmapData, authHeatmapData])

  return (
    <GluuLoader blocking={isAggLoading}>
      <div className={classes.filterCard}>
        <div className={classes.filterCardContent}>
          <div className={classes.filterRow}>
            <div className={classes.filterDateFieldWide}>
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

            <div className={classes.aggTypeField}>
              <span className={classes.aggFieldLabel}>{t('fields.agg_metrics_type_label')}:</span>
              <div className={classes.aggSelectWrapper}>
                <select
                  value={aggType}
                  onChange={(e) =>
                    setAggType(e.target.value === '' ? '' : (e.target.value as AggregationType))
                  }
                  className={classes.aggSelect}
                >
                  <option value="">{t('fields.agg_type_placeholder')}</option>
                  {aggOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <span className={classes.aggSelectChevron}>
                  <ChevronIcon width={20} height={20} direction="down" />
                </span>
              </div>
            </div>

            <div className={classes.filterActionFieldEnd}>
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
