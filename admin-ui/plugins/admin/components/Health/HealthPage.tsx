import React, { useCallback } from 'react'
import { Container, CardBody, Card, Button, Row, Col, Alert } from 'Components'
import { useTranslation } from 'react-i18next'
import SetTitle from 'Utils/SetTitle'
import { useTheme } from 'Context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { useHealthStatus } from './hooks'
import ServiceStatusCard from './components/ServiceStatusCard'
import GluuText from 'Routes/Apps/Gluu/GluuText'

const HealthPage: React.FC = () => {
  const { t } = useTranslation()
  SetTitle(t('titles.services_health'))

  const { state } = useTheme()
  const themeColors = getThemeColor(state.theme)

  const { services, healthyCount, totalCount, isLoading, isFetching, isError, refetch } =
    useHealthStatus()

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
                <GluuText variant="h4" className="mb-0" onLightSurface>
                  {t('titles.services_health')}
                </GluuText>
                {!isLoading && !isError && totalCount > 0 && (
                  <GluuText variant="small" secondary onLightSurface style={{ opacity: 0.9 }}>
                    {t('messages.services_healthy_count', { healthyCount, totalCount })}
                  </GluuText>
                )}
              </Col>
              <Col xs="auto">
                <Button color={`primary-${state.theme}`} onClick={handleRefresh} disabled={loading}>
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
