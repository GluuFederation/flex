import {
  abandonedOf,
  buildFailureSpikeSeries,
  countSpikesInRange,
  mergeTodayFromHourly,
  sumAggregation,
  totalFailuresOf,
} from 'Plugins/fido/components/SecurityMonitor/utils'
import { createDate } from '@/utils/dayjsUtils'
import type { AggregationEntry } from 'Plugins/fido/components/Metrics/types'

const entry = (iso: string, failures: number): AggregationEntry => ({
  startTime: iso,
  authenticationFailures: failures,
  authenticationAttempts: failures + 10,
  authenticationSuccesses: 10,
})

const todayStart = createDate().startOf('day')
const todayEnd = createDate().endOf('day')

describe('countSpikesInRange', () => {
  const spikeHour = todayStart.add(10, 'hour')
  const withBaseline = [
    ...Array.from({ length: 7 }, (_, i) =>
      entry(spikeHour.subtract(7 - i, 'day').toISOString(), 2),
    ),
    entry(spikeHour.toISOString(), 500),
  ]

  it('counts a spike whose baseline lies outside the reported window', () => {
    expect(countSpikesInRange(withBaseline, todayStart, todayEnd)).toBe(1)
  })

  it('agrees with the chart series for the same window', () => {
    const chartSpikes = buildFailureSpikeSeries(withBaseline, todayStart).filter((p) => p.isSpike)
    expect(countSpikesInRange(withBaseline, todayStart, todayEnd)).toBe(chartSpikes.length)
  })

  it('counts every spiking bucket in the window', () => {
    const entries = [
      ...Array.from({ length: 7 }, (_, day) =>
        Array.from({ length: 24 }, (_, hour) =>
          entry(
            todayStart
              .subtract(7 - day, 'day')
              .add(hour, 'hour')
              .toISOString(),
            1,
          ),
        ),
      ).flat(),
      ...Array.from({ length: 24 }, (_, hour) =>
        entry(todayStart.add(hour, 'hour').toISOString(), 900),
      ),
    ]
    expect(countSpikesInRange(entries, todayStart, todayEnd)).toBe(24)
  })

  it('excludes spikes outside the window', () => {
    const yesterdayHour = todayStart.subtract(1, 'day').add(10, 'hour')
    const entries = [
      ...Array.from({ length: 7 }, (_, i) =>
        entry(yesterdayHour.subtract(7 - i, 'day').toISOString(), 2),
      ),
      entry(yesterdayHour.toISOString(), 400),
    ]
    expect(countSpikesInRange(entries, todayStart, todayEnd)).toBe(0)
    expect(
      countSpikesInRange(
        entries,
        todayStart.subtract(1, 'day'),
        todayStart.subtract(1, 'millisecond'),
      ),
    ).toBe(1)
  })

  it('returns 0 when there is no spike', () => {
    const flat = Array.from({ length: 8 }, (_, i) =>
      entry(spikeHour.subtract(7 - i, 'day').toISOString(), 5),
    )
    expect(countSpikesInRange(flat, todayStart, todayEnd)).toBe(0)
  })

  it('handles empty input', () => {
    expect(countSpikesInRange([], todayStart, todayEnd)).toBe(0)
  })
})

describe('two-hour banner window vs period tile window', () => {
  const hour = (offset: number, failures: number) =>
    entry(todayStart.add(offset, 'hour').toISOString(), failures)

  it('separates a spike inside the last two hours from one earlier today', () => {
    const recentStart = todayStart.add(20, 'hour')
    const entries = [
      ...Array.from({ length: 7 }, (_, d) =>
        [3, 21].map((h) =>
          entry(
            todayStart
              .subtract(7 - d, 'day')
              .add(h, 'hour')
              .toISOString(),
            1,
          ),
        ),
      ).flat(),
      hour(3, 200),
      hour(21, 200),
    ]

    expect(countSpikesInRange(entries, todayStart, todayEnd)).toBe(2)
    expect(countSpikesInRange(entries, recentStart, todayEnd)).toBe(1)
  })

  it('reports zero for the recent window when the only spike is older', () => {
    const entries = [
      ...Array.from({ length: 7 }, (_, d) =>
        entry(
          todayStart
            .subtract(7 - d, 'day')
            .add(2, 'hour')
            .toISOString(),
          1,
        ),
      ),
      hour(2, 500),
    ]

    expect(countSpikesInRange(entries, todayStart, todayEnd)).toBe(1)
    expect(countSpikesInRange(entries, todayStart.add(20, 'hour'), todayEnd)).toBe(0)
  })
})

