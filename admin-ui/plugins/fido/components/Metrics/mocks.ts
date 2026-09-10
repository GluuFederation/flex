import { createDate, type Dayjs } from '@/utils/dayjsUtils'
import { isDevelopment } from '@/utils/env'
import type {
  AdoptionMetricsParams,
  AdoptionMetricsResponse,
  AggregationEntry,
  AggregationParams,
  AggregationResponse,
  AggregationTypeParam,
  ErrorsAnalyticsParams,
  ErrorsAnalyticsResponse,
  PerformanceAnalyticsParams,
  PerformanceAnalyticsResponse,
} from './types'

const MOCK_QUERY_FLAG = 'mockMetrics'
const MOCK_STORAGE_KEY = 'fido.metrics.mock'
const MOCK_LATENCY_MS = 250

const AGGREGATION_PERIOD_FORMATS: Record<AggregationTypeParam, string> = {
  Hourly: 'YYYY-MM-DD-H',
  Daily: 'YYYY-MM-DD',
  Weekly: 'YYYY-MM-DD',
  Monthly: 'YYYY-MM',
}

const AGGREGATION_STEP_UNITS = {
  Hourly: 'hour',
  Daily: 'day',
  Weekly: 'week',
  Monthly: 'month',
} as const

const MAX_MOCK_BUCKETS = 180

const readMockFlag = (): boolean => {
  if (!isDevelopment) return false
  if (typeof window === 'undefined') return true
  const requested = new URLSearchParams(window.location.search).get(MOCK_QUERY_FLAG)
  if (requested === 'off' || requested === '0') {
    window.sessionStorage.setItem(MOCK_STORAGE_KEY, '0')
    return false
  }
  if (requested !== null) {
    window.sessionStorage.setItem(MOCK_STORAGE_KEY, '1')
    return true
  }
  return window.sessionStorage.getItem(MOCK_STORAGE_KEY) !== '0'
}

const isMetricsMockEnabled = (): boolean => readMockFlag()

const hashSeed = (seed: string): number => {
  let hash = 2166136261
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return (hash >>> 0) / 4294967295
}

const seededBetween = (seed: string, min: number, max: number): number =>
  Math.round(min + hashSeed(seed) * (max - min))

const delayed = <T>(value: T): Promise<T> =>
  new Promise((resolve) => {
    setTimeout(() => resolve(value), MOCK_LATENCY_MS)
  })

const toDate = (value: string): Dayjs => createDate(value)

const buildPeriods = (
  aggregationType: AggregationTypeParam,
  startDate: string,
  endDate: string,
): string[] => {
  const unit = AGGREGATION_STEP_UNITS[aggregationType]
  const format = AGGREGATION_PERIOD_FORMATS[aggregationType]
  const start = toDate(startDate)
  const end = toDate(endDate)
  if (!start.isValid() || !end.isValid()) return []

  const periods: string[] = []
  let cursor = start.startOf(unit)
  while (cursor.isBefore(end) && periods.length < MAX_MOCK_BUCKETS) {
    periods.push(cursor.format(format))
    cursor = cursor.add(1, unit)
  }
  return periods
}

const buildAggregationEntry = (
  period: string,
  aggregationType: AggregationTypeParam,
  index: number,
): AggregationEntry => {
  const registrationAttempts = seededBetween(`${period}-ra`, 20, 240)
  const registrationSuccesses = Math.round(
    registrationAttempts * (0.6 + hashSeed(`${period}-rs`) * 0.35),
  )
  const authenticationAttempts = seededBetween(`${period}-aa`, 80, 900)
  const authenticationSuccesses = Math.round(
    authenticationAttempts * (0.7 + hashSeed(`${period}-as`) * 0.28),
  )
  const authenticationFailures = Math.max(
    0,
    Math.round((authenticationAttempts - authenticationSuccesses) * 0.7),
  )

  return {
    id: `mock-${aggregationType}-${index}`,
    aggregationType,
    period,
    uniqueUsers: seededBetween(`${period}-uu`, 15, 400),
    registrationAttempts,
    registrationSuccesses,
    registrationFailures: registrationAttempts - registrationSuccesses,
    registrationSuccessRate: registrationSuccesses / Math.max(1, registrationAttempts),
    registrationAvgDuration: seededBetween(`${period}-rd`, 1200, 9000),
    authenticationAttempts,
    authenticationSuccesses,
    authenticationFailures,
    authenticationSuccessRate: authenticationSuccesses / Math.max(1, authenticationAttempts),
    authenticationAvgDuration: seededBetween(`${period}-ad`, 400, 4200),
    abandonedOperations: Math.max(
      0,
      authenticationAttempts - authenticationSuccesses - authenticationFailures,
    ),
    fallbackEvents: seededBetween(`${period}-fb`, 0, 25),
  }
}

