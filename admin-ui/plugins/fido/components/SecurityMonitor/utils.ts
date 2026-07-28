import { createDate, type Dayjs } from '@/utils/dayjsUtils'
import { METRIC_STATUS } from '../Metrics/constants'
import type {
  AggregationEntry,
  DevicesAnalyticsResponse,
  ErrorsAnalyticsResponse,
  MetricsEntry,
} from '../Metrics/types'
import {
  ANOMALY_KINDS,
  ATTACK_PATTERNS,
  BASELINE_WINDOW_DAYS,
  CHART_SCAFFOLD,
  CHART_TICK_COUNT,
  CRITICAL_IP_RATIO_THRESHOLD,
  DEVICE_TREND_DAYS,
  DROP_OFF_ALERT_RATE,
  SPIKE_RATIO_THRESHOLD,
  SUSPICIOUS_IP_MIN_FAILURES,
  SUSPICIOUS_IP_MIN_FAILURE_RATE,
  SUSPICIOUS_IP_MIN_TARGETED_USERS,
  THREAT_LEVELS,
  TOP_IP_LIMIT,
  TOP_USER_LIMIT,
  VELOCITY_ANOMALY_MIN_ATTEMPTS,
  VELOCITY_ANOMALY_RATIO,
  VELOCITY_BUCKET_HOURS,
} from './constants'
import type {
  AnomalyChip,
  AnomalySummary,
  AttackPattern,
  CountAxis,
  DeviceTrend,
  DeviceTrendPoint,
  DropOffPoint,
  ErrorCategorySlice,
  FailureSpikePoint,
  IpBarScaffoldPoint,
  IpFailureStat,
  KpiDelta,
  PeriodTotals,
  SecurityPalette,
  SecurityPaletteSource,
  SecurityTranslate,
  ThreatLevel,
  VelocityCell,
  VelocityMatrix,
} from './types'

const HOURS_IN_DAY = 24

const MS_IN_DAY = 24 * 60 * 60 * 1000

const PLATFORM_KEY_HINT = 'platform'

const CROSS_PLATFORM_KEY_HINT = 'cross'

const PLATFORM_MAJORITY_SHARE = 50

const toCount = (value: number | null | undefined): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : 0

const roundTo = (value: number, digits = 2): number => Number(value.toFixed(digits))

const entryStartDate = (entry: AggregationEntry): Dayjs | null => {
  const raw = entry.startTime ?? entry.period
  if (!raw) return null
  const parsed = createDate(raw)
  return parsed.isValid() ? parsed : null
}

const buildFailureSpikeSeries = (
  entries: readonly AggregationEntry[],
  from?: Dayjs | null,
): FailureSpikePoint[] => {
  const points = entries
    .map((entry) => {
      const date = entryStartDate(entry)
      if (!date) return null
      return { date, failures: toCount(entry.authenticationFailures) }
    })
    .filter((point): point is { date: Dayjs; failures: number } => point !== null)
    .sort((a, b) => a.date.valueOf() - b.date.valueOf())

  const failuresByHour = new Map<number, number>()
  points.forEach((point) => {
    failuresByHour.set(point.date.valueOf(), point.failures)
  })

  const fromValue = from ? from.valueOf() : Number.NEGATIVE_INFINITY

  return points
    .filter((point) => point.date.valueOf() >= fromValue)
    .map((point) => {
      const timestamp = point.date.valueOf()
      const history: number[] = []
      for (let day = 1; day <= BASELINE_WINDOW_DAYS; day += 1) {
        const previous = failuresByHour.get(timestamp - day * MS_IN_DAY)
        if (previous !== undefined) history.push(previous)
      }
      const baseline = history.length
        ? roundTo(history.reduce((sum, value) => sum + value, 0) / history.length)
        : 0

      return {
        label: point.date.format('HH'),
        timestamp,
        failures: point.failures,
        baseline,
        isSpike: baseline > 0 && point.failures >= baseline * SPIKE_RATIO_THRESHOLD,
      }
    })
}

const findPeakSpike = (series: readonly FailureSpikePoint[]): FailureSpikePoint | null =>
  series
    .filter((point) => point.isSpike)
    .reduce<FailureSpikePoint | null>(
      (peak, point) => (!peak || point.failures > peak.failures ? point : peak),
      null,
    )

