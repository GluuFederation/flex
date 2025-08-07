import React, { useContext, useEffect } from 'react'
import { Container, CardBody, Card, CardHeader } from 'Components'
import { useTranslation } from 'react-i18next'
import SetTitle from 'Utils/SetTitle'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from '@/context/theme/config'

function HealthPage() {
  const { t } = useTranslation()
  SetTitle(t('titles.services_health'))
  const theme = useContext(ThemeContext)
  const themeColors = getThemeColor(theme.state.theme)

  return (
    <Container>
      <Card className="mb-3">
        <CardBody>
          <Card className="mb-3">
            <CardHeader
              style={{ background: themeColors.background }}
              tag="h6"
              className="text-white"
            >
              {t('titles.oauth_server_status_title')}
            </CardHeader>
            <CardBody>{t('messages.oauth_server_status_up')}</CardBody>
          </Card>
          <Card className="mb-3">
            <CardHeader
              style={{ background: themeColors.background }}
              tag="h6"
              className="text-white"
            >
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
