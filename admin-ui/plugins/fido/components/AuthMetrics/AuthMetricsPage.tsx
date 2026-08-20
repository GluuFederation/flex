import React, { useCallback, useMemo, useState } from 'react'
import { GluuPageContent } from 'Components'
import { useTranslation } from 'react-i18next'
import SetTitle from 'Utils/SetTitle'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import { usePermission } from '@/cedarling/hooks/usePermission'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import dayjs, { type Dayjs } from 'dayjs'
import DateRangeSelector from 'Plugins/admin/components/MAU/components/DateRangeSelector'
import { useSecurityTheme } from '../SecurityMonitor/hooks'
import { useAuthMetricsCharts } from './hooks'
import { endOfDay, granularitiesForRange, resolveGranularity, startOfDay } from './utils'
import {
  AcrBreakdownChart,
  AuthActivityChart,
  AuthMetricsKpiStrip,
  GranularityMenu,
  TokenIssuanceChart,
} from './components'
import { DATE_PRESETS, DEFAULT_GRANULARITY, DEFAULT_SELECTED_RANGE_DAYS } from './constants'
import { useAuthMetricsStyles } from './AuthMetricsPage.style'
import type { Granularity, MetricRange } from './types'

const AUTH_METRICS_RESOURCE_ID = ADMIN_UI_RESOURCES.FIDO

const startOfWindow = (days: number) => startOfDay(dayjs().subtract(days - 1, 'day'))

const endOfToday = () => endOfDay(dayjs())

const AuthMetricsPage: React.FC = () => {
  const { t } = useTranslation()
  SetTitle(t('titles.auth_metrics'))

  const { themeColors, isDark } = useSecurityTheme()
  const { classes } = useAuthMetricsStyles({ isDark, themeColors })
  const { canRead: canView } = usePermission(AUTH_METRICS_RESOURCE_ID)

  const [startDate, setStartDate] = useState<Dayjs>(() =>
    startOfWindow(DEFAULT_SELECTED_RANGE_DAYS),
  )
  const [endDate, setEndDate] = useState<Dayjs>(endOfToday)
  const [selectedPreset, setSelectedPreset] = useState<number | null>(DEFAULT_SELECTED_RANGE_DAYS)
  const [granularity, setGranularity] = useState<Granularity>(DEFAULT_GRANULARITY)
  const [isGranularityMenuOpen, setIsGranularityMenuOpen] = useState(false)

  const [appliedRange, setAppliedRange] = useState<MetricRange>(() => ({
    startDate: startOfWindow(DEFAULT_SELECTED_RANGE_DAYS).toDate(),
    endDate: endOfToday().toDate(),
  }))

  const handleStartDateChange = useCallback((date: Dayjs | null) => {
    if (!date) return
    setStartDate(startOfDay(date))
    setSelectedPreset(null)
  }, [])

  const handleEndDateChange = useCallback((date: Dayjs | null) => {
    if (!date) return
    setEndDate(endOfDay(date))
    setSelectedPreset(null)
  }, [])

  const handlePresetSelect = useCallback((days: number) => {
    setSelectedPreset(days)
    setStartDate(startOfWindow(days))
    setEndDate(endOfToday())
    setIsGranularityMenuOpen(true)
  }, [])

  const handleApply = useCallback(() => {
    setAppliedRange({ startDate: startDate.toDate(), endDate: endDate.toDate() })
  }, [startDate, endDate])

  const allowedGranularities = useMemo(
    () => granularitiesForRange(startDate.toDate(), endDate.toDate()),
    [startDate, endDate],
  )

  const effectiveGranularity = resolveGranularity(granularity, allowedGranularities)

  const {
    authRows,
    acrRows,
    acrSeries,
    tokenRows,
    totals,
    isBusy,
    isError,
    isPartial,
    isTruncated,
  } = useAuthMetricsCharts({ range: appliedRange, granularity: effectiveGranularity })

  const granularityLabelOf = useCallback(
    (value: Granularity) => t(`fields.granularity_${value.toLowerCase()}`),
    [t],
  )

  const granularityAria = t('fields.select_granularity')

  const granularityOptions = useMemo(
    () => allowedGranularities.map((value) => ({ value, label: granularityLabelOf(value) })),
    [allowedGranularities, granularityLabelOf],
  )

  const closeGranularityMenu = useCallback(() => setIsGranularityMenuOpen(false), [])

  return (
    <GluuLoader blocking={isBusy}>
      <GluuViewWrapper canShow={canView}>
        <GluuPageContent>
          <div className={classes.filterRow}>
            <DateRangeSelector
              headingKey="titles.auth_token_activity"
              presets={DATE_PRESETS}
              startDate={startDate}
              endDate={endDate}
              selectedPreset={selectedPreset}
              onStartDateChange={handleStartDateChange}
              onEndDateChange={handleEndDateChange}
              onPresetSelect={handlePresetSelect}
              onApply={handleApply}
              isLoading={isBusy}
              presetMenuAnchor={isGranularityMenuOpen ? selectedPreset : null}
              presetMenu={
                <GranularityMenu
                  options={granularityOptions}
                  value={effectiveGranularity}
                  onSelect={setGranularity}
                  onDismiss={closeGranularityMenu}
                  ariaLabel={granularityAria}
                />
              }
            />
          </div>

          {isError ? (
            <GluuText variant="p" className={classes.notice}>
              {t('fields.auth_metrics_unavailable')}
            </GluuText>
          ) : null}

          {!isError && isPartial ? (
            <GluuText variant="p" className={classes.notice}>
              {t('fields.auth_metrics_partial')}
            </GluuText>
          ) : null}

          {!isError && isTruncated ? (
            <GluuText variant="p" className={classes.notice}>
              {t('fields.auth_metrics_truncated')}
            </GluuText>
          ) : null}

          {isError ? null : (
            <>
              <AuthMetricsKpiStrip totals={totals} />

              <div className={classes.fullWidthRow}>
                <AuthActivityChart rows={authRows} />
              </div>
              <div className={classes.fullWidthRow}>
                <AcrBreakdownChart rows={acrRows} series={acrSeries} />
              </div>
              <div className={classes.fullWidthRow}>
                <TokenIssuanceChart rows={tokenRows} />
              </div>
            </>
          )}
        </GluuPageContent>
      </GluuViewWrapper>
    </GluuLoader>
  )
}

export default AuthMetricsPage
