import React from 'react'
import GluuTabs from 'Routes/Apps/Gluu/GluuTabs'
import { Card } from 'Components'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import AgamaListPage from '../Agama/AgamaListPage'
import AliasesListPage from '../Agama/AgamaAliasListPage'
import ScriptsListPage from './ScriptsListPage'
import LdapListingPage from './LdapListingPage'
import Basic from './Basic'
import DefaultAcr from './DefaultAcr'

function AuthNPage() {
  const tabNames = [
    { name: 'default acr', path: '' },
    { name: 'basic', path: '' },
    { name: 'ldap servers', path: '' },
    { name: 'scripts', path: '' },
    { name: 'aliases', path: '' },
    { name: 'agama flows', path: '' },
  ]

  const tabToShow = (tabName) => {
    switch (tabName) {
      case 'default acr':
        return <DefaultAcr />
      case 'basic':
        return <Basic />
      case 'ldap servers':
        return <LdapListingPage />
      case 'scripts':
        return <ScriptsListPage />
      case 'aliases':
        return <AliasesListPage />
      case 'agama flows':
        return <AgamaListPage />
      default:
        return <DefaultAcr />
    }
  }

  return (
    <Card className="mb-3" style={applicationStyle.mainCard}>
      <GluuTabs tabNames={tabNames} tabToShow={tabToShow} withNavigation={true} />
    </Card>
  )
}

export default AuthNPage
