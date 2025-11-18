import React from 'react'
import { UncontrolledTabs, TabPane, Card, CardBody } from 'Components'
import { UncontrolledTabsTabContent } from '@/components/UncontrolledTabs/UncontrolledTabsTabContent'
import JwkListPage from './Jwks/JwkListPage'
import { useTranslation } from 'react-i18next'
import SetTitle from 'Utils/SetTitle'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'

function KeysPage(): React.ReactElement {
  const { t } = useTranslation()
  SetTitle(t('titles.public_keys'))

  return (
    <Card style={applicationStyle.mainCard}>
      <CardBody>
        <UncontrolledTabs initialActiveTabId="jwkpanel">
          <UncontrolledTabsTabContent>
            <TabPane tabId="jwkpanel">
              <JwkListPage />
            </TabPane>
          </UncontrolledTabsTabContent>
        </UncontrolledTabs>
      </CardBody>
    </Card>
  )
}

KeysPage.displayName = 'KeysPage'

export default KeysPage