describe('auth failure totals', () => {
  it('counts abandoned attempts alongside explicit failures', () => {
    // 100 attempts, 60 succeeded, 10 failed outright -> 30 abandoned
    const totals = { attempts: 100, successes: 60, failures: 10 }

    expect(abandonedOf(totals)).toBe(30)
    expect(totalFailuresOf(totals)).toBe(40)
  })

  it('reports abandoned attempts even when nothing failed outright', () => {
    const totals = { attempts: 12, successes: 5, failures: 0 }

    expect(abandonedOf(totals)).toBe(7)
    expect(totalFailuresOf(totals)).toBe(7)
  })

  it('never returns a negative abandoned count', () => {
    const totals = { attempts: 5, successes: 4, failures: 4 }

    expect(abandonedOf(totals)).toBe(0)
    expect(totalFailuresOf(totals)).toBe(4)
  })

  it('is zero when every attempt succeeded', () => {
    const totals = { attempts: 9, successes: 9, failures: 0 }

    expect(abandonedOf(totals)).toBe(0)
    expect(totalFailuresOf(totals)).toBe(0)
  })

  it('handles an empty period', () => {
    const totals = { attempts: 0, successes: 0, failures: 0 }

    expect(totalFailuresOf(totals)).toBe(0)
  })
})

describe('buildFailureSpikeSeries abandoned handling', () => {
  it('counts abandoned attempts alongside explicit failures', () => {
    const hour = todayStart.add(3, 'hour')
    const series = buildFailureSpikeSeries(
      [
        {
          startTime: hour.toISOString(),
          authenticationAttempts: 100,
          authenticationSuccesses: 60,
          authenticationFailures: 10,
        },
      ],
      todayStart,
    )

    expect(series[0].failures).toBe(40)
  })

  it('reports abandoned-only buckets instead of leaving them empty', () => {
    const hour = todayStart.add(4, 'hour')
    const series = buildFailureSpikeSeries(
      [
        {
          startTime: hour.toISOString(),
          authenticationAttempts: 25,
          authenticationSuccesses: 5,
          authenticationFailures: 0,
        },
      ],
      todayStart,
    )

    expect(series[0].failures).toBe(20)
  })
})

describe('abandoned operations from the aggregation payload', () => {
  const hour = todayStart.add(10, 'hour')

  it('prefers the reported counter over the attempts residual', () => {
    const series = buildFailureSpikeSeries(
      [
        {
          startTime: hour.toISOString(),
          authenticationAttempts: 13,
          authenticationSuccesses: 2,
          authenticationFailures: 0,
          metricsData: { abandonedOperations: 4 },
        },
      ],
      todayStart,
    )

    expect(series[0].failures).toBe(4)
  })

  it('falls back to the residual when the counter is absent', () => {
    const series = buildFailureSpikeSeries(
      [
        {
          startTime: hour.toISOString(),
          authenticationAttempts: 13,
          authenticationSuccesses: 2,
          authenticationFailures: 0,
        },
      ],
      todayStart,
    )

    expect(series[0].failures).toBe(11)
  })

  it('flags a bucket with no history once it clears the absolute floor', () => {
    const entries = [
      {
        startTime: hour.toISOString(),
        authenticationAttempts: 13,
        authenticationSuccesses: 2,
        authenticationFailures: 0,
        metricsData: { abandonedOperations: 4 },
      },
    ]

    expect(countSpikesInRange(entries, todayStart, todayEnd)).toBe(1)
  })

  it('leaves a quiet bucket below the floor alone', () => {
    const entries = [
      {
        startTime: todayStart.add(19, 'hour').toISOString(),
        authenticationAttempts: 3,
        authenticationSuccesses: 1,
        authenticationFailures: 0,
        metricsData: { abandonedOperations: 2 },
      },
    ]

    expect(countSpikesInRange(entries, todayStart, todayEnd)).toBe(0)
  })
})

describe('today folded from hourly buckets', () => {
  it('keeps the reported abandoned counter instead of reverting to the residual', () => {
    const hourly = [
      {
        startTime: todayStart.add(7, 'hour').toISOString(),
        authenticationAttempts: 2,
        authenticationSuccesses: 1,
        authenticationFailures: 0,
        metricsData: { abandonedOperations: 0 },
      },
      {
        startTime: todayStart.add(10, 'hour').toISOString(),
        authenticationAttempts: 13,
        authenticationSuccesses: 2,
        authenticationFailures: 0,
        metricsData: { abandonedOperations: 2 },
      },
    ]

    const merged = mergeTodayFromHourly([], hourly, todayStart, todayEnd)
    const totals = sumAggregation(merged)

    // 15 attempts and 3 successes would infer 12 abandoned; the API reported 2.
    expect(abandonedOf(totals)).toBe(2)
    expect(totalFailuresOf(totals)).toBe(2)
  })
})

describe('attempts line', () => {
  it('carries attempts alongside failures for the comparison line', () => {
    const series = buildFailureSpikeSeries(
      [
        {
          startTime: todayStart.add(7, 'hour').toISOString(),
          authenticationAttempts: 13,
          authenticationSuccesses: 2,
          authenticationFailures: 0,
          metricsData: { abandonedOperations: 2 },
        },
      ],
      todayStart,
    )

    expect(series[0].attempts).toBe(13)
    expect(series[0].failures).toBe(2)
  })
})
