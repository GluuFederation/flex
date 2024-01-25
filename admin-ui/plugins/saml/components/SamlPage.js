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
  const { loadingSamlIdp, loading } = useSelector(
    (state) => state.idpSamlReducer
  )

  SetTitle(t('titles.saml_management'))

  const tabNames = [
    { name: t('menus.idp_config'), path: '/saml/config' },
    { name: t('menus.saml_idp'), path: '/saml/idp' },
    { name: t('menus.trust_relationships'), path: '/saml/trust-relationship' },
  ]

  const tabToShow = (tabName) => {
    switch (tabName) {
      case t('menus.saml_idp'):
        return <SamlIdentityList />
      case t('menus.idp_config'):
        return <IdpConfigTab />
      case t('menus.trust_relationships'):
        return <TrustRelationshipList />
    }
  }

  return (
    <GluuLoader blocking={loadingSamlIdp || loading}>
      <Card className='mb-3' style={applicationStyle.mainCard}>
        <CardBody>
          <GluuTabs
            tabNames={tabNames}
            tabToShow={tabToShow}
            withNavigation={true}
          />
        </CardBody>
      </Card>
    </GluuLoader>
  )
}

export default SamlPage
