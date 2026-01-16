import React, { useContext, useMemo, memo } from 'react'
import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import { StatusBadge } from '@/components/StatusBadge'
import type { ServiceStatusCardProps, ServiceHealth } from '../types'
import { formatServiceName } from '../utils'
import { ThemeContext } from '@/context/theme/themeContext'
import { THEME_DARK, DEFAULT_THEME } from '@/context/theme/constants'
import { useStyles } from './ServiceStatusCard.style'

function getStatusMessage(service: ServiceHealth, t: TFunction): string {
  if (service.error) {
    return service.error
  }
  switch (service.status) {
    case 'up':
      return t('messages.service_status_up')
    case 'down':
      return t('messages.service_status_down')
    case 'degraded':
      return t('messages.service_status_degraded')
    default:
      return t('messages.service_status_unknown')
  }
}

const ServiceStatusCard: React.FC<ServiceStatusCardProps> = memo(({ service }) => {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const currentTheme = theme?.state.theme || DEFAULT_THEME
  const isDark = currentTheme === THEME_DARK
  const { classes } = useStyles({ isDark })
  const displayName = useMemo(() => formatServiceName(service.name), [service.name])
  const statusMessage = useMemo(() => getStatusMessage(service, t).replace(/\.$/, ''), [service, t])
  const badgeClassName = useMemo(
    () =>
      `${classes.statusBadge} ${
        service.status === 'up' ? classes.statusBadgeActive : classes.statusBadgeInactive
      }`,
    [classes.statusBadge, classes.statusBadgeActive, classes.statusBadgeInactive, service.status],
  )

  return (
    <div className={classes.card}>
      <div className={classes.content}>
        <div className={classes.textContainer}>
          <div className={classes.serviceName}>{displayName}</div>
          <div className={classes.serviceMessage}>{statusMessage}</div>
        </div>
        <div className={badgeClassName}>
          <StatusBadge status={service.status} isDark={isDark} />
        </div>
      </div>
    </div>
  )
})

ServiceStatusCard.displayName = 'ServiceStatusCard'

export default ServiceStatusCard
