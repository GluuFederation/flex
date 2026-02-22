import React, { useMemo, memo } from 'react'
import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import { GluuBadge } from 'Components'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import customColors from '@/customColors'
import { REGEX_TRAILING_PERIOD } from '@/utils/regex'
import type { ServiceStatusCardProps, ServiceHealth } from '../types'
import { formatServiceName } from '../utils'
import { STATUS_LABEL_KEYS } from '../constants'
import { useStyles } from './ServiceStatusCard.style'

const getStatusMessage = (service: ServiceHealth, t: TFunction): string => {
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

const ServiceStatusCard: React.FC<ServiceStatusCardProps> = memo(({ service, isDark }) => {
  const { t } = useTranslation()
  const { classes } = useStyles({ isDark })
  const displayName = useMemo(() => formatServiceName(service.name), [service.name])
  const statusMessage = useMemo(
    () => getStatusMessage(service, t).replace(REGEX_TRAILING_PERIOD, ''),
    [service, t],
  )

  const badgeColors = useMemo(() => {
    switch (service.status) {
      case 'up':
        return {
          bg: isDark ? customColors.statusActive : customColors.statusActiveBg,
          text: isDark ? customColors.white : customColors.statusActive,
        }
      case 'down':
        return {
          bg: isDark ? customColors.statusInactive : customColors.statusInactiveBg,
          text: isDark ? customColors.white : customColors.statusInactive,
        }
      case 'degraded':
      case 'unknown':
      default:
        return {
          bg: isDark ? customColors.statusInactive : customColors.statusInactiveBg,
          text: isDark ? customColors.white : customColors.statusInactive,
        }
    }
  }, [service.status, isDark])

  return (
    <div className={classes.card} data-testid={`service-card-${service.name}`}>
      <div className={classes.content}>
        <div className={classes.textContainer}>
          <GluuText
            variant="div"
            className={classes.serviceName}
            data-testid={`service-name-${service.name}`}
          >
            {displayName}
          </GluuText>
          <GluuText variant="div" className={classes.serviceMessage}>
            {statusMessage}
          </GluuText>
        </div>
        <div className={classes.statusBadge} data-testid={`service-status-${service.name}`}>
          <GluuBadge
            size="md"
            backgroundColor={badgeColors.bg}
            textColor={badgeColors.text}
            borderColor={badgeColors.bg}
          >
            {t(STATUS_LABEL_KEYS[service.status])}
          </GluuBadge>
        </div>
      </div>
    </div>
  )
})

ServiceStatusCard.displayName = 'ServiceStatusCard'

export default ServiceStatusCard
