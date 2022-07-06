import React from 'react'
import {
  UncontrolledTabs,
  TabPane,
  Card,
  CardBody,
} from 'Components'
import JwksPage from './Jwks/JwksPage'
import { useTranslation } from 'react-i18next'
import SetTitle from 'Utils/SetTitle'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'

function KeysPage() {
  const { t } = useTranslation()
  SetTitle(t('titles.public_keys'))

  return (
    <Card style={applicationStyle.mainCard}>
      <CardBody>
        <UncontrolledTabs initialActiveTabId="jwkpanel">
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
