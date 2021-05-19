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

function KeysPage() {
  return (
    <Card>
      <CardBody>
        <UncontrolledTabs initialActiveTabId="jwkpanel">
          <Nav pills className="mb-4 flex-column flex-md-row mt-4 mt-lg-0">
            <NavItem>
              <UncontrolledTabs.NavLink tabId="jwkpanel">
                JWK Keys
              </UncontrolledTabs.NavLink>
            </NavItem>
            <NavItem>
              <UncontrolledTabs.NavLink tabId="otherpanel">
                Others Keys
              </UncontrolledTabs.NavLink>
            </NavItem>
          </Nav>
          <UncontrolledTabs.TabContent>
            <TabPane tabId="jwkpanel">
              <JwksPage />
            </TabPane>
            <TabPane tabId="otherpanel">
              <div>Not implemented yet</div>
            </TabPane>
          </UncontrolledTabs.TabContent>
        </UncontrolledTabs>
      </CardBody>
    </Card>
  )
}

export default KeysPage
