import React, { useMemo } from 'react'
import { useStyles } from './StatusBadge.style'

export type StatusBadgeTheme = 'active' | 'inactive' | 'success' | 'danger' | 'warning' | 'info'
export type ServiceStatusValue = 'up' | 'down' | 'unknown' | 'degraded'

export interface StatusBadgeProps {
  text?: string
  theme?: StatusBadgeTheme
  isDark?: boolean
  isActive?: boolean
  status?: ServiceStatusValue
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  text,
  theme,
  isDark = false,
  isActive,
  status,
}) => {
  const resolvedTheme = useMemo(() => {
    if (status !== undefined) {
      return status === 'up' ? 'active' : 'inactive'
    }
    if (isActive !== undefined) {
      return isActive ? 'active' : 'inactive'
    }
    return theme || 'active'
  }, [status, isActive, theme])

  const displayText = useMemo(() => {
    if (text) return text
    if (status !== undefined) {
      return status === 'up' ? 'Active' : 'Inactive'
    }
    if (isActive !== undefined) {
      return isActive ? 'Active' : 'Inactive'
    }
    return 'Active'
  }, [text, status, isActive])

  const { classes } = useStyles({ theme: resolvedTheme, isDark })

  return (
    <div className={classes.badge}>
      <p className={classes.badgeText}>{displayText}</p>
    </div>
  )
}

export default StatusBadge
