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
      return EMPTY_HEATMAP_DATA_DEFAULT
    }
    if (appliedAggType === 'hourly') {
      return entriesToHourlyHeatmap(entries, 'registration')
    }
    return entriesToHeatmapData(entries, appliedAggType)
  }, [aggApiData, appliedAggType])

  const rawAuthHeatmapData: HeatmapData = useMemo(() => {
    const entries = aggApiData?.entries
    if (!entries || entries.length === 0) {
      return EMPTY_HEATMAP_DATA_DEFAULT
    }
    if (appliedAggType === 'hourly') {
      return entriesToHourlyHeatmap(entries, 'authentication')
    }
    return entriesToHeatmapData(entries, appliedAggType)
  }, [aggApiData, appliedAggType])

  const heatmapData: HeatmapData = rawHeatmapData
  const authHeatmapData: HeatmapData = rawAuthHeatmapData

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
                  colorBarLabel={t('fields.agg_mili_seconds')}
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
                  colorBarLabel={t('fields.agg_mili_seconds')}
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
                  showExpand={false}
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
