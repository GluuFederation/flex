import {
  aggregateIpFailures,
  buildAnomalySummary,
  buildDeviceTrend,
  buildDropOffSeries,
  buildErrorCategorySlices,
  buildFailureSpikeSeries,
  buildVelocityMatrix,
  countByThreatLevel,
  countSpikes,
  filterSuspiciousIps,
  findDropOffPeak,
  findPeakSpike,
  percentDelta,
  pointDelta,
  sliceEntriesByRange,
  spikeRatio,
  successRateOf,
  sumAggregation,
  takeTopIpsByFailure,
} from 'Plugins/fido/components/SecurityMonitor/utils'
import {
  ANOMALY_KINDS,
  ATTACK_PATTERNS,
  THREAT_LEVELS,
} from 'Plugins/fido/components/SecurityMonitor/constants'
import { createDate } from '@/utils/dayjsUtils'
import type { AggregationEntry, MetricsEntry } from 'Plugins/fido/components/Metrics/types'

const t = (key: string, options?: Record<string, string | number>) =>
  options ? `${key}:${Object.values(options).join('|')}` : key

const hourly = (startTime: string, failures: number): AggregationEntry => ({
  startTime,
  authenticationFailures: failures,
})

const authEntry = (overrides: Partial<MetricsEntry>): MetricsEntry => ({
  operationType: 'AUTHENTICATION',
  status: 'FAILURE',
  ...overrides,
})

