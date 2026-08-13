import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { createDate } from '@/utils/dayjsUtils'
import { METRIC_OPERATION_TYPES } from '../../Metrics/constants'
import {
  useAggregationMetrics,
  useDevicesAnalytics,
  useErrorsAnalytics,
  useMetricsEntriesByOperation,
} from '../../Metrics/hooks'
import type { AggregationEntry } from '../../Metrics/types'
import {
  CHART_LABEL_FORMATS,
  KPI_PERIODS,
  SECURITY_ENTRIES_LIMIT,
  TOP_USER_LIMIT,
  VELOCITY_ANOMALY_MIN_ATTEMPTS,
} from '../constants'
import {
  aggregateIpFailures,
  buildAnomalySummary,
  buildDeviceTrend,
  buildDropOffSeries,
  buildErrorCategorySlices,
  buildFailureSpikeSeries,
  buildVelocityMatrix,
  countSpikesInRange,
  filterSpikePointsByRange,
  filterSuspiciousIps,
  getSecurityPalette,
  percentDelta,
  pointDelta,
  sliceEntriesByRange,
  sliceMetricsEntriesByRange,
  successRateOf,
  mergeTodayFromHourly,
  sumAggregation,
  totalFailuresOf,
} from '../utils'
import { useSecurityRanges } from './useSecurityRanges'
import { useSecurityTheme } from './useSecurityTheme'
import type {
  KpiPeriod,
  SecurityDashboardData,
  SecurityKpiSummary,
  SecurityTranslate,
} from '../types'

