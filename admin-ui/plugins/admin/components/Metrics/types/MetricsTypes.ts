import type { Dayjs } from 'dayjs'

export interface MetricsDateRange {
  startDate: Dayjs
  endDate: Dayjs
}

export interface PasskeyAuthData {
  name: string
  value: number
  color: string
}

export interface PasskeyAdoptionData {
  name: string
  newUsers: number
  totalUsers: number
}

export interface OnboardingTimeEntry {
  category: string
  minDuration: number
  avgDuration: number
  maxDuration: number
}

export interface MetricsData {
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

export interface AggregationParams {
  aggregationType: AggregationTypeParam
  start_date: string
  end_date: string
  limit?: number
  startIndex?: number
}

export interface AggregationEntry {
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

export interface AggregationResponse {
  start?: number | null
  totalEntriesCount?: number | null
  entriesCount?: number | null
  entries?: AggregationEntry[] | null
}

export interface MetricsDateRangeParams {
  start_date: string
  end_date: string
}

export type AdoptionMetricsParams = MetricsDateRangeParams
export type ErrorsAnalyticsParams = MetricsDateRangeParams
export type PerformanceAnalyticsParams = MetricsDateRangeParams

export interface AdoptionMetricsResponse {
  newUsers?: number | null
  totalUniqueUsers?: number | null
  adoptionRate?: number | null
  newRegisteredUsers?: number | null
  totalRegisteredUsers?: number | null
  adoptionPasskeyRate?: number | null
  [key: string]: number | string | boolean | null | undefined
}

export interface ErrorsAnalyticsResponse {
  successRate?: number | null
  failureRate?: number | null
  dropOffRate?: number | null
  [key: string]: number | string | boolean | null | undefined
}

export interface PerformanceAnalyticsResponse {
  registrationAvgDuration?: number | null
  registrationMaxDuration?: number | null
  registrationMinDuration?: number | null
  authenticationAvgDuration?: number | null
  authenticationMaxDuration?: number | null
  authenticationMinDuration?: number | null
  [key: string]: number | string | boolean | null | undefined
}
