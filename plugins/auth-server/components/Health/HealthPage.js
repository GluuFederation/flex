import React, { useEffect } from 'react'
import {
  Container,
  CardBody,
  Card,
  CardHeader,
} from '../../../../app/components'
import { useTranslation } from 'react-i18next'

function HealthPage() {
  const { t } = useTranslation()
  useEffect(() => {}, [])
  return (
    <Container>
      <Card className="mb-3">
        <CardBody>
          <Card className="mb-3">
            <CardHeader tag="h6" className="bg-success text-white">
              {t('titles.oauth_server_status_title')}
            </CardHeader>
            <CardBody>{t('messages.oauth_server_status_up')}</CardBody>
          </Card>
          <Card className="mb-3">
            <CardHeader tag="h6" className="bg-success text-white">
              {t('titles.database_status_title')}
            </CardHeader>
            <CardBody>{t('messages.database_status_up')}</CardBody>
          </Card>
        </CardBody>
      </Card>
    </Container>
  )
}

export default HealthPage