const useSecurityDashboardData = (nowValue: number, period: KpiPeriod): SecurityDashboardData => {
  const { t } = useTranslation()
  const translate = t as SecurityTranslate
  const ranges = useSecurityRanges(nowValue, period)
  const { themeColors } = useSecurityTheme()
  const palette = useMemo(() => getSecurityPalette(themeColors), [themeColors])

  const hourlyQuery = useAggregationMetrics('Hourly', ranges.hourlyWithBaseline)
  const dailyQuery = useAggregationMetrics('Daily', ranges.monthWithPrevious)
  const pulseQuery = useAggregationMetrics(ranges.pulseAggregation, ranges.pulse)
  const deviceQuery = useAggregationMetrics('Daily', ranges.deviceTrend)
  const errorsQuery = useErrorsAnalytics(ranges.primary)
  const devicesQuery = useDevicesAnalytics(ranges.deviceTrend)
  const authEntriesQuery = useMetricsEntriesByOperation(
    METRIC_OPERATION_TYPES.AUTHENTICATION,
    ranges.primary,
    { limit: SECURITY_ENTRIES_LIMIT },
  )
  const hourlyEntries = useMemo(() => hourlyQuery.data?.entries ?? [], [hourlyQuery.data])

  const withToday = useCallback(
    (entries: readonly AggregationEntry[]) =>
      mergeTodayFromHourly(entries, hourlyEntries, ranges.today.startDate, ranges.today.endDate),
    [hourlyEntries, ranges.today.startDate, ranges.today.endDate],
  )

  const dailyEntries = useMemo(
    () => withToday(dailyQuery.data?.entries ?? []),
    [dailyQuery.data, withToday],
  )

  const deviceEntries = useMemo(
    () => withToday(deviceQuery.data?.entries ?? []),
    [deviceQuery.data, withToday],
  )

  const pulseEntries = useMemo(() => {
    const entries = pulseQuery.data?.entries ?? []
    return ranges.pulseAggregation === 'Hourly' ? entries : withToday(entries)
  }, [pulseQuery.data, ranges.pulseAggregation, withToday])

  const spikeSeries = useMemo(
    () => buildFailureSpikeSeries(pulseEntries, ranges.primary.startDate, ranges.pulseLabelFormat),
    [pulseEntries, ranges.primary.startDate, ranges.pulseLabelFormat],
  )

  const dropOffSeries = useMemo(
    () =>
      buildDropOffSeries(
        sliceEntriesByRange(dailyEntries, ranges.dropOff.startDate, ranges.dropOff.endDate),
        ranges.dropOffLabelFormat,
      ),
    [dailyEntries, ranges.dropOff, ranges.dropOffLabelFormat],
  )

  const authEntries = useMemo(() => authEntriesQuery.data?.entries ?? [], [authEntriesQuery.data])

  const ipStats = useMemo(() => aggregateIpFailures(authEntries), [authEntries])

  const suspiciousIps = useMemo(() => filterSuspiciousIps(ipStats), [ipStats])

  const errorSlices = useMemo(
    () => buildErrorCategorySlices(errorsQuery.data, palette.errorCategories),
    [errorsQuery.data, palette.errorCategories],
  )

  const velocityMinAttempts = useMemo(() => {
    const days = Math.max(1, ranges.primary.endDate.diff(ranges.primary.startDate, 'day') + 1)
    return VELOCITY_ANOMALY_MIN_ATTEMPTS * days
  }, [ranges.primary])

  const velocityMatrix = useMemo(
    () => buildVelocityMatrix(authEntries, TOP_USER_LIMIT, velocityMinAttempts),
    [authEntries, velocityMinAttempts],
  )

  const deviceTrend = useMemo(
    () => buildDeviceTrend(deviceEntries, devicesQuery.data),
    [deviceEntries, devicesQuery.data],
  )

  // The banner reports what is happening right now, so every input is scoped to the
  // trailing two hours. Spike baselines still come from the full hourly history.
  const recentSpikeSeries = useMemo(
    () =>
      filterSpikePointsByRange(
        buildFailureSpikeSeries(hourlyEntries),
        ranges.recentAnomalies.startDate,
        ranges.recentAnomalies.endDate,
      ),
    [hourlyEntries, ranges.recentAnomalies],
  )

  const recentSuspiciousIps = useMemo(
    () =>
      filterSuspiciousIps(
        aggregateIpFailures(
          sliceMetricsEntriesByRange(
            authEntries,
            ranges.recentAnomalies.startDate,
            ranges.recentAnomalies.endDate,
          ),
        ),
      ),
    [authEntries, ranges.recentAnomalies],
  )

  const recentDropOffSeries = useMemo(
    () =>
      buildDropOffSeries(
        sliceEntriesByRange(
          hourlyEntries,
          ranges.recentAnomalies.startDate,
          ranges.recentAnomalies.endDate,
        ),
        CHART_LABEL_FORMATS.HOURLY,
      ),
    [hourlyEntries, ranges.recentAnomalies],
  )

  const anomalies = useMemo(
    () =>
      buildAnomalySummary(
        recentSpikeSeries.filter((point) => point.isSpike).length,
        recentSpikeSeries,
        recentSuspiciousIps,
        recentDropOffSeries,
        translate,
      ),
    [recentSpikeSeries, recentSuspiciousIps, recentDropOffSeries, translate],
  )

  const summary = useMemo<SecurityKpiSummary>(() => {
    const { startDate: monthStart } = ranges.monthWithPrevious
    const todayStart = ranges.today.startDate
    const todayEnd = ranges.today.endDate
    const weekStart = ranges.lastSevenDays.startDate
    const thisMonthStart = createDate(todayStart).startOf('month')

    const today = sumAggregation(sliceEntriesByRange(dailyEntries, todayStart, todayEnd))
    const yesterdayEnd = todayStart.subtract(1, 'millisecond')
    const yesterday = sumAggregation(
      sliceEntriesByRange(dailyEntries, todayStart.subtract(1, 'day'), yesterdayEnd),
    )
    const week = sumAggregation(sliceEntriesByRange(dailyEntries, weekStart, todayEnd))
    const previousWeek = sumAggregation(
      sliceEntriesByRange(
        dailyEntries,
        weekStart.subtract(7, 'day'),
        weekStart.subtract(1, 'millisecond'),
      ),
    )
    const month = sumAggregation(sliceEntriesByRange(dailyEntries, thisMonthStart, todayEnd))
    const previousMonth = sumAggregation(
      sliceEntriesByRange(dailyEntries, monthStart, thisMonthStart.subtract(1, 'millisecond')),
    )

    // Each KPI period counts the anomalies inside that exact window, so the tile always
    // matches the range the charts are drawing.
    const todayAnomalies = countSpikesInRange(hourlyEntries, todayStart, todayEnd)
    const yesterdayAnomalies = countSpikesInRange(
      hourlyEntries,
      ranges.yesterday.startDate,
      ranges.yesterday.endDate,
    )
    const weekAnomalies = countSpikesInRange(dailyEntries, weekStart, todayEnd)
    const previousWeekAnomalies = countSpikesInRange(
      dailyEntries,
      ranges.previousSevenDays.startDate,
      ranges.previousSevenDays.endDate,
    )
    const monthAnomalies = countSpikesInRange(dailyEntries, thisMonthStart, todayEnd)
    const previousMonthAnomalies = countSpikesInRange(
      dailyEntries,
      ranges.previousMonth.startDate,
      ranges.previousMonth.endDate,
    )

    return {
      failures: {
        [KPI_PERIODS.TODAY]: totalFailuresOf(today),
        [KPI_PERIODS.LAST_7_DAYS]: totalFailuresOf(week),
        [KPI_PERIODS.THIS_MONTH]: totalFailuresOf(month),
      },
      attempts: {
        [KPI_PERIODS.TODAY]: today.attempts,
        [KPI_PERIODS.LAST_7_DAYS]: week.attempts,
        [KPI_PERIODS.THIS_MONTH]: month.attempts,
      },
      successRate: {
        [KPI_PERIODS.TODAY]: successRateOf(today),
        [KPI_PERIODS.LAST_7_DAYS]: successRateOf(week),
        [KPI_PERIODS.THIS_MONTH]: successRateOf(month),
      },
      failureDelta: {
        [KPI_PERIODS.TODAY]: percentDelta(totalFailuresOf(today), totalFailuresOf(yesterday)),
        [KPI_PERIODS.LAST_7_DAYS]: percentDelta(
          totalFailuresOf(week),
          totalFailuresOf(previousWeek),
        ),
        [KPI_PERIODS.THIS_MONTH]: percentDelta(
          totalFailuresOf(month),
          totalFailuresOf(previousMonth),
        ),
      },
      successRateDelta: {
        [KPI_PERIODS.TODAY]: pointDelta(successRateOf(today), successRateOf(yesterday)),
        [KPI_PERIODS.LAST_7_DAYS]: pointDelta(successRateOf(week), successRateOf(previousWeek)),
        [KPI_PERIODS.THIS_MONTH]: pointDelta(successRateOf(month), successRateOf(previousMonth)),
      },
      anomalies: {
        [KPI_PERIODS.TODAY]: todayAnomalies,
        [KPI_PERIODS.LAST_7_DAYS]: weekAnomalies,
        [KPI_PERIODS.THIS_MONTH]: monthAnomalies,
      },
      anomaliesDelta: {
        [KPI_PERIODS.TODAY]: pointDelta(todayAnomalies, yesterdayAnomalies),
        [KPI_PERIODS.LAST_7_DAYS]: pointDelta(weekAnomalies, previousWeekAnomalies),
        [KPI_PERIODS.THIS_MONTH]: pointDelta(monthAnomalies, previousMonthAnomalies),
      },
    }
  }, [dailyQuery.data, hourlyQuery.data, dailyEntries, hourlyEntries, ranges])

  const isLoading =
    pulseQuery.isLoading ||
    hourlyQuery.isLoading ||
    dailyQuery.isLoading ||
    authEntriesQuery.isLoading

  const isFetching =
    pulseQuery.isFetching ||
    hourlyQuery.isFetching ||
    dailyQuery.isFetching ||
    deviceQuery.isFetching ||
    errorsQuery.isFetching ||
    devicesQuery.isFetching ||
    authEntriesQuery.isFetching

  return {
    anomalies,
    summary,
    spikeSeries,
    dropOffSeries,
    ipStats,
    suspiciousIps,
    errorSlices,
    velocityMatrix,
    deviceTrend,
    isLoading,
    isFetching,
  }
}

export { useSecurityDashboardData }
