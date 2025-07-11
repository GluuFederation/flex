import React from 'react'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { Card, CardBody } from 'Components'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuTabs from 'Routes/Apps/Gluu/GluuTabs'
import SetTitle from 'Utils/SetTitle'
import { useTranslation } from 'react-i18next'
import IdpConfigTab from './IdpConfigTab'
import SamlIdentityList from './SamlIdentityList'
import { useSelector } from 'react-redux'
import TrustRelationshipList from './TrustRelationshipList'

const SamlPage = () => {
  const { t } = useTranslation()
  const { loadingSamlIdp, loading } = useSelector((state) => state.idpSamlReducer)

  SetTitle(t('titles.saml_management'))

  const tabNames = [
    { name: t('menus.configuration'), path: '/saml/config' },
    { name: t('menus.identity_providers'), path: '/saml/identity-providers' },
    { name: t('menus.service_providers'), path: '/saml/service-providers' },
  ]

  const tabToShow = (tabName) => {
    switch (tabName) {
      case t('menus.configuration'):
        return <IdpConfigTab />
      case t('menus.identity_providers'):
        return <SamlIdentityList />
      case t('menus.service_providers'):
        return <TrustRelationshipList />
    }
  }

  return (
    <GluuLoader blocking={loadingSamlIdp || loading}>
      <Card className="mb-3" style={applicationStyle.mainCard}>
        <CardBody>
          <GluuTabs tabNames={tabNames} tabToShow={tabToShow} withNavigation={true} />
        </CardBody>
      </Card>
    </GluuLoader>
  )
}

export default SamlPage
