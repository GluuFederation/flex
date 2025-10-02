import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardBody } from 'Components'
import GluuTabs from 'Routes/Apps/Gluu/GluuTabs'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import StaticConfiguration from './StaticConfiguration'
import DynamicConfiguration from './DynamicConfiguration'
import SetTitle from 'Utils/SetTitle'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { fidoConstants, createFidoConfigPayload } from '../helper'
import {
  useGetPropertiesFido2,
  usePutPropertiesFido2,
} from '../../../jans_config_api_orval/src/JansConfigApi'
import { updateToast } from 'Redux/features/toastSlice'
import { useDispatch } from 'react-redux'
import { DynamicConfigFormValues, StaticConfigFormValues } from '../types/fido-types'

const Fido: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  // React Query hooks
  const { data: fidoConfiguration, isLoading, refetch } = useGetPropertiesFido2()
  const putFidoMutation = usePutPropertiesFido2()

  SetTitle(t('titles.fido_management'))

  const handleDynamicConfigurationSubmit = useCallback(
    (data: DynamicConfigFormValues) => {
      if (!fidoConfiguration) return

      const apiPayload = createFidoConfigPayload({
        fidoConfiguration,
        data,
        type: fidoConstants.DYNAMIC,
      })

      putFidoMutation.mutate(apiPayload, {
        onSuccess: () => {
          dispatch(updateToast(true, 'success'))
          refetch()
        },
        onError: () => {
          dispatch(updateToast(true, 'error'))
        },
      })
    },
    [fidoConfiguration, putFidoMutation, dispatch, refetch],
  )

  const handleStaticConfigurationSubmit = useCallback(
    (data: StaticConfigFormValues) => {
      if (!fidoConfiguration) return

      const apiPayload = createFidoConfigPayload({
        fidoConfiguration,
        data,
        type: fidoConstants.STATIC,
      })

      putFidoMutation.mutate(apiPayload, {
        onSuccess: () => {
          dispatch(updateToast(true, 'success'))
          refetch()
        },
        onError: () => {
          dispatch(updateToast(true, 'error'))
        },
      })
    },
    [fidoConfiguration, putFidoMutation, dispatch, refetch],
  )

  const tabNames = [
    { name: t('menus.static_configuration'), path: '/fido/fidomanagement/static-configuration' },
    { name: t('menus.dynamic_configuration'), path: '/fido/fidomanagement/dynamic-configuration' },
  ]

  const tabToShow = useCallback(
    (tabName: string) => {
      switch (tabName) {
        case t('menus.static_configuration'):
          return (
            <StaticConfiguration
              handleSubmit={handleStaticConfigurationSubmit}
              fidoConfiguration={fidoConfiguration}
              loading={isLoading || putFidoMutation.isPending}
            />
          )
        case t('menus.dynamic_configuration'):
          return (
            <DynamicConfiguration
              handleSubmit={handleDynamicConfigurationSubmit}
              fidoConfiguration={fidoConfiguration}
              loading={isLoading || putFidoMutation.isPending}
            />
          )
        default:
          return null
      }
    },
    [
      t,
      handleStaticConfigurationSubmit,
      handleDynamicConfigurationSubmit,
      fidoConfiguration,
      isLoading,
      putFidoMutation.isPending,
    ],
  )

  return (
    <GluuLoader blocking={isLoading}>
      <Card className="mb-3" style={applicationStyle.mainCard}>
        <CardBody>
          {!isLoading && (
            <GluuTabs tabNames={tabNames} tabToShow={tabToShow} withNavigation={true} />
          )}
        </CardBody>
      </Card>
    </GluuLoader>
  )
}

export default Fido
