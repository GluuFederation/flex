import React from 'react'
import { UncontrolledTabs, TabPane, Card, CardBody } from 'Components'
import { UncontrolledTabsTabContent } from '@/components/UncontrolledTabs/UncontrolledTabsTabContent'
import JwkListPage from './Jwks/JwkListPage'
import { useTranslation } from 'react-i18next'
import SetTitle from 'Utils/SetTitle'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'

/**
 * Render the public keys configuration page, set the page title, and display the JWK list inside a tab.
 *
 * @returns A React element containing a Card with a tabbed JWK list and the page title set to the localized "public keys" title.
 */
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