import { useMemo } from 'react'
import { createDate } from '@/utils/dayjsUtils'
import { BASELINE_WINDOW_DAYS, DEVICE_TREND_DAYS, IP_WINDOW_HOURS } from '../constants'
import type { SecurityRanges } from '../types'

const MONTHS_IN_YEAR = 12

const useSecurityRanges = (nowValue: number): SecurityRanges =>
  useMemo(() => {
    const now = createDate(nowValue).millisecond(0)
    const startOfToday = now.startOf('day')
    const endOfToday = now.endOf('day').millisecond(0)

    return {
      hourlyWithBaseline: {
        startDate: startOfToday.subtract(BASELINE_WINDOW_DAYS, 'day'),
        endDate: endOfToday,
      },
      today: { startDate: startOfToday, endDate: endOfToday },
      lastSevenDays: {
        startDate: startOfToday.subtract(BASELINE_WINDOW_DAYS - 1, 'day'),
        endDate: endOfToday,
      },
      deviceTrend: {
        startDate: startOfToday.subtract(DEVICE_TREND_DAYS - 1, 'day'),
        endDate: endOfToday,
      },
      monthWithPrevious: {
        startDate: now.subtract(1, 'month').startOf('month'),
        endDate: endOfToday,
      },
      lastTwelveMonths: {
        startDate: now.subtract(MONTHS_IN_YEAR, 'month').startOf('month'),
        endDate: endOfToday,
      },
      ipWindow: { startDate: now.subtract(IP_WINDOW_HOURS, 'hour'), endDate: now },
    }
  }, [nowValue])

export { useSecurityRanges }
