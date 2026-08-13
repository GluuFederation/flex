import { useMemo } from 'react'
import { createDate } from '@/utils/dayjsUtils'
import {
  BASELINE_WINDOW_DAYS,
  CHART_LABEL_FORMATS,
  DEVICE_TREND_DAYS,
  KPI_PERIODS,
  RECENT_ANOMALY_WINDOW_HOURS,
} from '../constants'
import type { KpiPeriod, SecurityRanges } from '../types'

const useSecurityRanges = (nowValue: number, period: KpiPeriod): SecurityRanges =>
  useMemo(() => {
    const now = createDate(nowValue).millisecond(0)
    const startOfToday = now.startOf('day')
    const endOfToday = now.endOf('day').millisecond(0)

    const today = { startDate: startOfToday, endDate: endOfToday }
    const lastSevenDays = {
      startDate: startOfToday.subtract(BASELINE_WINDOW_DAYS - 1, 'day'),
      endDate: endOfToday,
    }
    const deviceTrend = {
      startDate: startOfToday.subtract(DEVICE_TREND_DAYS - 1, 'day'),
      endDate: endOfToday,
    }
    const thisMonth = { startDate: now.startOf('month'), endDate: endOfToday }
    const yesterday = {
      startDate: startOfToday.subtract(1, 'day'),
      endDate: startOfToday.subtract(1, 'millisecond'),
    }
    const previousSevenDays = {
      startDate: lastSevenDays.startDate.subtract(BASELINE_WINDOW_DAYS, 'day'),
      endDate: lastSevenDays.startDate.subtract(1, 'millisecond'),
    }
    const previousMonth = {
      startDate: now.subtract(1, 'month').startOf('month'),
      endDate: thisMonth.startDate.subtract(1, 'millisecond'),
    }

    const isToday = period === KPI_PERIODS.TODAY
    const primary = period === KPI_PERIODS.THIS_MONTH ? thisMonth : isToday ? today : lastSevenDays

    return {
      hourlyWithBaseline: {
        startDate: startOfToday.subtract(BASELINE_WINDOW_DAYS, 'day'),
        endDate: endOfToday,
      },
      recentAnomalies: {
        startDate: now.subtract(RECENT_ANOMALY_WINDOW_HOURS, 'hour').startOf('hour'),
        endDate: now,
      },
      today,
      yesterday,
      previousSevenDays,
      previousMonth,
      lastSevenDays,
      deviceTrend: isToday ? deviceTrend : primary,
      monthWithPrevious: {
        startDate: now.subtract(1, 'month').startOf('month'),
        endDate: endOfToday,
      },
      primary,
      pulse: {
        startDate: primary.startDate.subtract(BASELINE_WINDOW_DAYS, 'day'),
        endDate: primary.endDate,
      },
      dropOff: isToday ? lastSevenDays : primary,
      pulseAggregation: isToday ? 'Hourly' : 'Daily',
      pulseLabelFormat: isToday ? CHART_LABEL_FORMATS.HOURLY : CHART_LABEL_FORMATS.DAILY,
      dropOffLabelFormat: CHART_LABEL_FORMATS.DAILY,
    }
  }, [nowValue, period])

export { useSecurityRanges }
