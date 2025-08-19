import React, { useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { Card, CardBody } from 'Components'
import GluuTabs from 'Routes/Apps/Gluu/GluuTabs'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'

import StaticConfiguration from './StaticConfiguration'
import DynamicConfiguration from './DynamicConfiguration'

import SetTitle from 'Utils/SetTitle'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'

import { getFidoConfiguration, putFidoConfiguration } from '../redux/features/fidoSlice'
import { fidoConstants, createFidoConfigPayload } from '../helper'

export default function Fido() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const fidoConfiguration = useSelector((state) => state.fidoReducer)

  SetTitle(t('titles.fido_management'))

  useEffect(() => {
    dispatch(getFidoConfiguration())
  }, [dispatch])

  const handleDynamicConfigurationSubmit = useCallback(
    (data) => {
      const apiPayload = createFidoConfigPayload({
        fidoConfiguration,
        data,
        type: fidoConstants.DYNAMIC,
      })
      dispatch(putFidoConfiguration(apiPayload))
    },
    [dispatch, fidoConfiguration],
  )

  const handleStaticConfigurationSubmit = useCallback(
    (data) => {
      const apiPayload = createFidoConfigPayload({
        fidoConfiguration,
        data,
        type: fidoConstants.STATIC,
      })

      dispatch(putFidoConfiguration(apiPayload))
    },
    [dispatch, fidoConfiguration],
  )

  const tabNames = [
    { name: t('menus.static_configuration'), path: '/fido/fidomanagement/static-configuration' },
    { name: t('menus.dynamic_configuration'), path: '/fido/fidomanagement/dynamic-configuration' },
  ]

  const tabToShow = useCallback(
    (tabName) => {
      switch (tabName) {
        case t('menus.static_configuration'):
          return (
            <StaticConfiguration
              handleSubmit={handleStaticConfigurationSubmit}
              fidoConfiguration={fidoConfiguration}
            />
          )
        case t('menus.dynamic_configuration'):
          return (
            <DynamicConfiguration
              handleSubmit={handleDynamicConfigurationSubmit}
              fidoConfiguration={fidoConfiguration}
            />
          )
        default:
          return null
      }
    },
    [t, handleStaticConfigurationSubmit, handleDynamicConfigurationSubmit, fidoConfiguration],
  )

  return (
    <React.Fragment>
      <GluuLoader blocking={fidoConfiguration?.loading}>
        <Card className="mb-3" style={applicationStyle.mainCard}>
          <CardBody>
            {!fidoConfiguration?.loading && (
              <GluuTabs tabNames={tabNames} tabToShow={tabToShow} withNavigation={true} />
            )}
          </CardBody>
        </Card>
      </GluuLoader>
    </React.Fragment>
  )
}