const spikeRatio = (point: FailureSpikePoint): number =>
  point.baseline > 0 ? Math.round(point.failures / point.baseline) : 0

const classifyThreatLevel = (stat: { failures: number; failureRate: number }): ThreatLevel => {
  if (
    stat.failures >= SUSPICIOUS_IP_MIN_FAILURES * CRITICAL_IP_RATIO_THRESHOLD &&
    stat.failureRate >= 0.8
  ) {
    return THREAT_LEVELS.CRITICAL
  }
  if (stat.failures >= SUSPICIOUS_IP_MIN_FAILURES * 2 && stat.failureRate >= 0.6) {
    return THREAT_LEVELS.HIGH
  }
  if (stat.failures >= SUSPICIOUS_IP_MIN_FAILURES) return THREAT_LEVELS.MEDIUM
  return THREAT_LEVELS.LOW
}

const classifyAttackPattern = (stat: {
  targetedUsers: number
  successes: number
}): AttackPattern => {
  if (stat.targetedUsers <= 1) return ATTACK_PATTERNS.BRUTE_FORCE
  if (stat.successes > 0 && stat.targetedUsers >= SUSPICIOUS_IP_MIN_TARGETED_USERS) {
    return ATTACK_PATTERNS.CREDENTIAL_STUFFING
  }
  if (stat.targetedUsers >= SUSPICIOUS_IP_MIN_TARGETED_USERS) {
    return ATTACK_PATTERNS.PASSWORD_SPRAYING
  }
  return ATTACK_PATTERNS.DISTRIBUTED
}

const aggregateIpFailures = (entries: readonly MetricsEntry[]): IpFailureStat[] => {
  const buckets = new Map<
    string,
    {
      failures: number
      successes: number
      attempts: number
      users: Set<string>
      firstSeen: number
      lastSeen: number
    }
  >()

  entries.forEach((entry) => {
    const ipAddress = entry.ipAddress
    if (!ipAddress) return
    const bucket = buckets.get(ipAddress) ?? {
      failures: 0,
      successes: 0,
      attempts: 0,
      users: new Set<string>(),
      firstSeen: Number.POSITIVE_INFINITY,
      lastSeen: 0,
    }

    bucket.attempts += 1
    if (entry.status === METRIC_STATUS.FAILURE) bucket.failures += 1
    if (entry.status === METRIC_STATUS.SUCCESS) bucket.successes += 1

    const identity = entry.userId ?? entry.username
    if (identity) bucket.users.add(identity)

    if (entry.timestamp) {
      const parsed = createDate(entry.timestamp)
      if (parsed.isValid()) {
        bucket.firstSeen = Math.min(bucket.firstSeen, parsed.valueOf())
        bucket.lastSeen = Math.max(bucket.lastSeen, parsed.valueOf())
      }
    }

    buckets.set(ipAddress, bucket)
  })

  return Array.from(buckets.entries())
    .map(([ipAddress, bucket]) => {
      const failureRate = bucket.attempts ? bucket.failures / bucket.attempts : 0
      return {
        ipAddress,
        failures: bucket.failures,
        successes: bucket.successes,
        attempts: bucket.attempts,
        failureRate: roundTo(failureRate * 100),
        targetedUsers: bucket.users.size,
        firstSeen: Number.isFinite(bucket.firstSeen) ? bucket.firstSeen : 0,
        lastSeen: bucket.lastSeen,
        threatLevel: classifyThreatLevel({ failures: bucket.failures, failureRate }),
        pattern: classifyAttackPattern({
          targetedUsers: bucket.users.size,
          successes: bucket.successes,
        }),
      }
    })
    .sort((a, b) => b.failures - a.failures)
}

const takeTopIpsByFailure = (stats: readonly IpFailureStat[], limit = TOP_IP_LIMIT) =>
  stats.filter((stat) => stat.failures > 0).slice(0, limit)

const filterSuspiciousIps = (stats: readonly IpFailureStat[]): IpFailureStat[] =>
  stats.filter(
    (stat) =>
      stat.failures >= SUSPICIOUS_IP_MIN_FAILURES &&
      (stat.failureRate >= SUSPICIOUS_IP_MIN_FAILURE_RATE * 100 ||
        stat.targetedUsers >= SUSPICIOUS_IP_MIN_TARGETED_USERS),
  )

