import React from 'react'
import AuthNListPage from './AuthNListPage'
import { useTranslation } from 'react-i18next'
import GluuTabs from 'Routes/Apps/Gluu/GluuTabs'
import { Card } from 'Components'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import AgamaListPage from '../Agama/AgamaListPage'
import AliasesListPage from '../Agama/AgamaAliasListPage'
import ScriptsListPage from './ScriptsListPage'
import LdapListingPage from './LdapListingPage'

function AuthNPage() {
  const { t } = useTranslation()

  const tabNames = [
    {
      name: t('menus.basic'),
      path: '',
    },
    { name: t('menus.default_acr'), path: '' },
    {
      name: t('menus.aliases'),
      path: '',
    },
    {
      name: t('menus.agama_flows'),
      path: '',
    },
    {
      name: t('menus.scripts'),
      path: '',
    },
    {
      name: t('menus.ldap_servers'),
      path: '',
    },
  ]

  const tabToShow = (tabName) => {
    switch (tabName) {
      case t('menus.basic'):
        return <AuthNListPage isBuiltIn={true} />
      case t('menus.default_acrs'):
        return <AuthNListPage />
      case t('menus.aliases'):
        return <AliasesListPage />
      case t('menus.agama_flows'):
        return <AgamaListPage />
      case t('menus.scripts'):
        return <ScriptsListPage />
      case t('menus.ldap_servers'):
        return <LdapListingPage />
    }
  }

  return (
    <Card className="mb-3" style={applicationStyle.mainCard}>
      <GluuTabs tabNames={tabNames} tabToShow={tabToShow} withNavigation={true} />
    </Card>
  )
}

export default AuthNPage
