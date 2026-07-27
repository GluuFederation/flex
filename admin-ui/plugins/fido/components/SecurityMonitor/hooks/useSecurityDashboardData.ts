import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { createDate } from '@/utils/dayjsUtils'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { METRIC_OPERATION_TYPES } from '../../Metrics/constants'
import {
  useAggregationMetrics,
  useDevicesAnalytics,
  useErrorsAnalytics,
  useMetricsEntries,
  useMetricsEntriesByOperation,
  useMetricsEntriesByUser,
} from '../../Metrics/hooks'
import {
  ALL_USERS_OPTION,
  ANOMALY_GRANULARITIES,
  KPI_PERIODS,
  SECURITY_ENTRIES_LIMIT,
} from '../constants'
import {
  aggregateIpFailures,
  buildAnomalySummary,
  buildDeviceTrend,
  buildDropOffSeries,
  buildErrorCategorySlices,
  buildFailureSpikeSeries,
  buildVelocityMatrix,
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
import type { SecurityDashboardData, SecurityKpiSummary, SecurityTranslate } from '../types'

const useSecurityDashboardData = (
  nowValue: number,
  selectedUserId: string,
): SecurityDashboardData => {
  const { t } = useTranslation()
  const translate = t as SecurityTranslate
  const ranges = useSecurityRanges(nowValue)
  const { state: themeState } = useTheme()
  const palette = useMemo(
    () => getSecurityPalette(getThemeColor(themeState.theme)),
    [themeState.theme],
  )

  const hourlyQuery = useAggregationMetrics('Hourly', ranges.hourlyWithBaseline)
  const dailyQuery = useAggregationMetrics('Daily', ranges.monthWithPrevious)
  const deviceQuery = useAggregationMetrics('Daily', ranges.deviceTrend)
  const monthlyQuery = useAggregationMetrics('Monthly', ranges.lastTwelveMonths)
  const errorsQuery = useErrorsAnalytics(ranges.today)
  const devicesQuery = useDevicesAnalytics(ranges.deviceTrend)
  const ipEntriesQuery = useMetricsEntries(ranges.ipWindow, { limit: SECURITY_ENTRIES_LIMIT })
  const authEntriesQuery = useMetricsEntriesByOperation(
    METRIC_OPERATION_TYPES.AUTHENTICATION,
    ranges.today,
    { limit: SECURITY_ENTRIES_LIMIT },
  )
  const userEntriesQuery = useMetricsEntriesByUser(
    selectedUserId === ALL_USERS_OPTION ? '' : selectedUserId,
    ranges.today,
    { limit: SECURITY_ENTRIES_LIMIT },
  )

  const spikeSeries = useMemo(
    () => buildFailureSpikeSeries(hourlyQuery.data?.entries ?? [], ranges.today.startDate),
    [hourlyQuery.data, ranges.today.startDate],
  )

  const dropOffSeries = useMemo(
    () =>
      buildDropOffSeries(
        sliceEntriesByRange(
          dailyQuery.data?.entries ?? [],
          ranges.lastSevenDays.startDate,
          ranges.lastSevenDays.endDate,
        ),
      ),
    [dailyQuery.data, ranges.lastSevenDays],
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

  const userIds = useMemo(
    () =>
      Array.from(
        new Set(
          authEntries
            .map((entry) => entry.username ?? entry.userId)
            .filter((identity): identity is string => !!identity),
        ),
      ).sort((a, b) => a.localeCompare(b)),
    [authEntries],
  )

  const velocityEntries = useMemo(() => {
    if (selectedUserId === ALL_USERS_OPTION) return authEntries
    return userEntriesQuery.data?.entries ?? []
  }, [selectedUserId, authEntries, userEntriesQuery.data])

  const velocityMatrix = useMemo(
    () => buildVelocityMatrix(velocityEntries, translate),
    [velocityEntries, translate],
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
    const monthlyAnomalies = countSpikes(monthlyEntries)

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
        [ANOMALY_GRANULARITIES.MONTHLY]: pointDelta(monthlyAnomalies, 0),
      },
    }
  }, [dailyQuery.data, hourlyQuery.data, monthlyQuery.data, ranges])

  const isLoading =
    hourlyQuery.isLoading ||
    dailyQuery.isLoading ||
    ipEntriesQuery.isLoading ||
    authEntriesQuery.isLoading

  const isFetching =
    hourlyQuery.isFetching ||
    dailyQuery.isFetching ||
    deviceQuery.isFetching ||
    monthlyQuery.isFetching ||
    errorsQuery.isFetching ||
    devicesQuery.isFetching ||
    ipEntriesQuery.isFetching ||
    authEntriesQuery.isFetching ||
    userEntriesQuery.isFetching

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
    userIds,
    isLoading,
    isFetching,
  }
}

export { useSecurityDashboardData }
