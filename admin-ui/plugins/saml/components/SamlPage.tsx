import React, { useMemo, useCallback } from 'react'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { Card, CardBody } from 'Components'
import GluuTabs from 'Routes/Apps/Gluu/GluuTabs'
import SetTitle from 'Utils/SetTitle'
import { useTranslation } from 'react-i18next'
import { ROUTES } from '@/helpers/navigation'
import SamlConfigurationForm from './SamlConfigurationForm'
import WebsiteSsoIdentityBrokeringList from './WebsiteSsoIdentityBrokeringList'
import WebsiteSsoServiceProviderList from './WebsiteSsoServiceProviderList'

const SamlPage = React.memo(() => {
  const { t } = useTranslation()

  SetTitle(t('titles.saml_management'))

  const tabNames = useMemo(
    () => [
      { name: t('menus.configuration'), path: ROUTES.SAML_CONFIG },
      { name: t('menus.identity_providers'), path: ROUTES.SAML_IDP_LIST },
      { name: t('menus.service_providers'), path: ROUTES.SAML_SP_LIST },
    ],
    [t],
  )

  const tabToShow = useCallback(
    (tabName: string) => {
      switch (tabName) {
        case t('menus.configuration'):
          return <SamlConfigurationForm />
        case t('menus.identity_providers'):
          return <WebsiteSsoIdentityBrokeringList />
        case t('menus.service_providers'):
          return <WebsiteSsoServiceProviderList />
        default:
          return null
      }
    },
    [t],
  )

  return (
    <Card className="mb-3" style={applicationStyle.mainCard}>
      <CardBody>
        <GluuTabs tabNames={tabNames} tabToShow={tabToShow} withNavigation={true} />
      </CardBody>
    </Card>
  )
})

SamlPage.displayName = 'SamlPage'

export default SamlPage
