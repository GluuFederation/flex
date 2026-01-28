import React, { useMemo } from 'react'
import { Card, CardHeader, CardBody } from 'Components'
import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import type { ServiceStatusCardProps, ServiceHealth } from '../types'
import { formatServiceName } from '../utils'
import HealthStatusBadge from './HealthStatusBadge'
import customColors from '@/customColors'

function getStatusMessage(service: ServiceHealth, t: TFunction): string {
  if (service.error) {
    return service.error
  }
  switch (service.status) {
    case 'up':
      return t('messages.service_status_up')
    case 'down':
      return t('messages.service_status_down')
    default:
      return t('messages.service_status_unknown')
  }
}

const ServiceStatusCard: React.FC<ServiceStatusCardProps> = ({ service, themeColors }) => {
  const { t } = useTranslation()
  const displayName = formatServiceName(service.name)
  const statusMessage = getStatusMessage(service, t)

  const headerTextColor = useMemo(() => {
    // Use white text on dark background, dark text on light background
    return themeColors.fontColor === customColors.white
      ? customColors.white
      : customColors.primaryDark
  }, [themeColors.fontColor])

  return (
    <Card className="mb-3">
      <CardHeader
        style={{ background: themeColors.background, color: headerTextColor }}
        tag="h6"
        className="d-flex justify-content-between align-items-center"
      >
        <span>{displayName}</span>
        <HealthStatusBadge status={service.status} />
      </CardHeader>
      <CardBody>
        <p
          className={service.error ? 'text-danger mb-0' : 'mb-0'}
          style={!service.error ? { color: themeColors.fontColor } : undefined}
        >
          {statusMessage}
        </p>
      </CardBody>
    </Card>
  )
}

export default ServiceStatusCard