const countByThreatLevel = (stats: readonly IpFailureStat[], level: ThreatLevel): number =>
  stats.filter((stat) => stat.threatLevel === level).length

const buildDropOffSeries = (entries: readonly AggregationEntry[]): DropOffPoint[] =>
  entries
    .map((entry) => {
      const date = entryStartDate(entry)
      if (!date) return null
      const attempts = toCount(entry.authenticationAttempts)
      const successes = toCount(entry.authenticationSuccesses)
      const failures = toCount(entry.authenticationFailures)
      const dropOffs = Math.max(0, attempts - successes - failures)

      return {
        timestamp: date.valueOf(),
        label: date.format('ddd'),
        successRate: attempts ? roundTo((successes / attempts) * 100) : 0,
        failureRate: attempts ? roundTo((failures / attempts) * 100) : 0,
        dropOffRate: attempts ? roundTo((dropOffs / attempts) * 100) : 0,
      }
    })
    .filter((point): point is DropOffPoint & { timestamp: number } => point !== null)
    .sort((a, b) => a.timestamp - b.timestamp)
    .map(({ label, successRate, failureRate, dropOffRate }) => ({
      label,
      successRate,
      failureRate,
      dropOffRate,
    }))

const findDropOffPeak = (series: readonly DropOffPoint[]): DropOffPoint | null =>
  series.reduce<DropOffPoint | null>(
    (peak, point) => (!peak || point.dropOffRate > peak.dropOffRate ? point : peak),
    null,
  )

const readCountRecord = (
  value: DevicesAnalyticsResponse[string] | ErrorsAnalyticsResponse[string],
): Record<string, number> => {
  if (!value || typeof value !== 'object') return {}
  return Object.entries(value).reduce<Record<string, number>>((acc, [key, count]) => {
    if (typeof count === 'number' && Number.isFinite(count)) acc[key] = count
    return acc
  }, {})
}

const getSecurityPalette = (themeColors: SecurityPaletteSource): SecurityPalette => {
  const { badges, chart, textMuted, warningColor } = themeColors

  return {
    chart: {
      failures: badges.statusInactive,
      baseline: textMuted,
      success: badges.statusActive,
      failureBand: warningColor,
      dropOff: badges.statusInactive,
      attempts: chart.lightBlue,
      suspicious: warningColor,
      platform: chart.purple,
      crossPlatform: warningColor,
    },
    threatLevels: {
      [THREAT_LEVELS.CRITICAL]: badges.statusInactive,
      [THREAT_LEVELS.HIGH]: warningColor,
      [THREAT_LEVELS.MEDIUM]: chart.blue,
      [THREAT_LEVELS.LOW]: chart.lightBlue,
    },
    velocityCells: {
      empty: chart.donutEmptyColor,
      normal: chart.lightBlue,
      anomalous: badges.statusInactive,
    },
    errorCategories: [
      badges.statusInactive,
      chart.blue,
      warningColor,
      textMuted,
      chart.purple,
      chart.cyan,
      badges.statusActive,
    ],
    statusBg: { active: badges.statusActiveBg, inactive: badges.statusInactiveBg },
    status: { active: badges.statusActive, inactive: badges.statusInactive },
  }
}

const buildErrorCategorySlices = (
  errors: ErrorsAnalyticsResponse | undefined,
  colors: readonly string[],
): ErrorCategorySlice[] => {
  const source = {
    ...readCountRecord(errors?.errorCategories),
    ...readCountRecord(errors?.errorCounts),
  }
  const items = Object.entries(source).filter(([, count]) => count > 0)
  const total = items.reduce((sum, [, count]) => sum + count, 0)

  return items
    .sort((a, b) => b[1] - a[1])
    .map(([category, count], index) => ({
      category,
      count,
      share: total ? roundTo((count / total) * 100) : 0,
      color: colors[index % colors.length]!,
    }))
}

