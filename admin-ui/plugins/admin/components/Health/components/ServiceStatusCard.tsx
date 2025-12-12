import React from 'react'
import { Card, CardHeader, CardBody } from 'Components'
import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import type { ServiceStatusCardProps, ServiceHealth } from '../types'
import { formatServiceName } from '../utils'
import HealthStatusBadge from './HealthStatusBadge'

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

const ServiceStatusCard: React.FC<ServiceStatusCardProps> = ({ service, themeColors }) => {
  const { t } = useTranslation()
  const displayName = formatServiceName(service.name)
  const statusMessage = getStatusMessage(service, t)

  return (
    <Card className="mb-3">
      <CardHeader
        style={{ background: themeColors.background }}
        tag="h6"
        className="text-white d-flex justify-content-between align-items-center"
      >
        <span>{displayName}</span>
        <HealthStatusBadge status={service.status} />
      </CardHeader>
      <CardBody>
        <p className={service.error ? 'text-danger mb-0' : 'mb-0'}>{statusMessage}</p>
      </CardBody>
    </Card>
  )
}

export default ServiceStatusCard
