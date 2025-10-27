import React from 'react'
import AuthNListPage from './AuthNListPage'
import { useTranslation } from 'react-i18next'
import GluuTabs from 'Routes/Apps/Gluu/GluuTabs'
import { Card } from 'Components'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'

import AgamaListPage from '../Agama/AgamaListPage'
import AliasesListPage from '../Agama/AgamaAliasListPage'
import DefaultAcr from './DefaultAcr'

function AuthNPage() {
  const { t } = useTranslation()

  const tabNames = [
    { name: 'default acr', path: '' },
    {
      name: t('menus.builtIn'),
      path: '',
    },
    { name: t('menus.acrs'), path: '' },
    {
      name: t('menus.aliases'),
      path: '',
    },
    {
      name: t('menus.agama_flows'),
      path: '',
    },
  ]

  const tabToShow = (tabName) => {
    switch (tabName) {
      case 'default acr':
        return <DefaultAcr />
      case t('menus.builtIn'):
        return <AuthNListPage isBuiltIn={true} />
      case t('menus.acrs'):
        return <AuthNListPage />
      case t('menus.aliases'):
        return <AliasesListPage />
      case t('menus.agama_flows'):
        return <AgamaListPage />
    }
  }

  return (
    <Card className="mb-3" style={applicationStyle.mainCard}>
      <GluuTabs tabNames={tabNames} tabToShow={tabToShow} withNavigation={true} />
    </Card>
  )
}

export default AuthNPage
