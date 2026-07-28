import {
  aggregateIpFailures,
  buildAnomalySummary,
  buildCountAxis,
  buildDeviceScaffold,
  buildDeviceTrend,
  buildSecurityExportRows,
  buildDropOffScaffold,
  buildDropOffSeries,
  buildErrorCategorySlices,
  buildFailureSpikeSeries,
  buildHourScaffold,
  buildIpScaffold,
  buildVelocityScaffoldRows,
  buildVelocityMatrix,
  countByThreatLevel,
  countSequenceSpikes,
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
import type {
  SecurityDashboardData,
  SecurityTranslate,
} from 'Plugins/fido/components/SecurityMonitor/types'
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
    it('derives success, failure and drop-off percentages labelled by date', () => {
      const series = buildDropOffSeries([
        {
          startTime: '2024-01-01T10:00:00',
          authenticationAttempts: 10,
          authenticationSuccesses: 6,
          authenticationFailures: 2,
        },
      ])

      expect(series[0]).toEqual({
        label: 'Jan-01',
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
        { label: 'Jan-01', successRate: 90, failureRate: 5, dropOffRate: 5 },
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
      const matrix = buildVelocityMatrix([
        authEntry({ username: 'alice', timestamp: '2024-01-01T10:00:00' }),
        authEntry({ username: 'alice', timestamp: '2024-01-01T11:30:00' }),
        authEntry({ username: 'bob', timestamp: '2024-01-01T17:00:00' }),
      ])

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

      const matrix = buildVelocityMatrix(entries)

      expect(matrix.cells[0]![4]!.isAnomalous).toBe(true)
      expect(matrix.cells[0]![0]!.isAnomalous).toBe(false)
      expect(matrix.anomalousUsers).toBe(1)
    })

    it('returns no rows when there is no data', () => {
      const matrix = buildVelocityMatrix([])

      expect(matrix.rows).toEqual([])
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

    it('counts sequence spikes where buckets have no same-hour history', () => {
      const monthly = [
        hourly('2024-01-01T00:00:00Z', 10),
        hourly('2024-02-01T00:00:00Z', 12),
        hourly('2024-03-01T00:00:00Z', 40),
      ]
      expect(countSpikes(monthly)).toBe(0)
      expect(countSequenceSpikes(monthly)).toBe(1)
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

  describe('chart scaffolds', () => {
    it('builds a full 24 hour axis with zeroed values', () => {
      const scaffold = buildHourScaffold()

      expect(scaffold).toHaveLength(24)
      expect(scaffold[0]?.label).toBe('00')
      expect(scaffold[23]?.label).toBe('23')
      expect(scaffold.every((point) => point.failures === 0 && point.baseline === 0)).toBe(true)
    })

    it('builds day axes ending on the base date', () => {
      const base = new Date('2026-07-28T10:00:00Z').getTime()

      expect(buildDropOffScaffold(base)).toHaveLength(7)
      expect(buildDeviceScaffold(base)).toHaveLength(14)
      expect(buildDeviceScaffold(base).at(-1)?.label).toBe('Jul-28')
    })

    it('builds unique blank rows for category axes', () => {
      const bars = buildIpScaffold()
      const rows = buildVelocityScaffoldRows()

      expect(bars).toHaveLength(5)
      expect(new Set(bars.map((bar) => bar.ipAddress)).size).toBe(bars.length)
      expect(bars.every((bar) => bar.failures === 0)).toBe(true)
      expect(new Set(rows).size).toBe(rows.length)
    })
  })

  describe('buildCountAxis', () => {
    it('keeps tick gaps uniform for any maximum', () => {
      const cases = [0, 1, 7, 19, 143]

      cases.forEach((max) => {
        const axis = buildCountAxis(max)
        const gaps = axis.ticks.slice(1).map((tick, index) => tick - axis.ticks[index]!)

        expect(new Set(gaps).size).toBe(1)
        expect(axis.ticks[0]).toBe(0)
        expect(axis.domain).toEqual([0, axis.ticks.at(-1)])
        expect(axis.domain[1]).toBeGreaterThanOrEqual(max)
        expect(axis.ticks.every(Number.isInteger)).toBe(true)
      })
    })

    it('falls back to a readable range when there is no data', () => {
      expect(buildCountAxis(0).ticks).toEqual([0, 2, 4, 6, 8, 10])
    })
  })

  describe('buildVelocityMatrix anomaly rule', () => {
    const attempt = (username: string, hour: number): MetricsEntry => ({
      username,
      timestamp: `2024-01-01T${String(hour).padStart(2, '0')}:10:00`,
      status: 'SUCCESS',
    })

    const burst = (username: string, hour: number, times: number): MetricsEntry[] =>
      Array.from({ length: times }, () => attempt(username, hour))

    it('flags a block that sits above the user own mean plus two deviations', () => {
      const entries = [
        ...burst('a.morgan', 1, 4),
        ...burst('a.morgan', 5, 5),
        ...burst('a.morgan', 9, 4),
        ...burst('a.morgan', 13, 30),
      ]

      const matrix = buildVelocityMatrix(entries, 8, 10)

      expect(matrix.cells[0]![3]!.isAnomalous).toBe(true)
      expect(matrix.cells[0]![1]!.isAnomalous).toBe(false)
      expect(matrix.anomalousUsers).toBe(1)
    })

    it('keeps an erratic user unflagged because their own spread is already wide', () => {
      const entries = [
        ...burst('b.chen', 1, 2),
        ...burst('b.chen', 5, 30),
        ...burst('b.chen', 9, 1),
        ...burst('b.chen', 13, 25),
        ...burst('b.chen', 17, 28),
      ]

      const matrix = buildVelocityMatrix(entries, 8, 10)

      expect(matrix.cells[0]!.some((cell) => cell.isAnomalous)).toBe(false)
    })

    it('respects a raised floor so a wide window does not flag ordinary traffic', () => {
      const entries = [...burst('c.ruiz', 1, 1), ...burst('c.ruiz', 13, 30)]

      expect(buildVelocityMatrix(entries, 8, 20).cells[0]![3]!.isAnomalous).toBe(true)
      expect(buildVelocityMatrix(entries, 8, 600).cells[0]![3]!.isAnomalous).toBe(false)
    })
  })

  describe('buildDropOffSeries labels', () => {
    const daily = (startTime: string): AggregationEntry => ({
      startTime,
      authenticationAttempts: 100,
      authenticationSuccesses: 80,
      authenticationFailures: 15,
    })

    it('labels every point with a calendar date so days never collide', () => {
      const series = buildDropOffSeries([
        daily('2024-01-01T00:00:00'),
        daily('2024-01-08T00:00:00'),
      ])

      expect(series.map((point) => point.label)).toEqual(['Jan-01', 'Jan-08'])
    })

    it('accepts an explicit format override', () => {
      expect(buildDropOffSeries([daily('2024-01-01T00:00:00')], 'ddd')[0]?.label).toBe('Mon')
    })
  })

  describe('buildSecurityExportRows', () => {
    const translate = ((key: string) => key) as SecurityTranslate

    const emptyData = {
      anomalies: { count: 0, chips: [] },
      summary: {
        failures: { today: 12, last_7_days: 0, this_month: 0 },
        attempts: { today: 100, last_7_days: 0, this_month: 0 },
        successRate: { today: 88, last_7_days: 0, this_month: 0 },
        failureDelta: {
          today: { value: 0, isIncrease: false },
          last_7_days: { value: 0, isIncrease: false },
          this_month: { value: 0, isIncrease: false },
        },
        successRateDelta: {
          today: { value: 0, isIncrease: false },
          last_7_days: { value: 0, isIncrease: false },
          this_month: { value: 0, isIncrease: false },
        },
        anomalies: { hourly: 3, daily: 0, monthly: 0 },
        anomaliesDelta: {
          hourly: { value: 0, isIncrease: false },
          daily: { value: 0, isIncrease: false },
          monthly: { value: 0, isIncrease: false },
        },
      },
      spikeSeries: [],
      dropOffSeries: [],
      ipStats: [],
      suspiciousIps: [],
      errorSlices: [],
      velocityMatrix: { rows: [], cols: [], cells: [], anomalousUsers: 0 },
      deviceTrend: { points: [], shiftDayLabel: null },
      userIds: [],
      isLoading: false,
      isFetching: false,
    } as SecurityDashboardData

    it('skips zero-value velocity cells so the file carries only real activity', () => {
      const data: SecurityDashboardData = {
        ...emptyData,
        velocityMatrix: {
          rows: ['a.morgan'],
          cols: ['00-04', '04-08'],
          cells: [
            [
              { value: 0, isAnomalous: false },
              { value: 6, isAnomalous: false },
            ],
          ],
          anomalousUsers: 0,
        },
      }

      const velocityRows = buildSecurityExportRows(data, translate, 'today', 'hourly').filter(
        (row) => row[0] === 'titles.velocity_watch',
      )

      expect(velocityRows).toEqual([
        [
          'titles.velocity_watch',
          'a.morgan 04-08',
          'fields.authentication_attempts',
          6,
          'fields.unit_count',
        ],
      ])
    })

    it('returns nothing when no chart series carry data', () => {
      expect(buildSecurityExportRows(emptyData, translate, 'today', 'hourly')).toEqual([])
    })

    it('prefixes the KPI summary before every chart series', () => {
      const data: SecurityDashboardData = {
        ...emptyData,
        spikeSeries: [{ label: '03', timestamp: 1, failures: 48, baseline: 5, isSpike: true }],
        deviceTrend: {
          points: [{ label: 'Jul-27', platform: 54, crossPlatform: 46 }],
          shiftDayLabel: null,
        },
        velocityMatrix: {
          rows: ['a.morgan'],
          cols: ['00-04'],
          cells: [[{ value: 28, isAnomalous: true }]],
          anomalousUsers: 1,
        },
      }

      const rows = buildSecurityExportRows(data, translate, 'today', 'hourly')

      expect(rows.slice(0, 5).map((row) => [row[2], row[3], row[4]])).toEqual([
        ['fields.anomalies_captured', 3, 'fields.unit_count'],
        ['fields.auth_failures', 12, 'fields.unit_count'],
        ['fields.agg_auth_attempts', 100, 'fields.unit_count'],
        ['fields.auth_success_rate', 88, 'fields.unit_percent'],
        ['fields.suspicious_ips', 0, 'fields.unit_count'],
      ])

      expect(rows).toContainEqual([
        'titles.attack_pulse',
        '03',
        'fields.auth_failures',
        48,
        'fields.unit_count',
      ])
      expect(rows).toContainEqual([
        'titles.attack_pulse',
        '03',
        'fields.rolling_baseline',
        5,
        'fields.unit_count',
      ])
      expect(rows).toContainEqual([
        'titles.attack_pulse',
        '03',
        'fields.spike_detected',
        'actions.yes',
        'fields.unit_flag',
      ])
      expect(rows).toContainEqual([
        'titles.velocity_watch',
        'a.morgan 00-04',
        'fields.authentication_attempts',
        28,
        'fields.unit_count',
      ])
      expect(rows).toContainEqual([
        'titles.velocity_watch',
        'a.morgan 00-04',
        'fields.anomalous',
        'actions.yes',
        'fields.unit_flag',
      ])
      expect(rows).toContainEqual([
        'titles.device_fingerprint_shift',
        'Jul-27',
        'fields.cross_platform',
        46,
        'fields.unit_percent',
      ])
    })
  })
})
