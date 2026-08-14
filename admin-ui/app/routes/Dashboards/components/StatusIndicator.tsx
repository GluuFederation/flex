import { memo } from 'react'
import GluuTooltip from 'Routes/Apps/Gluu/GluuTooltip'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import { STATUS_LABEL_KEYS } from '@/constants'
import type { ServiceStatusValue } from '@/constants'

type ClassesType = Record<string, string>

interface StatusIndicatorProps {
  label: string
  status: ServiceStatusValue
  classes: ClassesType
  t: (key: string) => string
}

export const StatusIndicator = memo<StatusIndicatorProps>(({ label, status, classes, t }) => {
  const isUp = status === 'up'
  const serverName = t(label)
  const translationKey = STATUS_LABEL_KEYS[status]
  const tooltipTitle = `${serverName} - ${t(translationKey)}`

  return (
    <GluuTooltip doc_entry={`server_status_${label}`} content={tooltipTitle}>
      <div className={classes.statusIndicator}>
        <div
          className={`${classes.statusDot} ${
            isUp ? classes.statusDotActive : classes.statusDotInactive
          }`}
        />
        <GluuText variant="span" className={classes.statusTitle}>
          {serverName}
        </GluuText>
      </div>
    </GluuTooltip>
  )
})

StatusIndicator.displayName = 'StatusIndicator'
