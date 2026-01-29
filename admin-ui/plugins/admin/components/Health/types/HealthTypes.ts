import type { HealthStatus, Status } from 'JansConfigApi'

export type { HealthStatus, Status }

export type ServiceStatusValue = 'up' | 'down'

export interface ServiceHealth {
  name: string
  status: ServiceStatusValue
  error?: string
  lastChecked?: Date
}

export interface ServiceStatusCardProps {
  service: ServiceHealth
  themeColors: {
    background: string
    fontColor: string
  }
}

export interface HealthStatusBadgeProps {
  status: ServiceStatusValue
}

export interface ServiceStatusResponse {
  [serviceName: string]: string
}
