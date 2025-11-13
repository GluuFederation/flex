import React, { useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import { Card, CardBody } from 'Components'
import GluuTabs from 'Routes/Apps/Gluu/GluuTabs'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import StaticConfiguration from './StaticConfiguration'
import DynamicConfiguration from './DynamicConfiguration'
import SetTitle from 'Utils/SetTitle'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { fidoConstants, createFidoConfigPayload, getModifiedFields } from '../helper'
import {
  useGetPropertiesFido2,
  usePutPropertiesFido2,
  getGetPropertiesFido2QueryKey,
} from 'JansConfigApi'
import { updateToast } from 'Redux/features/toastSlice'
import { useDispatch, useSelector } from 'react-redux'
import { DynamicConfigFormValues, StaticConfigFormValues } from '../types/fido'
import { logAudit } from 'Utils/AuditLogger'
import { AuthRootState } from 'Utils/types'
import { useCedarling } from '@/cedarling'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'

const Fido: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const token = useSelector((state: AuthRootState) => state.authReducer.token.access_token)
  const userinfo = useSelector((state: AuthRootState) => state.authReducer.userinfo)
  const client_id = useSelector((state: AuthRootState) => state.authReducer.config.clientId)
  const ip_address = useSelector((state: AuthRootState) => state.authReducer.location.IPv4)

  const { hasCedarReadPermission, hasCedarWritePermission, authorizeHelper } = useCedarling()
  const fidoResourceId = useMemo(() => ADMIN_UI_RESOURCES.FIDO, [])
  const fidoScopes = useMemo(() => CEDAR_RESOURCE_SCOPES[fidoResourceId], [fidoResourceId])
  const canReadFido = useMemo(
    () => hasCedarReadPermission(fidoResourceId) === true,
    [hasCedarReadPermission, fidoResourceId],
  )
  const canWriteFido = useMemo(
    () => hasCedarWritePermission(fidoResourceId) === true,
    [hasCedarWritePermission, fidoResourceId],
  )

  useEffect(() => {
    authorizeHelper(fidoScopes)
  }, [authorizeHelper, fidoScopes])

  const { data: fidoConfiguration, isLoading } = useGetPropertiesFido2()
  const putFidoMutation = usePutPropertiesFido2({
    mutation: {
      onSuccess: () => {
        dispatch(updateToast(true, 'success', t('messages.fido_config_updated_successfully')))
        queryClient.invalidateQueries({ queryKey: getGetPropertiesFido2QueryKey() })
      },
      onError: (error: unknown) => {
        const err = error as { response?: { data?: { message?: string } } }
        const errorMessage = err?.response?.data?.message || t('messages.fido_config_update_failed')
        dispatch(updateToast(true, 'error', errorMessage))
      },
    },
  })

  SetTitle(t('titles.fido_management'))

  const handleConfigSubmit = useCallback(
    (
      data: DynamicConfigFormValues | StaticConfigFormValues,
      type: string,
      userMessage?: string,
    ) => {
      if (!canWriteFido) {
        return
      }
      if (!fidoConfiguration) {
        dispatch(updateToast(true, 'error', t('messages.no_configuration_loaded')))
        return
      }

      const apiPayload = createFidoConfigPayload({
        fidoConfiguration,
        data,
        type,
      })
      const configType = type === fidoConstants.STATIC ? 'Static' : 'Dynamic'
      const originalConfig =
        type === fidoConstants.STATIC ? fidoConfiguration?.fido2Configuration : fidoConfiguration
      const modifiedFieldsOnly = getModifiedFields(data, originalConfig, type)

      putFidoMutation.mutate(apiPayload, {
        onSuccess: () => {
          logAudit({
            token,
            userinfo,
            action: 'UPDATE',
            resource: 'FIDO',
            message: userMessage || `FIDO ${configType} configuration updated successfully`,
            payload: data,
            status: 'success',
            client_id,
            ip_address,
            modifiedFields: modifiedFieldsOnly,
          }).catch((auditError) => {
            console.error('Audit logging failed:', auditError)
          })
        },
      })
    },
    [
      fidoConfiguration,
      putFidoMutation,
      dispatch,
      t,
      token,
      userinfo,
      client_id,
      ip_address,
      canWriteFido,
    ],
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
              handleSubmit={(data: StaticConfigFormValues, userMessage?: string) =>
                handleConfigSubmit(data, fidoConstants.STATIC, userMessage)
              }
              fidoConfiguration={fidoConfiguration}
              isSubmitting={isSubmitting}
              readOnly={!canWriteFido}
            />
          )
        case t('menus.dynamic_configuration'):
          return (
            <DynamicConfiguration
              handleSubmit={(data: DynamicConfigFormValues, userMessage?: string) =>
                handleConfigSubmit(data, fidoConstants.DYNAMIC, userMessage)
              }
              fidoConfiguration={fidoConfiguration}
              isSubmitting={isSubmitting}
              readOnly={!canWriteFido}
            />
          )
        default:
          return null
      }
    },
    [t, handleConfigSubmit, fidoConfiguration, isLoading, putFidoMutation.isPending, canWriteFido],
  )

  if (!canReadFido) {
    return <GluuLoader blocking={isLoading} />
  }

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
