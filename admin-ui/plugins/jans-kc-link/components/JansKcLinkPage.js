import React, { useEffect } from 'react'
import SetTitle from 'Utils/SetTitle'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { Card, CardBody } from 'Components'
import GluuTabs from 'Routes/Apps/Gluu/GluuTabs'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { useDispatch, useSelector } from 'react-redux'
import { getConfiguration } from 'Plugins/jans-kc-link/redux/features/JansKcLinkSlice'
import { useTranslation } from 'react-i18next'
import BasicConfiguration from './Tabs/BasicConfiguration'
import InumConfiguration from './Tabs/InumConfiguration'
import Sources from './Tabs/Sources'
import TargetConfiguration from './Tabs/TargetConfiguration'
import KeycloackConfiguration from './Tabs/KeycloackConfiguration'

const JansKcLinkPage = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const isLoading = useSelector((state) => state.jansKcLinkReducer.loading)
  SetTitle(t('titles.jans_kc_ink'))

  useEffect(() => {
    dispatch(getConfiguration())
  }, [])

  const tabNames = [
    {
      name: t('menus.basic_configuration'),
      path: '/jans-kc-link/basic-configuration',
    },
    {
      name: t('menus.inum_configuration'),
      path: '/jans-kc-link/inum-configuration',
    },
    {
      name: t('menus.sources'),
      path: '/jans-kc-link/sources',
    },
    {
      name: t('menus.target_configuration'),
      path: '/jans-kc-link/target-configuration',
    },
    {
      name: t('menus.keycloack_configuration'),
      path: '/jans-kc-link/keycloack-configuration',
    },
  ]

  const tabToShow = (tabName) => {
    switch (tabName) {
      case t('menus.basic_configuration'):
        return <BasicConfiguration />
      case t('menus.inum_configuration'):
        return <InumConfiguration />
      case t('menus.sources'):
        return <Sources />
      case t('menus.target_configuration'):
        return <TargetConfiguration />
      case t('menus.keycloack_configuration'):
        return <KeycloackConfiguration />
    }
  }

  return (
    <GluuLoader blocking={isLoading}>
      <Card className='mb-3' style={applicationStyle.mainCard}>
        <CardBody>
          {!isLoading && (
            <GluuTabs
              tabNames={tabNames}
              tabToShow={tabToShow}
              withNavigation={true}
            />
          )}
        </CardBody>
      </Card>
    </GluuLoader>
  )
}

export default JansKcLinkPage