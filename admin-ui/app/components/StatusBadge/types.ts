export type StatusBadgeTheme = 'active' | 'inactive' | 'success' | 'danger' | 'warning' | 'info'

export type ServiceStatusValue = 'up' | 'down' | 'unknown' | 'degraded'

export interface StatusBadgeProps {
  text?: string
  theme?: StatusBadgeTheme
  isDark?: boolean
  isActive?: boolean
  status?: ServiceStatusValue
  variant?: 'default' | 'health'
}
