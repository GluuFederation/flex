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
  dn?: string
  id?: string
  aggregationType?: string
  startTime?: string
  endTime?: string
  uniqueUsers?: number
  lastUpdated?: string
  registrationAvgDuration?: number
  authenticationFailures?: number
  registrationSuccesses?: number
  registrationAttempts?: number
  authenticationAttempts?: number
  registrationSuccessRate?: number
  authenticationSuccesses?: number
  registrationFailures?: number
  fallbackEvents?: number
  period?: string
  authenticationSuccessRate?: number
  authenticationAvgDuration?: number
  baseDn?: string
  performanceMetrics?: Record<string, number | string | boolean | null>
  metricsData?: Record<string, number | string | boolean | null>
  deviceTypes?: Record<string, number>
  errorCounts?: Record<string, number>
}

export interface AggregationResponse {
  start?: number
  totalEntriesCount?: number
  entriesCount?: number
  entries?: AggregationEntry[]
}

export interface MetricsDateRangeParams {
  start_date: string
  end_date: string
}

export type AdoptionMetricsParams = MetricsDateRangeParams
export type ErrorsAnalyticsParams = MetricsDateRangeParams
export type PerformanceAnalyticsParams = MetricsDateRangeParams

export interface AdoptionMetricsResponse {
  newUsers?: number
  totalUniqueUsers?: number
  adoptionRate?: number
  newRegisteredUsers?: number
  totalRegisteredUsers?: number
  adoptionPasskeyRate?: number
  [key: string]: number | string | boolean | null | undefined
}

export interface ErrorsAnalyticsResponse {
  successRate?: number
  failureRate?: number
  dropOffRate?: number
  [key: string]: number | string | boolean | null | undefined
}

export interface PerformanceAnalyticsResponse {
  registrationAvgDuration?: number
  registrationMaxDuration?: number
  registrationMinDuration?: number
  authenticationAvgDuration?: number
  authenticationMaxDuration?: number
  authenticationMinDuration?: number
  [key: string]: number | string | boolean | null | undefined
}
