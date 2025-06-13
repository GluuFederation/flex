import React from 'react'
import {
  UncontrolledTabs,
  TabPane,
  Card,
  CardBody,
} from 'Components'
import { UncontrolledTabsTabContent } from 'Components/UncontrolledTabs/UncontrolledTabsTabContent'
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
          <UncontrolledTabsTabContent>
            <TabPane tabId="jwkpanel">
              <JwksPage />
            </TabPane>
          </UncontrolledTabsTabContent>
        </UncontrolledTabs>
      </CardBody>
    </Card>
  )
}

export default KeysPage