const buildVelocityMatrix = (
  entries: readonly MetricsEntry[],
  limit = TOP_USER_LIMIT,
): VelocityMatrix => {
  const bucketCount = Math.ceil(HOURS_IN_DAY / VELOCITY_BUCKET_HOURS)
  const perUser = new Map<string, number[]>()
  const totals = new Map<string, number>()

  entries.forEach((entry) => {
    const identity = entry.username ?? entry.userId
    if (!identity || !entry.timestamp) return
    const parsed = createDate(entry.timestamp)
    if (!parsed.isValid()) return

    const row = perUser.get(identity) ?? new Array<number>(bucketCount).fill(0)
    const bucket = Math.min(bucketCount - 1, Math.floor(parsed.hour() / VELOCITY_BUCKET_HOURS))
    row[bucket] = (row[bucket] ?? 0) + 1
    perUser.set(identity, row)
    totals.set(identity, (totals.get(identity) ?? 0) + 1)
  })

  const rows = Array.from(totals.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([identity]) => identity)

  const cells: VelocityCell[][] = rows.map((identity) => {
    const row = perUser.get(identity) ?? new Array<number>(bucketCount).fill(0)
    return row.map((value, index) => {
      const others = row.filter((other, otherIndex) => otherIndex !== index && other > 0)
      const othersMean = others.length
        ? others.reduce((sum, other) => sum + other, 0) / others.length
        : 0
      return {
        value,
        isAnomalous:
          value >= VELOCITY_ANOMALY_MIN_ATTEMPTS &&
          (othersMean === 0 || value >= othersMean * VELOCITY_ANOMALY_RATIO),
      }
    })
  })

  const cols = Array.from({ length: bucketCount }, (_, index) => {
    const start = index * VELOCITY_BUCKET_HOURS
    const end = start + VELOCITY_BUCKET_HOURS
    return `${String(start).padStart(2, '0')}-${String(end).padStart(2, '0')}`
  })

  return {
    rows,
    cols,
    cells: cells.length ? cells : [cols.map(() => ({ value: 0, isAnomalous: false }))],
    anomalousUsers: cells.filter((row) => row.some((cell) => cell.isAnomalous)).length,
  }
}

const isPlatformKey = (key: string): boolean => {
  const normalised = key.toLowerCase()
  return normalised.includes(PLATFORM_KEY_HINT) && !normalised.includes(CROSS_PLATFORM_KEY_HINT)
}

const buildDeviceTrend = (entries: readonly AggregationEntry[]): DeviceTrend => {
  const points: DeviceTrendPoint[] = entries
    .map((entry) => {
      const date = entryStartDate(entry)
      if (!date) return null
      const counts = readCountRecord(entry.deviceTypes)
      const total = Object.values(counts).reduce((sum, value) => sum + value, 0)
      if (!total) return null
      const platform = Object.entries(counts)
        .filter(([key]) => isPlatformKey(key))
        .reduce((sum, [, value]) => sum + value, 0)

      return {
        timestamp: date.valueOf(),
        label: date.format('MMM-DD'),
        platform: roundTo((platform / total) * 100),
        crossPlatform: roundTo(((total - platform) / total) * 100),
      }
    })
    .filter((point): point is DeviceTrendPoint & { timestamp: number } => point !== null)
    .sort((a, b) => a.timestamp - b.timestamp)
    .map(({ label, platform, crossPlatform }) => ({ label, platform, crossPlatform }))

  let shiftDayLabel: string | null = null
  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1]!
    const current = points[index]!
    if (
      previous.platform >= PLATFORM_MAJORITY_SHARE &&
      current.platform < PLATFORM_MAJORITY_SHARE
    ) {
      shiftDayLabel = current.label
      break
    }
  }

  return { points, shiftDayLabel }
}

const sumAggregation = (entries: readonly AggregationEntry[]): PeriodTotals =>
  entries.reduce<PeriodTotals>(
    (acc, entry) => ({
      attempts: acc.attempts + toCount(entry.authenticationAttempts),
      successes: acc.successes + toCount(entry.authenticationSuccesses),
      failures: acc.failures + toCount(entry.authenticationFailures),
    }),
    { attempts: 0, successes: 0, failures: 0 },
  )

const successRateOf = (totals: { attempts: number; successes: number }): number =>
  totals.attempts ? roundTo((totals.successes / totals.attempts) * 100) : 0

const sliceEntriesByRange = (
  entries: readonly AggregationEntry[],
  from: Dayjs,
  to: Dayjs,
): AggregationEntry[] =>
  entries.filter((entry) => {
    const date = entryStartDate(entry)
    if (!date) return false
    const value = date.valueOf()
    return value >= from.valueOf() && value <= to.valueOf()
  })

