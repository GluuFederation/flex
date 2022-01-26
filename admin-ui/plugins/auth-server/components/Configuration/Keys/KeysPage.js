import React from 'react'
import {
  UncontrolledTabs,
  NavItem,
  Nav,
  TabPane,
  Card,
  CardBody,
} from '../../../../../app/components'
import JwksPage from './Jwks/JwksPage'
import { useTranslation } from 'react-i18next'
import GluuRibbon from '../../../../../app/routes/Apps/Gluu/GluuRibbon'

function KeysPage() {
  const { t } = useTranslation()
  return (
    <Card>
      <CardBody>
        <UncontrolledTabs initialActiveTabId="jwkpanel">
          <Nav pills className="mb-4 flex-column flex-md-row mt-4 mt-lg-0">
            <NavItem>
              <UncontrolledTabs.NavLink tabId="jwkpanel">
                <GluuRibbon title={t('titles.public_keys')} fromLeft />
              </UncontrolledTabs.NavLink>
            </NavItem>
          </Nav>
          <UncontrolledTabs.TabContent>
            <TabPane tabId="jwkpanel">
              <JwksPage />
            </TabPane>
          </UncontrolledTabs.TabContent>
        </UncontrolledTabs>
      </CardBody>
    </Card>
  )
}

export default KeysPage
