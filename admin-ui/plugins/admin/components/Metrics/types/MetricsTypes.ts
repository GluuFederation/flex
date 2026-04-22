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

// ─── Fido2 metrics API types ────────────────────────────────────────────────

export interface AdoptionMetricsParams {
  start_date: string
  end_date: string
}

export interface AdoptionMetricsResponse {
  newRegisteredUsers?: number
  totalRegisteredUsers?: number
  adoptionPasskeyRate?: number
  [key: string]: unknown
}
