import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
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
  getGetPropertiesFido2QueryKey,
} from 'JansConfigApi'
import { updateToast } from 'Redux/features/toastSlice'
import { useDispatch } from 'react-redux'
import { DynamicConfigFormValues, StaticConfigFormValues } from '../types/fido-types'

const Fido: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const queryClient = useQueryClient()

  // React Query hooks
  const { data: fidoConfiguration, isLoading } = useGetPropertiesFido2()
  const putFidoMutation = usePutPropertiesFido2({
    mutation: {
      onSuccess: () => {
        dispatch(updateToast(true, 'success', t('messages.fido_config_updated_successfully')))
        // Invalidate cache to trigger automatic refetch
        queryClient.invalidateQueries({ queryKey: getGetPropertiesFido2QueryKey() })
      },
      onError: (error) => {
        const errorMessage =
          error?.response?.data?.message || t('messages.fido_config_update_failed')
        dispatch(updateToast(true, 'error', errorMessage))
      },
    },
  })

  SetTitle(t('titles.fido_management'))

  // Single unified submit handler for both configurations
  const handleConfigSubmit = useCallback(
    (data: DynamicConfigFormValues | StaticConfigFormValues, type: string) => {
      if (!fidoConfiguration) {
        dispatch(updateToast(true, 'error', t('messages.no_configuration_loaded')))
        return
      }

      const apiPayload = createFidoConfigPayload({
        fidoConfiguration,
        data,
        type,
      })

      putFidoMutation.mutate(apiPayload)
    },
    [fidoConfiguration, putFidoMutation, dispatch, t],
  )

  const tabNames = [
    { name: t('menus.static_configuration'), path: '/fido/fidomanagement/static-configuration' },
    { name: t('menus.dynamic_configuration'), path: '/fido/fidomanagement/dynamic-configuration' },
  ]

  const tabToShow = useCallback(
    (tabName: string) => {
      const isSubmitting = putFidoMutation.isPending

      switch (tabName) {
        case t('menus.static_configuration'):
          return (
            <StaticConfiguration
              handleSubmit={(data) => handleConfigSubmit(data, fidoConstants.STATIC)}
              fidoConfiguration={fidoConfiguration}
              loading={isLoading}
              isSubmitting={isSubmitting}
            />
          )
        case t('menus.dynamic_configuration'):
          return (
            <DynamicConfiguration
              handleSubmit={(data) => handleConfigSubmit(data, fidoConstants.DYNAMIC)}
              fidoConfiguration={fidoConfiguration}
              loading={isLoading}
              isSubmitting={isSubmitting}
            />
          )
        default:
          return null
      }
    },
    [t, handleConfigSubmit, fidoConfiguration, isLoading, putFidoMutation.isPending],
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
