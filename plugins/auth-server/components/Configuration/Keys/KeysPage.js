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

function KeysPage() {
  const { t } = useTranslation()
  return (
    <Card>
      <CardBody>
        <UncontrolledTabs initialActiveTabId="jwkpanel">
          <Nav pills className="mb-4 flex-column flex-md-row mt-4 mt-lg-0">
            <NavItem>
              <UncontrolledTabs.NavLink tabId="jwkpanel">
                {t("JWK Keys")}
              </UncontrolledTabs.NavLink>
            </NavItem>
            <NavItem>
              <UncontrolledTabs.NavLink tabId="algorithmickeyspanel">
                {t("Algorithmic Keys")}
              </UncontrolledTabs.NavLink>
            </NavItem>
            <NavItem>
              <UncontrolledTabs.NavLink tabId="privatekeyspanel">
                {t("Private Keys")}
              </UncontrolledTabs.NavLink>
            </NavItem>
            <NavItem>
              <UncontrolledTabs.NavLink tabId="publickeyspanel">
                {t("Public Keys")}
              </UncontrolledTabs.NavLink>
            </NavItem>
          </Nav>
          <UncontrolledTabs.TabContent>
            <TabPane tabId="jwkpanel">
              <JwksPage />
            </TabPane>
            <TabPane tabId="otherpanel">
              <div>{t("Not implemented yet")}</div>
            </TabPane>
            <TabPane tabId="algorithmickeyspanel">
              <div>{t("Not implemented yet")}</div>
            </TabPane>
            <TabPane tabId="privatekeyspanel">
              <div>{t("Not implemented yet")}</div>
            </TabPane>
            <TabPane tabId="publickeyspanel">
              <div>{t("Not implemented yet")}</div>
            </TabPane>
          </UncontrolledTabs.TabContent>
        </UncontrolledTabs>
      </CardBody>
    </Card>
  )
}

export default KeysPage
