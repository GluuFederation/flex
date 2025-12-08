import React, { useContext, useCallback } from 'react'
import { Container, CardBody, Card, Button, Row, Col, Alert } from 'Components'
import { useTranslation } from 'react-i18next'
import SetTitle from 'Utils/SetTitle'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { useHealthStatus } from './hooks'
import ServiceStatusCard from './components/ServiceStatusCard'
import HealthStatusBadge from './components/HealthStatusBadge'

interface ThemeState {
  state: {
    theme: string
  }
}

const HealthPage: React.FC = () => {
  const { t } = useTranslation()
  SetTitle(t('titles.services_health'))

  const theme = useContext(ThemeContext) as ThemeState
  const themeColors = getThemeColor(theme.state.theme)

  const {
    services,
    overallStatus,
    healthyCount,
    totalCount,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useHealthStatus()

  const handleRefresh = useCallback(() => {
    refetch()
  }, [refetch])

  const loading = isLoading || isFetching

  return (
    <GluuLoader blocking={loading}>
      <Container>
        <Card className="mb-3">
          <CardBody>
            <Row className="mb-4 align-items-center">
              <Col>
                <h4 className="mb-0 d-flex align-items-center gap-3">
                  {t('titles.services_health')}
                  {!isLoading && !isError && <HealthStatusBadge status={overallStatus} />}
                </h4>
                {!isLoading && !isError && totalCount > 0 && (
                  <small className="text-muted">
                    {t('messages.services_healthy_count', { healthyCount, totalCount })}
                  </small>
                )}
              </Col>
              <Col xs="auto">
                <Button
                  color={`primary-${theme.state.theme}`}
                  onClick={handleRefresh}
                  disabled={loading}
                >
                  <i className={`fa fa-refresh me-2 ${loading ? 'fa-spin' : ''}`}></i>
                  {t('actions.refresh')}
                </Button>
              </Col>
            </Row>

            {isError && (
              <Alert color="danger" className="mb-4">
                <i className="fa fa-exclamation-triangle me-2"></i>
                {t('messages.error_fetching_health_status')}
              </Alert>
            )}

            {!isLoading && !isError && services.length === 0 && (
              <Alert color="info">
                <i className="fa fa-info-circle me-2"></i>
                {t('messages.no_services_found')}
              </Alert>
            )}

            {services.map((service) => (
              <ServiceStatusCard key={service.name} service={service} themeColors={themeColors} />
            ))}
          </CardBody>
        </Card>
      </Container>
    </GluuLoader>
  )
}

export default HealthPage
