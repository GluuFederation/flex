import React, { useState, useCallback, useMemo } from 'react'
import { Row, Col, GluuDropdown } from 'Components'
import { useTranslation } from 'react-i18next'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import { FILTER_SHEET, MEDIA_QUERY_OPTIONS, MOBILE_MEDIA_QUERY, OPACITY } from '@/constants'
import MobileNavSheet from '@/components/MobileBottomNav/MobileNavSheet'
import { SHEET_KEYS } from '@/components/MobileBottomNav/sheetConstants'
import { GluuDatePicker } from '@/components/GluuDatePicker'
import { GluuButton } from '@/components/GluuButton'
import { createDate } from '@/utils/dayjsUtils'
import type { Dayjs } from 'dayjs'
import { ChevronIcon } from '@/components/SVG'
import { useMetricsStyles } from '../MetricsPage.style'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import {
  AGGREGATION_TYPES,
  EMPTY_HEATMAP_DATA_DEFAULT,
  METRICS_CHART_HEIGHT,
  type AggregationType,
} from '../constants'
import { useAggregationMetrics } from '../hooks'
import type { GluuDropdownOption } from '@/components/GluuDropdown/types'
import type {
  ActivityDataPoint,
  AggregationTabProps,
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

const AggregationTab: React.FC<AggregationTabProps> = ({ filterSheetOpen, onFilterSheetClose }) => {
  const { t } = useTranslation()
  const { state } = useTheme()
  const themeColors = useMemo(() => getThemeColor(state.theme), [state.theme])
  const isDark = state.theme === THEME_DARK
  const { classes } = useMetricsStyles({ isDark, themeColors })
  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY, MEDIA_QUERY_OPTIONS)
  const chartHeight = isMobile ? METRICS_CHART_HEIGHT.MOBILE : METRICS_CHART_HEIGHT.DESKTOP

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
    onFilterSheetClose()
  }, [startDate, endDate, aggType, onFilterSheetClose])

  const handleFilterCancel = useCallback(() => {
    setStartDate(appliedRange.startDate)
    setEndDate(appliedRange.endDate)
    setAggType(appliedAggType)
    onFilterSheetClose()
  }, [appliedRange, appliedAggType, onFilterSheetClose])

  const {
    data: aggApiData,
    isLoading: aggLoading,
    isFetching: aggFetching,
  } = useAggregationMetrics(AGG_TYPE_MAP[appliedAggType], appliedRange)

  const isAggLoading = aggLoading || aggFetching

  const rangeLabel = useMemo(
    () => buildRangeLabel(appliedAggType, appliedRange, t),
    [appliedAggType, appliedRange, t],
  )

  const activityData: ActivityDataPoint[] = useMemo(() => {
    const entries = aggApiData?.entries
    if (!entries || entries.length === 0) return []
    return entriesToActivityData(entries, appliedAggType)
  }, [aggApiData, appliedAggType])

  const trendData: readonly ActivityDataPoint[] = activityData

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

  const sheetCancelColors = useMemo(
    () => ({
      textColor: themeColors.formFooter?.cancel?.textColor ?? themeColors.fontColor,
      borderColor: themeColors.formFooter?.cancel?.borderColor ?? themeColors.borderColor,
    }),
    [themeColors],
  )

  const sheetApplyColors = useMemo(
    () => ({
      backgroundColor: themeColors.badges?.filledBadgeBg ?? themeColors.fontColor,
      textColor: themeColors.badges?.filledBadgeText ?? themeColors.background,
    }),
    [themeColors],
  )

  const aggOptions: GluuDropdownOption<AggregationType>[] = useMemo(
    () =>
      AGGREGATION_TYPES.map((v) => ({
        value: v,
        label: t(`fields.agg_type_${v}`),
      })),
    [t],
  )

  const handleAggTypeSelect = useCallback((value: AggregationType) => setAggType(value), [])

  const aggTriggerLabel = aggType
    ? t(`fields.agg_type_${aggType}`)
    : t('fields.agg_type_placeholder')

  const renderAggTrigger = useCallback(
    (isOpen: boolean) => (
      <div className={classes.aggSelect}>
        <span className={aggType ? undefined : classes.aggSelectPlaceholder}>
          {aggTriggerLabel}
        </span>
        <span className={classes.aggSelectChevron}>
          <ChevronIcon width={20} height={20} direction={isOpen ? 'up' : 'down'} />
        </span>
      </div>
    ),
    [
      classes.aggSelect,
      classes.aggSelectChevron,
      classes.aggSelectPlaceholder,
      aggType,
      aggTriggerLabel,
    ],
  )

  const chartContent = useMemo(() => {
    switch (appliedAggType) {
      case 'hourly':
        return (
          <>
            <Row className={`mb-4 ${classes.chartRow}`}>
              <Col xs={12}>
                <ActivityLineChart
                  title={t('titles.agg_hourly_trend')}
                  caption={rangeLabel}
                  data={trendData}
                  height={chartHeight}
                />
              </Col>
            </Row>
            <Row className={`mb-4 ${classes.chartRow}`}>
              <Col xs={12}>
                <ActivityBarChart
                  title={t('titles.agg_hourly_activity')}
                  caption={rangeLabel}
                  data={activityData}
                  height={chartHeight}
                />
              </Col>
            </Row>
            <Row className={classes.chartRow}>
              <Col xs={12} xxl={6} className="mb-4 mb-xxl-0">
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
              <Col xs={12} xxl={6}>
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
            <Row className={`mb-4 ${classes.chartRow}`}>
              <Col xs={12}>
                <ActivityLineChart
                  title={t('titles.agg_daily_trend')}
                  caption={rangeLabel}
                  data={trendData}
                  height={chartHeight}
                />
              </Col>
            </Row>
            <Row className={`mb-4 ${classes.chartRow}`}>
              <Col xs={12}>
                <ActivityBarChart
                  title={t('titles.agg_daily_activity')}
                  caption={rangeLabel}
                  data={activityData}
                  height={chartHeight}
                />
              </Col>
            </Row>
            <Row className={classes.chartRow}>
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
            <Row className={`mb-4 ${classes.chartRow}`}>
              <Col xs={12}>
                <ActivityLineChart
                  title={t('titles.agg_weekly_trend')}
                  caption={rangeLabel}
                  data={trendData}
                  height={chartHeight}
                />
              </Col>
            </Row>
            <Row className={`mb-4 ${classes.chartRow}`}>
              <Col xs={12} xxl={6} className="mb-4 mb-xxl-0">
                <ActivityBarChart
                  title={t('titles.agg_weekly_activity')}
                  caption={rangeLabel}
                  data={activityData}
                  height={chartHeight}
                />
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
            <Row className={`mb-4 ${classes.chartRow}`}>
              <Col xs={12}>
                <ActivityLineChart
                  title={t('titles.agg_monthly_trend')}
                  caption={rangeLabel}
                  data={trendData}
                  height={chartHeight}
                />
              </Col>
            </Row>
            <Row className={`mb-4 ${classes.chartRow}`}>
              <Col xs={12} xxl={6} className="mb-4 mb-xxl-0">
                <ActivityBarChart
                  title={t('titles.agg_monthly_activity')}
                  caption={rangeLabel}
                  data={activityData}
                  height={chartHeight}
                />
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
  }, [appliedAggType, t, activityData, trendData, heatmapData, authHeatmapData, chartHeight])

  const filterFields = (
    <>
      <div className={classes.filterDateFieldWide}>
        <GluuDatePicker
          mode="range"
          layout={isMobile ? 'grid' : 'row'}
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
        <GluuDropdown<AggregationType>
          className={classes.aggSelectWrapper}
          options={aggOptions}
          selectedValue={aggType === '' ? undefined : aggType}
          onSelect={handleAggTypeSelect}
          renderTrigger={renderAggTrigger}
          position={isMobile ? 'top' : 'bottom'}
          minWidth="100%"
          showArrow={false}
        />
      </div>
    </>
  )

  const filterBar = isMobile ? (
    <MobileNavSheet
      openKey={filterSheetOpen ? SHEET_KEYS.CUSTOM : null}
      onClose={handleFilterCancel}
      title={t('titles.filters')}
    >
      <div className={classes.filterSheetContent}>
        {filterFields}
        <div className={classes.filterSheetButtonRow}>
          <GluuButton
            type="button"
            size="md"
            block
            outlined
            onClick={handleFilterCancel}
            textColor={sheetCancelColors.textColor}
            borderColor={sheetCancelColors.borderColor}
            borderRadius={FILTER_SHEET.BUTTON_RADIUS}
            minHeight={FILTER_SHEET.BUTTON_HEIGHT}
            fontWeight={700}
          >
            {t('actions.cancel')}
          </GluuButton>
          <GluuButton
            type="button"
            size="md"
            block
            onClick={handleApply}
            disabled={!isApplyEnabled}
            backgroundColor={sheetApplyColors.backgroundColor}
            textColor={sheetApplyColors.textColor}
            borderColor={sheetApplyColors.backgroundColor}
            borderRadius={FILTER_SHEET.BUTTON_RADIUS}
            minHeight={FILTER_SHEET.BUTTON_HEIGHT}
            fontWeight={700}
            useOpacityOnHover
            hoverOpacity={OPACITY.OVERLAY}
          >
            {t('actions.apply')}
          </GluuButton>
        </div>
      </div>
    </MobileNavSheet>
  ) : (
    <div className={classes.filterCard}>
      <div className={classes.filterCardContent}>
        <div className={classes.filterRow}>
          {filterFields}
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
  )

  return (
    <GluuLoader blocking={isAggLoading}>
      {filterBar}

      {chartContent}
    </GluuLoader>
  )
}

export default AggregationTab