const mockAdoption = (params: AdoptionMetricsParams): Promise<AdoptionMetricsResponse> => {
  const seed = `${params.start_date}|${params.end_date}`
  const totalUniqueUsers = seededBetween(`${seed}-tu`, 800, 4200)
  const newUsers = seededBetween(`${seed}-nu`, 60, 900)
  const totalRegisteredUsers = Math.round(totalUniqueUsers * 0.72)
  const newRegisteredUsers = Math.round(newUsers * 0.65)
  return delayed({
    newUsers,
    totalUniqueUsers,
    adoptionRate: totalRegisteredUsers / Math.max(1, totalUniqueUsers),
    newRegisteredUsers,
    totalRegisteredUsers,
    adoptionPasskeyRate: 0.4 + hashSeed(`${seed}-pk`) * 0.5,
  })
}

const mockErrors = (params: ErrorsAnalyticsParams): Promise<ErrorsAnalyticsResponse> => {
  const seed = `${params.start_date}|${params.end_date}`
  const successRate = 0.62 + hashSeed(`${seed}-sr`) * 0.3
  const failureRate = (1 - successRate) * 0.7
  return delayed({
    successRate,
    failureRate,
    dropOffRate: Math.max(0, 1 - successRate - failureRate),
    errorCategories: {
      TIMEOUT: seededBetween(`${seed}-e1`, 5, 90),
      USER_CANCELLED: seededBetween(`${seed}-e2`, 10, 140),
      INVALID_STATE: seededBetween(`${seed}-e3`, 2, 45),
      NOT_ALLOWED: seededBetween(`${seed}-e4`, 3, 70),
    },
    topErrors: {
      NotAllowedError: seededBetween(`${seed}-t1`, 20, 160),
      AbortError: seededBetween(`${seed}-t2`, 10, 90),
      SecurityError: seededBetween(`${seed}-t3`, 1, 30),
    },
  })
}

const mockPerformance = (
  params: PerformanceAnalyticsParams,
): Promise<PerformanceAnalyticsResponse> => {
  const seed = `${params.start_date}|${params.end_date}`
  const registrationAvgDuration = seededBetween(`${seed}-rav`, 2500, 7000)
  const authenticationAvgDuration = seededBetween(`${seed}-aav`, 700, 2800)
  return delayed({
    registrationMinDuration: Math.round(registrationAvgDuration * 0.35),
    registrationAvgDuration,
    registrationMaxDuration: Math.round(registrationAvgDuration * 2.4),
    authenticationMinDuration: Math.round(authenticationAvgDuration * 0.3),
    authenticationAvgDuration,
    authenticationMaxDuration: Math.round(authenticationAvgDuration * 3.1),
  })
}

const mockAggregations = (
  aggregationType: AggregationTypeParam,
  params: Pick<AggregationParams, 'start_date' | 'end_date' | 'limit'>,
): Promise<AggregationResponse> => {
  const periods = buildPeriods(aggregationType, params.start_date, params.end_date).slice(
    0,
    params.limit ?? MAX_MOCK_BUCKETS,
  )
  const entries = periods.map((period, index) =>
    buildAggregationEntry(period, aggregationType, index),
  )
  return delayed({
    start: 0,
    totalEntriesCount: entries.length,
    entriesCount: entries.length,
    entries,
  })
}

const mockMetricsApi = {
  getAdoption: mockAdoption,
  getErrors: mockErrors,
  getPerformance: mockPerformance,
  getAggregations: mockAggregations,
}

export { isMetricsMockEnabled, mockMetricsApi }
