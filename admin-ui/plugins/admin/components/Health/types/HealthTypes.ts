import type { ServiceStatusValue } from '@/constants'

export type { ServiceStatusValue }

export interface ServiceHealth {
  name: string
  status: ServiceStatusValue
  error?: string
  lastChecked?: Date
}

export interface ServiceStatusCardProps {
  service: ServiceHealth
  isDark: boolean
}

export interface ServiceStatusResponse {
  [serviceName: string]: string
}
