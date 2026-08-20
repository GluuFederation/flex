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

const startOfWindow = (days: number) => startOfDay(dayjs().subtract(days, 'day'))

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
  // Held here rather than inside the dropdown so picking a preset can open it. Closed on load.
  const [isGranularityMenuOpen, setIsGranularityMenuOpen] = useState(false)

  // Draft dates are held separately from the applied range so the charts only refetch on View,
  // the same contract the MAU dashboard uses.
  const [appliedRange, setAppliedRange] = useState<MetricRange>(() => ({
    startDate: startOfWindow(DEFAULT_SELECTED_RANGE_DAYS).toDate(),
    endDate: endOfToday().toDate(),
  }))

  // Snapped to day boundaries so picking a single date covers that whole day. The picker carries a
  // time of day the user never chose, and left as-is it cut the first hours off the start date.
  const handleStartDateChange = useCallback((date: Dayjs | null) => {
    if (!date) return
    setStartDate(startOfDay(date))
    // Any hand-picked date leaves the presets, so none of them should read as active.
    setSelectedPreset(null)
  }, [])

  const handleEndDateChange = useCallback((date: Dayjs | null) => {
    if (!date) return
    setEndDate(endOfDay(date))
    setSelectedPreset(null)
  }, [])

  // Presets carry days here rather than the MAU dashboard's months, since auth rows expire on
  // metricReporterKeepDataDays.
  const handlePresetSelect = useCallback((days: number) => {
    setSelectedPreset(days)
    setStartDate(startOfWindow(days))
    setEndDate(endOfToday())
    // A new range changes which granularities apply, so the menu opens on the new set instead of
    // leaving the user to notice for themselves that the options moved under the collapsed label.
    setIsGranularityMenuOpen(true)
  }, [])

  const handleApply = useCallback(() => {
    setAppliedRange({ startDate: startDate.toDate(), endDate: endDate.toDate() })
  }, [startDate, endDate])

  // Follows the dates being edited rather than the applied range, so the toggle shows what the
  // pending selection allows before View is pressed. Granularity is a client-side fold, so
  // narrowing it re-buckets what is already loaded without waiting for a refetch.
  const allowedGranularities = useMemo(
    () => granularitiesForRange(startDate.toDate(), endDate.toDate()),
    [startDate, endDate],
  )

  // Resolved during render rather than corrected through an effect, which keeps `granularity` as a
  // record of what the user last asked for: pick 5 min on 24 Hours, move to 30 Days and back, and
  // 5 min returns instead of a reset default.
  const effectiveGranularity = resolveGranularity(granularity, allowedGranularities)

  const { authRows, acrRows, acrSeries, tokenRows, totals, isBusy, isError, isTruncated } =
    useAuthMetricsCharts({ range: appliedRange, granularity: effectiveGranularity })

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
              // Hangs under whichever preset was clicked rather than standing as its own control:
              // which buckets are available is a property of the range, so the choice belongs
              // against the button that set it.
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

          {/* Stated outright: a capped page walk means the totals below undercount, and a silent
              short chart is exactly the failure this replaced. */}
          {!isError && isTruncated ? (
            <GluuText variant="p" className={classes.notice}>
              {t('fields.auth_metrics_truncated')}
            </GluuText>
          ) : null}

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
        </GluuPageContent>
      </GluuViewWrapper>
    </GluuLoader>
  )
}

export default AuthMetricsPage
