import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { createDate } from '@/utils/dayjsUtils'
import { METRIC_OPERATION_TYPES } from '../../Metrics/constants'
import {
  useAggregationMetrics,
  useDevicesAnalytics,
  useErrorsAnalytics,
  useMetricsEntries,
  useMetricsEntriesByOperation,
} from '../../Metrics/hooks'
import {
  ANOMALY_GRANULARITIES,
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
  countSequenceSpikes,
  countSpikes,
  filterSuspiciousIps,
  getSecurityPalette,
  percentDelta,
  pointDelta,
  sliceEntriesByRange,
  successRateOf,
  sumAggregation,
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
  const monthlyQuery = useAggregationMetrics('Monthly', ranges.lastTwelveMonths)
  const errorsQuery = useErrorsAnalytics(ranges.primary)
  const devicesQuery = useDevicesAnalytics(ranges.deviceTrend)
  const ipEntriesQuery = useMetricsEntries(ranges.ipWindow, { limit: SECURITY_ENTRIES_LIMIT })
  const authEntriesQuery = useMetricsEntriesByOperation(
    METRIC_OPERATION_TYPES.AUTHENTICATION,
    ranges.primary,
    { limit: SECURITY_ENTRIES_LIMIT },
  )
  const spikeSeries = useMemo(
    () =>
      buildFailureSpikeSeries(
        pulseQuery.data?.entries ?? [],
        ranges.primary.startDate,
        ranges.pulseLabelFormat,
      ),
    [pulseQuery.data, ranges.primary.startDate, ranges.pulseLabelFormat],
  )

  const dropOffSeries = useMemo(
    () =>
      buildDropOffSeries(
        sliceEntriesByRange(
          dailyQuery.data?.entries ?? [],
          ranges.dropOff.startDate,
          ranges.dropOff.endDate,
        ),
        ranges.dropOffLabelFormat,
      ),
    [dailyQuery.data, ranges.dropOff, ranges.dropOffLabelFormat],
  )

  const ipStats = useMemo(
    () => aggregateIpFailures(ipEntriesQuery.data?.entries ?? []),
    [ipEntriesQuery.data],
  )

  const suspiciousIps = useMemo(() => filterSuspiciousIps(ipStats), [ipStats])

  const errorSlices = useMemo(
    () => buildErrorCategorySlices(errorsQuery.data, palette.errorCategories),
    [errorsQuery.data, palette.errorCategories],
  )

  const authEntries = useMemo(() => authEntriesQuery.data?.entries ?? [], [authEntriesQuery.data])

  const velocityMinAttempts = useMemo(() => {
    const days = Math.max(1, ranges.primary.endDate.diff(ranges.primary.startDate, 'day') + 1)
    return VELOCITY_ANOMALY_MIN_ATTEMPTS * days
  }, [ranges.primary])

  const velocityMatrix = useMemo(
    () => buildVelocityMatrix(authEntries, TOP_USER_LIMIT, velocityMinAttempts),
    [authEntries, velocityMinAttempts],
  )

  const deviceTrend = useMemo(
    () => buildDeviceTrend(deviceQuery.data?.entries ?? []),
    [deviceQuery.data],
  )

  const anomalies = useMemo(
    () => buildAnomalySummary(spikeSeries, suspiciousIps, dropOffSeries, translate),
    [spikeSeries, suspiciousIps, dropOffSeries, translate],
  )

  const summary = useMemo<SecurityKpiSummary>(() => {
    const dailyEntries = dailyQuery.data?.entries ?? []
    const { startDate: monthStart } = ranges.monthWithPrevious
    const todayStart = ranges.today.startDate
    const todayEnd = ranges.today.endDate
    const weekStart = ranges.lastSevenDays.startDate
    const thisMonthStart = createDate(todayStart).startOf('month')

    const today = sumAggregation(sliceEntriesByRange(dailyEntries, todayStart, todayEnd))
    const yesterday = sumAggregation(
      sliceEntriesByRange(
        dailyEntries,
        todayStart.subtract(1, 'day'),
        todayStart.subtract(1, 'millisecond'),
      ),
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

    const hourlyEntries = hourlyQuery.data?.entries ?? []
    const monthlyEntries = monthlyQuery.data?.entries ?? []
    const hourlyAnomaliesToday = countSpikes(
      sliceEntriesByRange(hourlyEntries, todayStart, todayEnd),
    )
    const hourlyAnomaliesYesterday = countSpikes(
      sliceEntriesByRange(
        hourlyEntries,
        todayStart.subtract(1, 'day'),
        todayStart.subtract(1, 'millisecond'),
      ),
    )
    const dailyAnomalies = countSpikes(sliceEntriesByRange(dailyEntries, thisMonthStart, todayEnd))
    const dailyAnomaliesPrevious = countSpikes(
      sliceEntriesByRange(dailyEntries, monthStart, thisMonthStart.subtract(1, 'millisecond')),
    )
    const monthlyAnomalies = countSequenceSpikes(
      sliceEntriesByRange(monthlyEntries, ranges.lastTwelveMonths.startDate, todayEnd),
    )
    const monthlyAnomaliesPrevious = countSequenceSpikes(
      sliceEntriesByRange(
        monthlyEntries,
        ranges.lastTwelveMonths.startDate,
        thisMonthStart.subtract(1, 'millisecond'),
      ),
    )

    return {
      failures: {
        [KPI_PERIODS.TODAY]: today.failures,
        [KPI_PERIODS.LAST_7_DAYS]: week.failures,
        [KPI_PERIODS.THIS_MONTH]: month.failures,
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
        [KPI_PERIODS.TODAY]: percentDelta(today.failures, yesterday.failures),
        [KPI_PERIODS.LAST_7_DAYS]: percentDelta(week.failures, previousWeek.failures),
        [KPI_PERIODS.THIS_MONTH]: percentDelta(month.failures, previousMonth.failures),
      },
      successRateDelta: {
        [KPI_PERIODS.TODAY]: pointDelta(successRateOf(today), successRateOf(yesterday)),
        [KPI_PERIODS.LAST_7_DAYS]: pointDelta(successRateOf(week), successRateOf(previousWeek)),
        [KPI_PERIODS.THIS_MONTH]: pointDelta(successRateOf(month), successRateOf(previousMonth)),
      },
      anomalies: {
        [ANOMALY_GRANULARITIES.HOURLY]: hourlyAnomaliesToday,
        [ANOMALY_GRANULARITIES.DAILY]: dailyAnomalies,
        [ANOMALY_GRANULARITIES.MONTHLY]: monthlyAnomalies,
      },
      anomaliesDelta: {
        [ANOMALY_GRANULARITIES.HOURLY]: pointDelta(hourlyAnomaliesToday, hourlyAnomaliesYesterday),
        [ANOMALY_GRANULARITIES.DAILY]: pointDelta(dailyAnomalies, dailyAnomaliesPrevious),
        [ANOMALY_GRANULARITIES.MONTHLY]: pointDelta(monthlyAnomalies, monthlyAnomaliesPrevious),
      },
    }
  }, [dailyQuery.data, hourlyQuery.data, monthlyQuery.data, ranges])

  const isLoading =
    pulseQuery.isLoading ||
    hourlyQuery.isLoading ||
    dailyQuery.isLoading ||
    ipEntriesQuery.isLoading ||
    authEntriesQuery.isLoading

  const isFetching =
    pulseQuery.isFetching ||
    hourlyQuery.isFetching ||
    dailyQuery.isFetching ||
    deviceQuery.isFetching ||
    monthlyQuery.isFetching ||
    errorsQuery.isFetching ||
    devicesQuery.isFetching ||
    ipEntriesQuery.isFetching ||
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
