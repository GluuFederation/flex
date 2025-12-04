import React, { useMemo, useEffect } from 'react'
import { UncontrolledTabs, TabPane, Card, CardBody } from 'Components'
import { UncontrolledTabsTabContent } from '@/components/UncontrolledTabs/UncontrolledTabsTabContent'
import JwkListPage from './Jwks/JwkListPage'
import { useTranslation } from 'react-i18next'
import SetTitle from 'Utils/SetTitle'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { useCedarling } from '@/cedarling'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import GluuFormFooter from 'Routes/Apps/Gluu/GluuFormFooter'

const KeysPage: React.FC = () => {
  const { t } = useTranslation()
  const { hasCedarReadPermission, authorizeHelper } = useCedarling()

  const keysResourceId = ADMIN_UI_RESOURCES.Keys
  const keysScopes = useMemo(() => CEDAR_RESOURCE_SCOPES[keysResourceId] || [], [keysResourceId])

  const canReadKeys = useMemo(
    () => hasCedarReadPermission(keysResourceId),
    [hasCedarReadPermission, keysResourceId],
  )

  useEffect(() => {
    authorizeHelper(keysScopes)
  }, [authorizeHelper, keysScopes])

  SetTitle(t('titles.public_keys'))

  return (
    <GluuViewWrapper canShow={canReadKeys}>
      <Card style={applicationStyle.mainCard}>
        <CardBody>
          <UncontrolledTabs initialActiveTabId="jwkpanel">
            <UncontrolledTabsTabContent>
              <TabPane tabId="jwkpanel">
                <JwkListPage />
              </TabPane>
            </UncontrolledTabsTabContent>
          </UncontrolledTabs>
          <GluuFormFooter showBack={true} showCancel={false} showApply={false} />
        </CardBody>
      </Card>
    </GluuViewWrapper>
  )
}

KeysPage.displayName = 'KeysPage'

export default KeysPage
