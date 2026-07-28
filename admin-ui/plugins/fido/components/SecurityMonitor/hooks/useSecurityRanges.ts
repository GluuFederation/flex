import { useMemo } from 'react'
import { createDate } from '@/utils/dayjsUtils'
import {
  BASELINE_WINDOW_DAYS,
  CHART_LABEL_FORMATS,
  DEVICE_TREND_DAYS,
  IP_WINDOW_HOURS,
  KPI_PERIODS,
} from '../constants'
import type { KpiPeriod, SecurityRanges } from '../types'

const MONTHS_IN_YEAR = 12

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
    const ipWindow = { startDate: now.subtract(IP_WINDOW_HOURS, 'hour'), endDate: now }

    const isToday = period === KPI_PERIODS.TODAY
    const primary = period === KPI_PERIODS.THIS_MONTH ? thisMonth : isToday ? today : lastSevenDays

    return {
      hourlyWithBaseline: {
        startDate: startOfToday.subtract(BASELINE_WINDOW_DAYS, 'day'),
        endDate: endOfToday,
      },
      today,
      lastSevenDays,
      deviceTrend: isToday ? deviceTrend : primary,
      monthWithPrevious: {
        startDate: now.subtract(1, 'month').startOf('month'),
        endDate: endOfToday,
      },
      lastTwelveMonths: {
        startDate: now.subtract(MONTHS_IN_YEAR, 'month').startOf('month'),
        endDate: endOfToday,
      },
      ipWindow: isToday ? ipWindow : primary,
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
