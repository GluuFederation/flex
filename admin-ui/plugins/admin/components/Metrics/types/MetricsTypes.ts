import type { Dayjs } from 'dayjs'

export type HeatmapData = {
  rows: readonly string[]
  cols: readonly string[]
  colsSub?: readonly string[]
  data: readonly (readonly number[])[]
  minVal: number
  maxVal: number
}

export type ActivityDataPoint = {
  label: string
  regSuccess: number
  regAttempts: number
  authAttempts: number
  authSuccess: number
}

export type MetricsDateRange = {
  startDate: Dayjs
  endDate: Dayjs
}

export type PasskeyAuthData = {
  name: string
  value: number
  color: string
}

export type PasskeyAdoptionData = {
  name: string
  newUsers: number
  totalUsers: number
}

export type OnboardingTimeEntry = {
  category: string
  minDuration: number
  avgDuration: number
  maxDuration: number
}

export type MetricsData = {
  passkeyAuth: PasskeyAuthData[]
  adoption: {
    newRegisteredUsers: number
    totalRegisteredUsers: number
    adoptionPasskeyRate: number
    chartData: PasskeyAdoptionData[]
  }
  onboardingTime: OnboardingTimeEntry[]
}

export type AggregationTypeParam = 'Hourly' | 'Daily' | 'Weekly' | 'Monthly'

export type AggregationParams = {
  aggregationType: AggregationTypeParam
  start_date: string
  end_date: string
  limit?: number
  startIndex?: number
}

export type AggregationEntry = {
  dn?: string | null
  id?: string | null
  aggregationType?: string | null
  startTime?: string | null
  endTime?: string | null
  uniqueUsers?: number | null
  lastUpdated?: string | null
  registrationAvgDuration?: number | null
  authenticationFailures?: number | null
  registrationSuccesses?: number | null
  registrationAttempts?: number | null
  authenticationAttempts?: number | null
  registrationSuccessRate?: number | null
  authenticationSuccesses?: number | null
  registrationFailures?: number | null
  fallbackEvents?: number | null
  period?: string | null
  authenticationSuccessRate?: number | null
  authenticationAvgDuration?: number | null
  baseDn?: string | null
  performanceMetrics?: Record<string, number | string | boolean | null> | null
  metricsData?: Record<string, number | string | boolean | null> | null
  deviceTypes?: Record<string, number | null> | null
  errorCounts?: Record<string, number | null> | null
}

export type AggregationResponse = {
  start?: number | null
  totalEntriesCount?: number | null
  entriesCount?: number | null
  entries?: AggregationEntry[] | null
}

export type MetricsDateRangeParams = {
  start_date: string
  end_date: string
}

export type AdoptionMetricsParams = MetricsDateRangeParams
export type ErrorsAnalyticsParams = MetricsDateRangeParams
export type PerformanceAnalyticsParams = MetricsDateRangeParams

export type AdoptionMetricsResponse = {
  newUsers?: number | null
  totalUniqueUsers?: number | null
  adoptionRate?: number | null
  newRegisteredUsers?: number | null
  totalRegisteredUsers?: number | null
  adoptionPasskeyRate?: number | null
  [key: string]: number | string | boolean | null | undefined
}

export type ErrorsAnalyticsResponse = {
  successRate?: number | null
  failureRate?: number | null
  dropOffRate?: number | null
  [key: string]: number | string | boolean | null | undefined
}

export type PerformanceAnalyticsResponse = {
  registrationAvgDuration?: number | null
  registrationMaxDuration?: number | null
  registrationMinDuration?: number | null
  authenticationAvgDuration?: number | null
  authenticationMaxDuration?: number | null
  authenticationMinDuration?: number | null
  [key: string]: number | string | boolean | null | undefined
}
