import React from 'react'
import GluuTabs from 'Routes/Apps/Gluu/GluuTabs'
import { Card } from 'Components'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import AgamaListPage from '../Agama/AgamaListPage'
import AliasesListPage from '../Agama/AgamaAliasListPage'
import ScriptsListPage from './ScriptsListPage'
import LdapListingPage from './LdapListingPage'
import BuiltIn from './BuiltIn'
import DefaultAcr from './DefaultAcr'

function AuthNPage() {
  const tabNames = [
    {
      name: 'basic',
      path: '',
    },
    { name: 'default acr', path: '' },
    {
      name: 'aliases',
      path: '',
    },
    {
      name: 'agama flows',
      path: '',
    },
    {
      name: 'scripts',
      path: '',
    },
    {
      name: 'ldap servers',
      path: '',
    },
  ]

  const tabToShow = (tabName) => {
    switch (tabName) {
      case 'basic':
        return <BuiltIn />
      case 'default acr':
        return <DefaultAcr />
      case 'aliases':
        return <AliasesListPage />
      case 'agama flows':
        return <AgamaListPage />
      case 'scripts':
        return <ScriptsListPage />
      case 'ldap servers':
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