describe('SecurityMonitor utils', () => {
  describe('buildFailureSpikeSeries', () => {
    it('averages the same hour over the preceding days as the baseline', () => {
      const series = buildFailureSpikeSeries([
        hourly('2024-01-01T10:00:00Z', 10),
        hourly('2024-01-02T10:00:00Z', 20),
        hourly('2024-01-03T10:00:00Z', 60),
      ])

      expect(series.map((point) => point.baseline)).toEqual([0, 10, 15])
      expect(series[2]!.isSpike).toBe(true)
      expect(series[0]!.isSpike).toBe(false)
    })

    it('keeps the baseline history but only returns points from the requested start', () => {
      const series = buildFailureSpikeSeries(
        [hourly('2024-01-01T10:00:00Z', 10), hourly('2024-01-02T10:00:00Z', 40)],
        createDate('2024-01-02T00:00:00Z'),
      )

      expect(series).toHaveLength(1)
      expect(series[0]!.baseline).toBe(10)
      expect(series[0]!.isSpike).toBe(true)
    })

    it('labels points by hour of day', () => {
      const series = buildFailureSpikeSeries([hourly('2024-01-01T07:00:00', 3)])

      expect(series[0]!.label).toBe('07')
    })

    it('ignores entries without a parseable start time', () => {
      expect(buildFailureSpikeSeries([{ authenticationFailures: 5 }])).toEqual([])
    })
  })

  describe('findPeakSpike and spikeRatio', () => {
    it('returns the largest spike and its ratio over the baseline', () => {
      const series = buildFailureSpikeSeries([
        hourly('2024-01-01T10:00:00Z', 10),
        hourly('2024-01-02T10:00:00Z', 30),
        hourly('2024-01-01T11:00:00Z', 5),
        hourly('2024-01-02T11:00:00Z', 40),
      ])

      const peak = findPeakSpike(series)
      expect(peak?.failures).toBe(40)
      expect(spikeRatio(peak!)).toBe(8)
    })

    it('returns null when nothing spikes', () => {
      expect(findPeakSpike([])).toBeNull()
    })
  })

  describe('aggregateIpFailures', () => {
    it('groups by IP and counts failures, successes and targeted users', () => {
      const stats = aggregateIpFailures([
        authEntry({ ipAddress: '10.0.0.1', userId: 'alice', timestamp: '2024-01-01T10:00:00Z' }),
        authEntry({ ipAddress: '10.0.0.1', userId: 'alice', timestamp: '2024-01-01T10:05:00Z' }),
        authEntry({
          ipAddress: '10.0.0.1',
          userId: 'bob',
          status: 'SUCCESS',
          timestamp: '2024-01-01T10:10:00Z',
        }),
        authEntry({ ipAddress: '10.0.0.2', userId: 'carol' }),
      ])

      expect(stats).toHaveLength(2)
      expect(stats[0]).toMatchObject({
        ipAddress: '10.0.0.1',
        failures: 2,
        successes: 1,
        attempts: 3,
        targetedUsers: 2,
      })
      expect(stats[0]!.failureRate).toBeCloseTo(66.67, 1)
    })

    it('skips entries without an IP address', () => {
      expect(aggregateIpFailures([authEntry({ userId: 'alice' })])).toEqual([])
    })

    it('marks a high-volume single-user attacker as a critical brute force', () => {
      const stats = aggregateIpFailures(
        Array.from({ length: 25 }, () => authEntry({ ipAddress: '10.0.0.9', userId: 'alice' })),
      )

      expect(stats[0]!.pattern).toBe(ATTACK_PATTERNS.BRUTE_FORCE)
      expect(stats[0]!.threatLevel).toBe(THREAT_LEVELS.CRITICAL)
    })

    it('marks many failed users from one IP as password spraying', () => {
      const stats = aggregateIpFailures(
        ['alice', 'bob', 'carol', 'dave'].map((userId) =>
          authEntry({ ipAddress: '10.0.0.8', userId }),
        ),
      )

      expect(stats[0]!.pattern).toBe(ATTACK_PATTERNS.PASSWORD_SPRAYING)
    })

    it('marks mixed success and failure across users as credential stuffing', () => {
      const stats = aggregateIpFailures([
        authEntry({ ipAddress: '10.0.0.7', userId: 'alice' }),
        authEntry({ ipAddress: '10.0.0.7', userId: 'bob' }),
        authEntry({ ipAddress: '10.0.0.7', userId: 'carol', status: 'SUCCESS' }),
      ])

      expect(stats[0]!.pattern).toBe(ATTACK_PATTERNS.CREDENTIAL_STUFFING)
    })
  })

  describe('takeTopIpsByFailure, filterSuspiciousIps and countByThreatLevel', () => {
    it('drops IPs without failures and honours the limit', () => {
      const stats = aggregateIpFailures([
        authEntry({ ipAddress: '10.0.0.1' }),
        authEntry({ ipAddress: '10.0.0.2', status: 'SUCCESS' }),
      ])

      expect(takeTopIpsByFailure(stats, 5).map((stat) => stat.ipAddress)).toEqual(['10.0.0.1'])
    })

    it('keeps only IPs above the suspicion thresholds and counts critical ones', () => {
      const stats = aggregateIpFailures([
        ...Array.from({ length: 25 }, () => authEntry({ ipAddress: '10.0.0.1', userId: 'alice' })),
        authEntry({ ipAddress: '10.0.0.2', userId: 'bob' }),
      ])

      const suspicious = filterSuspiciousIps(stats)
      expect(suspicious.map((stat) => stat.ipAddress)).toEqual(['10.0.0.1'])
      expect(countByThreatLevel(suspicious, THREAT_LEVELS.CRITICAL)).toBe(1)
    })
  })

  describe('buildDropOffSeries', () => {
    it('derives success, failure and drop-off percentages labelled by weekday', () => {
      const series = buildDropOffSeries([
        {
          startTime: '2024-01-01T10:00:00',
          authenticationAttempts: 10,
          authenticationSuccesses: 6,
          authenticationFailures: 2,
        },
      ])

      expect(series[0]).toEqual({
        label: 'Mon',
        successRate: 60,
        failureRate: 20,
        dropOffRate: 20,
      })
    })

    it('returns zeroes when there are no attempts', () => {
      const series = buildDropOffSeries([
        { startTime: '2024-01-01T10:00:00Z', authenticationAttempts: 0 },
      ])

      expect(series[0]!.successRate).toBe(0)
      expect(series[0]!.dropOffRate).toBe(0)
    })

    it('finds the worst drop-off point', () => {
      const peak = findDropOffPeak([
        { label: 'Mon', successRate: 90, failureRate: 5, dropOffRate: 5 },
        { label: 'Fri', successRate: 50, failureRate: 20, dropOffRate: 30 },
      ])

      expect(peak?.label).toBe('Fri')
    })
  })

  describe('buildErrorCategorySlices', () => {
    it('sorts categories by count and computes the share', () => {
      const slices = buildErrorCategorySlices(
        {
          errorCategories: { INVALID_CREDENTIAL: 30, USER_CANCELLED: 10, TIMEOUT: 0 },
        },
        ['#111111', '#222222'],
      )

      expect(slices.map((slice) => slice.category)).toEqual([
        'INVALID_CREDENTIAL',
        'USER_CANCELLED',
      ])
      expect(slices[0]!.share).toBe(75)
    })

    it('returns an empty list when the payload has no counts', () => {
      expect(buildErrorCategorySlices(undefined, ['#111111'])).toEqual([])
      expect(buildErrorCategorySlices({ successRate: 90 }, ['#111111'])).toEqual([])
    })
  })

  describe('buildVelocityMatrix', () => {
    it('buckets attempts into six four-hour windows per user', () => {
      const matrix = buildVelocityMatrix(
        [
          authEntry({ username: 'alice', timestamp: '2024-01-01T10:00:00' }),
          authEntry({ username: 'alice', timestamp: '2024-01-01T11:30:00' }),
          authEntry({ username: 'bob', timestamp: '2024-01-01T17:00:00' }),
        ],
        t,
      )

      expect(matrix.cols).toEqual(['00-04', '04-08', '08-12', '12-16', '16-20', '20-24'])
      expect(matrix.rows).toEqual(['alice', 'bob'])
      expect(matrix.cells[0]![2]!.value).toBe(2)
      expect(matrix.cells[1]![4]!.value).toBe(1)
      expect(matrix.anomalousUsers).toBe(0)
    })

    it('flags a bucket far above the user average as anomalous', () => {
      const entries = [
        authEntry({ username: 'mallory', timestamp: '2024-01-01T01:00:00' }),
        ...Array.from({ length: 40 }, () =>
          authEntry({ username: 'mallory', timestamp: '2024-01-01T17:00:00' }),
        ),
      ]

      const matrix = buildVelocityMatrix(entries, t)

      expect(matrix.cells[0]![4]!.isAnomalous).toBe(true)
      expect(matrix.cells[0]![0]!.isAnomalous).toBe(false)
      expect(matrix.anomalousUsers).toBe(1)
    })

    it('falls back to a placeholder row when there is no data', () => {
      const matrix = buildVelocityMatrix([], t)

      expect(matrix.rows).toEqual(['fields.no_data'])
      expect(matrix.cells[0]!.every((cell) => cell.value === 0)).toBe(true)
    })
  })

  describe('buildDeviceTrend', () => {
    it('derives the platform share per day and reports the crossover day', () => {
      const trend = buildDeviceTrend([
        { startTime: '2024-01-01T00:00:00', deviceTypes: { 'platform': 9, 'cross-platform': 1 } },
        { startTime: '2024-01-02T00:00:00', deviceTypes: { 'platform': 2, 'cross-platform': 8 } },
      ])

      expect(trend.points).toHaveLength(2)
      expect(trend.points[0]).toMatchObject({ platform: 90, crossPlatform: 10 })
      expect(trend.points[1]).toMatchObject({ platform: 20, crossPlatform: 80 })
      expect(trend.shiftDayLabel).toBe('Jan-02')
    })

    it('skips days without device counts and reports no shift', () => {
      const trend = buildDeviceTrend([
        { startTime: '2024-01-01T00:00:00', deviceTypes: {} },
        { startTime: '2024-01-02T00:00:00' },
      ])

      expect(trend.points).toEqual([])
      expect(trend.shiftDayLabel).toBeNull()
    })
  })

  describe('period helpers', () => {
    it('totals authentication counters and derives the success rate', () => {
      const totals = sumAggregation([
        { authenticationAttempts: 10, authenticationSuccesses: 8, authenticationFailures: 2 },
        { authenticationAttempts: 10, authenticationSuccesses: 7, authenticationFailures: 3 },
      ])

      expect(totals).toEqual({ attempts: 20, successes: 15, failures: 5 })
      expect(successRateOf(totals)).toBe(75)
      expect(successRateOf({ attempts: 0, successes: 0 })).toBe(0)
    })

    it('slices aggregation entries by range', () => {
      const entries: AggregationEntry[] = [
        { startTime: '2024-01-01T00:00:00Z', authenticationAttempts: 1 },
        { startTime: '2024-01-05T00:00:00Z', authenticationAttempts: 2 },
        { authenticationAttempts: 3 },
      ]

      const sliced = sliceEntriesByRange(
        entries,
        createDate('2024-01-04T00:00:00Z'),
        createDate('2024-01-06T00:00:00Z'),
      )

      expect(sliced).toHaveLength(1)
      expect(sliced[0]!.authenticationAttempts).toBe(2)
    })

    it('computes percentage and point deltas', () => {
      expect(percentDelta(120, 100)).toEqual({ value: 20, isIncrease: true })
      expect(percentDelta(80, 100)).toEqual({ value: 20, isIncrease: false })
      expect(percentDelta(5, 0)).toEqual({ value: 100, isIncrease: true })
      expect(percentDelta(0, 0)).toEqual({ value: 0, isIncrease: false })
      expect(pointDelta(87, 94)).toEqual({ value: 7, isIncrease: false })
    })

    it('counts spikes across aggregation entries', () => {
      expect(
        countSpikes([hourly('2024-01-01T10:00:00Z', 10), hourly('2024-01-02T10:00:00Z', 30)]),
      ).toBe(1)
    })
  })

  describe('buildAnomalySummary', () => {
    it('reports a chip per detected anomaly', () => {
      const spikes = buildFailureSpikeSeries([
        hourly('2024-01-01T14:00:00', 10),
        hourly('2024-01-02T14:00:00', 80),
      ])
      const suspicious = filterSuspiciousIps(
        aggregateIpFailures(
          Array.from({ length: 25 }, () => authEntry({ ipAddress: '10.0.0.1', userId: 'alice' })),
        ),
      )
      const dropOff = [{ label: 'Fri', successRate: 50, failureRate: 20, dropOffRate: 30 }]

      const summary = buildAnomalySummary(spikes, suspicious, dropOff, t)

      expect(summary.count).toBe(3)
      expect(summary.chips.map((chip) => chip.kind)).toEqual([
        ANOMALY_KINDS.AUTH_SPIKE,
        ANOMALY_KINDS.IPS_FLAGGED,
        ANOMALY_KINDS.DROP_OFF,
      ])
    })

    it('counts a drop-off anomaly when there is no spike', () => {
      const summary = buildAnomalySummary(
        [],
        [],
        [{ label: 'Fri', successRate: 50, failureRate: 20, dropOffRate: 27 }],
        t,
      )

      expect(summary.count).toBe(1)
      expect(summary.chips.map((chip) => chip.kind)).toEqual([ANOMALY_KINDS.DROP_OFF])
    })

    it('reports nothing when there are no anomalies', () => {
      const summary = buildAnomalySummary([], [], [], t)

      expect(summary).toEqual({ count: 0, chips: [] })
    })
  })
})
