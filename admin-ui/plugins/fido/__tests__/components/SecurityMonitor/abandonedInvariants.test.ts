import {
  buildDropOffSeries,
  buildFailureSpikeSeries,
  mergeTodayFromHourly,
  padAggregationEntries,
  sumAggregation,
  abandonedOf,
  totalFailuresOf,
} from 'Plugins/fido/components/SecurityMonitor/utils'
import { createDate } from '@/utils/dayjsUtils'
import type { AggregationEntry } from 'Plugins/fido/components/Metrics/types'

const todayStart = createDate().startOf('day')
const todayEnd = createDate().endOf('day')

const hourly = (hour: number, attempts: number, successes: number, abandoned: number) => ({
  startTime: todayStart.add(hour, 'hour').toISOString(),
  authenticationAttempts: attempts,
  authenticationSuccesses: successes,
  authenticationFailures: 0,
  metricsData: { abandonedOperations: abandoned },
})

// Attempts far exceed successes, so the residual would report 22 where the API reports 3.
const HOURS = [hourly(7, 2, 1, 0), hourly(10, 13, 2, 2), hourly(14, 12, 2, 1)]
const REPORTED_ABANDONED = 3
const RESIDUAL_ABANDONED = 22

const abandonedOfEntry = (entry: AggregationEntry) => abandonedOf(sumAggregation([entry]))

describe('abandoned counter survives every rebuild stage', () => {
  it('sums straight from the payload', () => {
    expect(abandonedOf(sumAggregation(HOURS))).toBe(REPORTED_ABANDONED)
    expect(abandonedOf(sumAggregation(HOURS))).not.toBe(RESIDUAL_ABANDONED)
  })

  it('survives the today fold', () => {
    const merged = mergeTodayFromHourly([], HOURS, todayStart, todayEnd)
    const folded = merged[merged.length - 1]!

    expect(folded.abandonedOperations).toBe(REPORTED_ABANDONED)
    expect(abandonedOfEntry(folded)).toBe(REPORTED_ABANDONED)
  })

  it('survives range padding', () => {
    const padded = padAggregationEntries(HOURS, todayStart, todayEnd, 'hour')

    expect(abandonedOf(sumAggregation(padded))).toBe(REPORTED_ABANDONED)
    padded.forEach((entry) => {
      expect(entry.abandonedOperations ?? entry.metricsData?.abandonedOperations).toBeDefined()
    })
  })

  it('feeds the same number to the failure spike chart', () => {
    const total = buildFailureSpikeSeries(HOURS, todayStart).reduce((sum, p) => sum + p.failures, 0)

    expect(total).toBe(REPORTED_ABANDONED)
  })

  it('feeds the same number to the drop-off chart', () => {
    const merged = mergeTodayFromHourly([], HOURS, todayStart, todayEnd)
    const [point] = buildDropOffSeries(merged)

    // 5 successes and 3 abandoned = 8 outcomes, so 37.5% dropped off.
    expect(point!.dropOffRate).toBe(37.5)
  })

  it('keeps the KPI tile equal to failures plus abandoned', () => {
    const totals = sumAggregation(HOURS)

    expect(totalFailuresOf(totals)).toBe(totals.failures + REPORTED_ABANDONED)
  })
})
