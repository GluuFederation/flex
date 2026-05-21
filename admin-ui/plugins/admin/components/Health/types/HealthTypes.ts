import type { ServiceStatusValue } from '@/constants'

export type { ServiceStatusValue }

export type ServiceHealth = {
  name: string
  status: ServiceStatusValue
  error?: string
  lastChecked?: Date
}

export type ServiceStatusCardProps = {
  service: ServiceHealth
  isDark: boolean
}

export type ServiceStatusResponse = {
  [serviceName: string]: string
}
