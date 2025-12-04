import React, { useMemo, useCallback } from 'react'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { Card, CardBody } from 'Components'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuTabs from 'Routes/Apps/Gluu/GluuTabs'
import SetTitle from 'Utils/SetTitle'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import SamlConfigurationForm from './SamlConfigurationForm'
import WebsiteSsoIdentityBrokeringList from './WebsiteSsoIdentityBrokeringList'
import WebsiteSsoServiceProviderList from './WebsiteSsoServiceProviderList'
import type { SamlRootState } from '../types/state'

const SamlPage = React.memo(() => {
  const { t } = useTranslation()
  const { loadingSamlIdp } = useSelector((state: SamlRootState) => state.idpSamlReducer)

  SetTitle(t('titles.saml_management'))

  const tabNames = useMemo(
    () => [
      { name: t('menus.configuration'), path: '/saml/config' },
      { name: t('menus.identity_providers'), path: '/saml/identity-providers' },
      { name: t('menus.service_providers'), path: '/saml/service-providers' },
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
    <GluuLoader blocking={loadingSamlIdp}>
      <Card className="mb-3" style={applicationStyle.mainCard}>
        <CardBody>
          <GluuTabs tabNames={tabNames} tabToShow={tabToShow} withNavigation={true} />
        </CardBody>
      </Card>
    </GluuLoader>
  )
})

SamlPage.displayName = 'SamlPage'

export default SamlPage
