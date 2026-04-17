import { useCallback, useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '@/redux/hooks'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { updateToast } from 'Redux/features/toastSlice'
import { getQueryErrorMessage } from '@/utils/errorHandler'
import {
  useGetPropertiesFido2,
  usePutPropertiesFido2,
  getGetPropertiesFido2QueryKey,
} from 'JansConfigApi'
import { logAudit } from 'Utils/AuditLogger'
import { fidoConstants, createFidoConfigPayload, getModifiedFields } from '../helper'
import type { ApiErrorResponse } from '../types/fido'
import type { UpdateFidoParams } from '../types'
import { DEFAULT_STALE_TIME, DEFAULT_GC_TIME } from 'Utils/queryUtils'
import { devLogger } from '@/utils/devLogger'

const FIDO_CACHE_CONFIG = {
  STALE_TIME: DEFAULT_STALE_TIME,
  GC_TIME: DEFAULT_GC_TIME,
}

export const useFidoConfig = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const hasSession = useAppSelector((state) => state.authReducer?.hasSession)

  const query = useGetPropertiesFido2({
    query: {
      enabled: hasSession === true,
      staleTime: FIDO_CACHE_CONFIG.STALE_TIME,
      gcTime: FIDO_CACHE_CONFIG.GC_TIME,
    },
  })

  useEffect(() => {
    if (!query.isError) return
    const errorMsg = getQueryErrorMessage(query.error, t('messages.error_in_loading'))
    dispatch(updateToast(true, 'error', errorMsg))
  }, [query.isError, query.error, dispatch, t])

  return query
}

export const useUpdateFidoConfig = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const userinfo = useAppSelector((state) => state.authReducer?.userinfo)
  const clientId = useAppSelector((state) => state.authReducer?.config?.clientId)
  const ipAddress = useAppSelector((state) => state.authReducer?.location?.IPv4)
  const { data: fidoConfiguration } = useFidoConfig()

  const baseMutation = usePutPropertiesFido2({
    mutation: {
      onSuccess: () => {
        dispatch(updateToast(true, 'success', t('messages.fido_config_updated_successfully')))
        queryClient.invalidateQueries({ queryKey: getGetPropertiesFido2QueryKey() })
      },
      onError: (error: ApiErrorResponse) => {
        const errorMessage =
          error?.response?.data?.message || t('messages.fido_config_update_failed')
        dispatch(updateToast(true, 'error', errorMessage))
      },
    },
  })

  const mutate = useCallback(
    (params: UpdateFidoParams) => {
      const { data, type, userMessage } = params

      if (!fidoConfiguration) {
        dispatch(updateToast(true, 'error', t('messages.no_configuration_loaded')))
        return
      }

      const apiPayload = createFidoConfigPayload({ fidoConfiguration, data, type })
      const configType = type === fidoConstants.STATIC ? 'Static' : 'Dynamic'
      const originalConfig =
        type === fidoConstants.STATIC ? fidoConfiguration?.fido2Configuration : fidoConfiguration
      const modifiedFieldsOnly = getModifiedFields(data, originalConfig, type)

      baseMutation.mutate(apiPayload, {
        onSuccess: () => {
          logAudit({
            userinfo,
            action: 'UPDATE',
            resource: 'FIDO',
            message: userMessage || `FIDO ${configType} configuration updated successfully`,
            payload: data,
            status: 'success',
            client_id: clientId,
            ip_address: ipAddress,
            modifiedFields: modifiedFieldsOnly,
          }).catch((auditError) => {
            devLogger.error('Audit logging failed:', auditError)
          })
        },
      })
    },
    [fidoConfiguration, baseMutation, dispatch, t, userinfo, clientId, ipAddress],
  )

  return {
    ...baseMutation,
    mutate,
  }
}
