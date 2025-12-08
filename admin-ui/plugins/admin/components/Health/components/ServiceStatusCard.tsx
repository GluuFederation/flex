import React from 'react'
import { Card, CardHeader, CardBody } from 'Components'
import { useTranslation } from 'react-i18next'
import type { ServiceStatusCardProps } from '../types'
import HealthStatusBadge from './HealthStatusBadge'

function formatServiceName(name: string): string {
  return name
    .split(/[_-]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

const ServiceStatusCard: React.FC<ServiceStatusCardProps> = ({ service, themeColors }) => {
  const { t } = useTranslation()
  const displayName = formatServiceName(service.name)

  const getStatusMessage = () => {
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
        <p className={service.error ? 'text-danger mb-0' : 'mb-0'}>{getStatusMessage()}</p>
      </CardBody>
    </Card>
  )
}

export default ServiceStatusCard
