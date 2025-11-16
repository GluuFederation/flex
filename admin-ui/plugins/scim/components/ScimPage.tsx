import React, { useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useQueryClient } from '@tanstack/react-query'
import SetTitle from 'Utils/SetTitle'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import { Card, CardBody } from 'Components'
import ScimConfiguration from './ScimConfiguration'
import { updateToast } from 'Redux/features/toastSlice'
import { useGetScimConfig, usePatchScimConfig, getGetScimConfigQueryKey } from 'JansConfigApi'
import { createJsonPatchFromDifferences } from '../helper'
import type { ScimFormValues } from '../types'
import { logAudit } from 'Utils/AuditLogger'
import { PATCH } from '@/audit/UserActionType'
import type { RootState } from '@/redux/sagas/types/audit'
import type { JsonPatch } from 'JansConfigApi'
import { useCedarling } from '@/cedarling'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'

interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string
    }
  }
}

const isApiError = (error: unknown): error is ApiErrorResponse => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof (error as ApiErrorResponse).response === 'object'
  )
}

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (isApiError(error) && error.response?.data?.message) {
    return error.response.data.message
  }
  return fallback
}

const ScimPage: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const token: string | undefined = useSelector(
    (state: RootState) => state.authReducer?.token?.access_token,
  )
  const userinfo: RootState['authReducer']['userinfo'] | undefined = useSelector(
    (state: RootState) => state.authReducer?.userinfo,
  )
  const client_id: string | undefined = useSelector(
    (state: RootState) => state.authReducer?.config?.clientId,
  )
  SetTitle(t('titles.scim_management'))
  const { hasCedarReadPermission, hasCedarWritePermission, authorizeHelper } = useCedarling()
  const scimResourceId = useMemo(() => ADMIN_UI_RESOURCES.SCIM, [])
  const scimScopes = useMemo(() => CEDAR_RESOURCE_SCOPES[scimResourceId], [scimResourceId])
  const canReadScim = useMemo(
    () => hasCedarReadPermission(scimResourceId) === true,
    [hasCedarReadPermission, scimResourceId],
  )
  const canWriteScim = useMemo(
    () => hasCedarWritePermission(scimResourceId) === true,
    [hasCedarWritePermission, scimResourceId],
  )

  useEffect(() => {
    authorizeHelper(scimScopes)
  }, [authorizeHelper, scimScopes])

  const { data: scimConfiguration, isLoading } = useGetScimConfig()
  const userMessageRef = React.useRef<string>('')

  const patchScimMutation = usePatchScimConfig({
    mutation: {
      onMutate: async (variables: { data: JsonPatch[] }) => {
        await queryClient.cancelQueries({ queryKey: getGetScimConfigQueryKey() })
        const previousConfig = queryClient.getQueryData(getGetScimConfigQueryKey())
        if (previousConfig && scimConfiguration) {
          queryClient.setQueryData(getGetScimConfigQueryKey(), () => {
            return variables.data.reduce(
              (updated, patch: JsonPatch) => {
                if (typeof patch.path !== 'string' || !patch.path.startsWith('/')) {
                  return updated
                }
                const key = patch.path.substring(1)
                switch (patch.op) {
                  case 'replace':
                  case 'add':
                    return { ...updated, [key]: patch.value }
                  case 'remove': {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { [key]: _omit, ...rest } = updated
                    return rest
                  }
                  default:
                    return updated
                }
              },
              { ...scimConfiguration },
            )
          })
        }
        return { previousConfig }
      },
      onSuccess: async (_data: unknown, variables: { data: JsonPatch[] }) => {
        dispatch(updateToast(true, 'success'))
        queryClient.invalidateQueries({ queryKey: getGetScimConfigQueryKey() })
        try {
          const userMessage: string = userMessageRef.current || 'SCIM configuration updated'
          await logAudit({
            token: token ?? undefined,
            userinfo: userinfo ?? undefined,
            action: PATCH,
            resource: 'update_scim_config',
            message: userMessage,
            client_id: client_id,
            payload: variables?.data,
          })
        } catch (e: unknown) {
          console.warn('Audit logging failed for SCIM configuration update', e)
        }
      },
      onError: (
        error: unknown,
        _variables: unknown,
        context: { previousConfig?: unknown } | undefined,
      ) => {
        const errorMessage = getErrorMessage(error, t('messages.error_in_saving'))
        dispatch(updateToast(true, 'error', errorMessage))
        if (context?.previousConfig) {
          queryClient.setQueryData(getGetScimConfigQueryKey(), context.previousConfig)
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: getGetScimConfigQueryKey() })
      },
    },
  })

  const handleSubmit = useCallback(
    (formValues: ScimFormValues): void => {
      if (!scimConfiguration) {
        dispatch(updateToast(true, 'error', t('messages.no_configuration_loaded')))
        return
      }
      const { action_message, ...valuesWithoutAction } = formValues
      const patches = createJsonPatchFromDifferences(scimConfiguration, valuesWithoutAction)
      if (patches.length === 0) {
        dispatch(updateToast(true, 'info', t('messages.no_changes_detected')))
        return
      }
      userMessageRef.current = action_message || ''
      patchScimMutation.mutate({ data: patches })
    },
    [scimConfiguration, patchScimMutation, dispatch, t],
  )

  return (
    <GluuLoader blocking={isLoading || patchScimMutation.isPending}>
      <Card className="mb-3" style={applicationStyle.mainCard}>
        <CardBody>
          <GluuViewWrapper canShow={canReadScim}>
            <ScimConfiguration
              scimConfiguration={scimConfiguration}
              handleSubmit={handleSubmit}
              isSubmitting={patchScimMutation.isPending}
              canWriteScim={canWriteScim}
            />
          </GluuViewWrapper>
        </CardBody>
      </Card>
    </GluuLoader>
  )
}

export default ScimPage