const percentDelta = (current: number, previous: number): KpiDelta => {
  if (previous === 0) {
    return { value: current > 0 ? 100 : 0, isIncrease: current > 0 }
  }
  const change = ((current - previous) / previous) * 100
  return { value: Math.abs(roundTo(change, 0)), isIncrease: change >= 0 }
}

const pointDelta = (current: number, previous: number): KpiDelta => {
  const change = roundTo(current - previous, 0)
  return { value: Math.abs(change), isIncrease: change >= 0 }
}

const countSpikes = (entries: readonly AggregationEntry[]): number =>
  buildFailureSpikeSeries(entries).filter((point) => point.isSpike).length

const buildAnomalySummary = (
  spikeSeries: readonly FailureSpikePoint[],
  suspiciousIps: readonly IpFailureStat[],
  dropOffSeries: readonly DropOffPoint[],
  t: SecurityTranslate,
): AnomalySummary => {
  const chips: AnomalyChip[] = []
  const peak = findPeakSpike(spikeSeries)
  const dropOffPeak = findDropOffPeak(dropOffSeries)
  const hasDropOffAlert = !!dropOffPeak && dropOffPeak.dropOffRate >= DROP_OFF_ALERT_RATE

  if (peak) {
    chips.push({ kind: ANOMALY_KINDS.AUTH_SPIKE, label: t('fields.anomaly_chip_auth_spike') })
  }
  if (suspiciousIps.length) {
    chips.push({
      kind: ANOMALY_KINDS.IPS_FLAGGED,
      label: t('fields.anomaly_chip_ips_flagged', { total: suspiciousIps.length }),
    })
  }
  if (hasDropOffAlert) {
    chips.push({ kind: ANOMALY_KINDS.DROP_OFF, label: t('fields.anomaly_chip_drop_off') })
  }

  return { count: chips.length, chips }
}

const HOUR_LABEL_LENGTH = 2

const buildCountAxis = (maxValue: number, tickCount: number = CHART_TICK_COUNT): CountAxis => {
  const intervals = Math.max(1, tickCount - 1)
  const top = maxValue > 0 ? maxValue : CHART_SCAFFOLD.EMPTY_COUNT_MAX
  const step = Math.ceil(top / intervals)

  return {
    domain: [0, step * intervals],
    ticks: Array.from({ length: intervals + 1 }, (_, index) => index * step),
  }
}

const buildDayLabels = (count: number, format: string, base?: number): string[] =>
  Array.from({ length: count }, (_, index) =>
    createDate(base)
      .subtract(count - 1 - index, 'day')
      .format(format),
  )

const buildHourScaffold = (): FailureSpikePoint[] =>
  Array.from({ length: HOURS_IN_DAY }, (_, hour) => ({
    label: String(hour).padStart(HOUR_LABEL_LENGTH, '0'),
    timestamp: hour,
    failures: 0,
    baseline: 0,
    isSpike: false,
  }))

const buildDropOffScaffold = (base?: number): DropOffPoint[] =>
  buildDayLabels(CHART_SCAFFOLD.DROP_OFF_DAYS, 'ddd', base).map((label) => ({
    label,
    successRate: 0,
    failureRate: 0,
    dropOffRate: 0,
  }))

const buildDeviceScaffold = (base?: number): DeviceTrendPoint[] =>
  buildDayLabels(DEVICE_TREND_DAYS, 'MMM-DD', base).map((label) => ({
    label,
    platform: 0,
    crossPlatform: 0,
  }))

const buildIpScaffold = (): IpBarScaffoldPoint[] =>
  Array.from({ length: CHART_SCAFFOLD.BAR_ROWS }, (_, index) => ({
    ipAddress: ' '.repeat(index + 1),
    failures: 0,
  }))

const buildVelocityScaffoldRows = (): string[] =>
  Array.from({ length: CHART_SCAFFOLD.VELOCITY_ROWS }, (_, index) => ' '.repeat(index + 1))

export {
  aggregateIpFailures,
  buildAnomalySummary,
  buildCountAxis,
  buildDeviceScaffold,
  buildDropOffScaffold,
  buildHourScaffold,
  buildIpScaffold,
  buildVelocityScaffoldRows,
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
  getSecurityPalette,
  percentDelta,
  pointDelta,
  sliceEntriesByRange,
  spikeRatio,
  successRateOf,
  sumAggregation,
  takeTopIpsByFailure,
}
