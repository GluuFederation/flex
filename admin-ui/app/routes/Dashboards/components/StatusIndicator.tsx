import { memo } from 'react'

type ClassesType = Record<string, string>

interface StatusIndicatorProps {
  label: string
  status: string
  classes: ClassesType
  t: (key: string) => string
}

export const StatusIndicator = memo<StatusIndicatorProps>(({ label, status, classes, t }) => {
  const isActive = status === 'up' || status === 'degraded'
  return (
    <div className={classes.statusIndicator}>
      <div
        className={`${classes.statusDot} ${
          isActive ? classes.statusDotActive : classes.statusDotInactive
        }`}
      />
      <span>{t(label)}</span>
    </div>
  )
})

StatusIndicator.displayName = 'StatusIndicator'
