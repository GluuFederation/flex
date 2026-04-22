import React, { useState, useCallback, useMemo } from 'react'
import { Row, Col } from 'Components'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import { GluuDatePicker } from '@/components/GluuDatePicker'
import { GluuButton } from '@/components/GluuButton'
import { createDate, subtractDate } from '@/utils/dayjsUtils'
import type { Dayjs } from 'dayjs'
import { BORDER_RADIUS, SPACING } from '@/constants'
import { fontFamily, fontSizes, fontWeights } from '@/styles/fonts'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'
import { ChevronIcon } from '@/components/SVG'
import { useMetricsStyles } from '../MetricsPage.style'
import { MOCK_AGGREGATION, AGGREGATION_TYPES, type AggregationType } from '../constants'
import ActivityBarChart from './ActivityBarChart'
import DurationHeatmap from './DurationHeatmap'

const AggregationTab: React.FC = () => {
  const { t } = useTranslation()
  const { state } = useTheme()
  const themeColors = useMemo(() => getThemeColor(state.theme), [state.theme])
  const isDark = state.theme === THEME_DARK
  useMetricsStyles({ isDark, themeColors })

  const [startDate, setStartDate] = useState<Dayjs>(() => subtractDate(createDate(), 4, 'months'))
  const [endDate, setEndDate] = useState<Dayjs>(() => createDate())
  const [aggType, setAggType] = useState<AggregationType>('hourly')

  const handleStartDateChange = useCallback((d: Dayjs | null) => { if (d) setStartDate(d) }, [])
  const handleEndDateChange = useCallback((d: Dayjs | null) => { if (d) setEndDate(d) }, [])
  const handleApply = useCallback(() => { /* trigger API fetch when available */ }, [])

  const cardBg = themeColors.settings?.cardBackground ?? themeColors.card?.background
  const inputBg = themeColors.inputBackground
  const inputBorder = isDark ? 'transparent' : themeColors.borderColor
  const applyButtonColors = useMemo(() => ({
    backgroundColor: themeColors.formFooter?.apply?.backgroundColor,
    textColor: themeColors.formFooter?.apply?.textColor,
  }), [themeColors])

  const cardBorderStyle = getCardBorderStyle({ isDark, borderRadius: BORDER_RADIUS.DEFAULT })

  const aggOptions = AGGREGATION_TYPES.map((v) => ({
    value: v,
    label: t(`fields.agg_type_${v}`),
  }))

  // ─── Charts content per aggregation type ───────────────────────────────────

  const hourlyData = MOCK_AGGREGATION.hourly
  const dailyData = MOCK_AGGREGATION.daily
  const weeklyData = MOCK_AGGREGATION.weekly
  const monthlyData = MOCK_AGGREGATION.monthly

  const chartContent = useMemo(() => {
    switch (aggType) {
      case 'hourly':
        return (
          <>
            <Row className="mb-4">
              <Col xs={12}>
                <ActivityBarChart
                  title={t('titles.agg_hourly_activity')}
                  data={hourlyData.activity}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={12} lg={6} className="mb-4 mb-lg-0">
                <DurationHeatmap
                  title={t('titles.agg_hourly_reg_heatmap')}
                  heatmapData={hourlyData.registrationHeatmap}
                  xAxisLabel={t('fields.agg_time_series_hours')}
                  yAxisLabel={t('fields.agg_date')}
                  colorBarLabel={t('fields.agg_duration_seconds')}
                  compact
                />
              </Col>
              <Col xs={12} lg={6}>
                <DurationHeatmap
                  title={t('titles.agg_hourly_auth_heatmap')}
                  heatmapData={hourlyData.authHeatmap}
                  xAxisLabel={t('fields.agg_time_series_hours')}
                  yAxisLabel={t('fields.agg_date')}
                  colorBarLabel={t('fields.agg_duration_seconds')}
                  compact
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
                <ActivityBarChart
                  title={t('titles.agg_daily_activity')}
                  data={dailyData.activity}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <DurationHeatmap
                  title={t('titles.agg_daily_heatmap')}
                  heatmapData={dailyData.combinedHeatmap}
                  xAxisLabel={t('fields.agg_date')}
                  yAxisLabel=""
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
                <ActivityBarChart
                  title={t('titles.agg_weekly_activity')}
                  data={weeklyData.activity}
                />
              </Col>
              <Col xs={12} lg={5}>
                <DurationHeatmap
                  title={t('titles.agg_weekly_heatmap')}
                  heatmapData={weeklyData.durationHeatmap}
                  yAxisLabel=""
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
                <ActivityBarChart
                  title={t('titles.agg_monthly_activity')}
                  data={monthlyData.activity}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <DurationHeatmap
                  title={t('titles.agg_monthly_heatmap')}
                  heatmapData={monthlyData.combinedHeatmap}
                  xAxisLabel={t('fields.agg_date')}
                  yAxisLabel=""
                />
              </Col>
            </Row>
          </>
        )

      default:
        return null
    }
  }, [aggType, t, hourlyData, dailyData, weeklyData, monthlyData])

  return (
    <>
      {/* ── Filter bar ─────────────────────────────────────────────────────── */}
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
            {/* Date range pickers */}
            <div style={{ flex: 2, minWidth: 280 }}>
              <GluuDatePicker
                mode="range"
                layout="row"
                labelAsTitle
                inputHeight={52}
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={handleStartDateChange}
                onEndDateChange={handleEndDateChange}
                textColor={themeColors.fontColor}
                backgroundColor={cardBg}
              />
            </div>

            {/* Aggregation type dropdown */}
            <div style={{ flex: 1, minWidth: 180, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{
                fontSize: fontSizes.base,
                fontWeight: fontWeights.semiBold,
                color: themeColors.fontColor,
                fontFamily,
              }}>
                {t('fields.agg_metrics_type_label')}:
              </span>
              <div style={{ position: 'relative', width: '100%' }}>
                <select
                  value={aggType}
                  onChange={(e) => setAggType(e.target.value as AggregationType)}
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
                  {aggOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <span style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  pointerEvents: 'none', display: 'flex', color: themeColors.fontColor,
                }}>
                  <ChevronIcon width={20} height={20} direction="down" />
                </span>
              </div>
            </div>

            {/* Apply */}
            <div style={{ alignSelf: 'flex-end' }}>
              <GluuButton
                type="button"
                size="md"
                minHeight={52}
                backgroundColor={applyButtonColors.backgroundColor}
                textColor={applyButtonColors.textColor}
                borderColor={applyButtonColors.backgroundColor}
                useOpacityOnHover
                onClick={handleApply}
              >
                {t('actions.apply')}
              </GluuButton>
            </div>
          </div>
        </div>
      </div>

      {/* ── Chart area ─────────────────────────────────────────────────────── */}
      {chartContent}
    </>
  )
}

export default AggregationTab
