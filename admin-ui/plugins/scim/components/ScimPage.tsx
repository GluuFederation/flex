import React, { useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { useQueryClient } from '@tanstack/react-query'
import SetTitle from 'Utils/SetTitle'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import { GluuPageContent } from '@/components'
import ScimConfiguration from './ScimConfiguration'
import { updateToast } from 'Redux/features/toastSlice'
import { useGetScimConfig, usePatchScimConfig, getGetScimConfigQueryKey } from 'JansConfigApi'
import { createJsonPatchFromDifferences, AUDIT_RESOURCE, triggerScimWebhook } from '../helper'
import { setWebhookModal } from 'Plugins/admin/redux/features/WebhookSlice'
import type { ScimFormValues, ApiErrorResponse, MutationContext, AppConfiguration3 } from '../types'
import { logAudit } from 'Utils/AuditLogger'
import { PATCH } from '@/audit/UserActionType'
import type { JsonPatch } from 'JansConfigApi'
import { useCedarling } from '@/cedarling'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import { useStyles } from './styles/ScimFormPage.style'

const scimResourceId = ADMIN_UI_RESOURCES.SCIM
const scimScopes = CEDAR_RESOURCE_SCOPES[scimResourceId]

const isApiError = (error: Error | ApiErrorResponse): error is ApiErrorResponse => {
  return 'response' in error && typeof (error as ApiErrorResponse).response === 'object'
}

const getErrorMessage = (error: Error | ApiErrorResponse, fallback: string): string => {
  if (isApiError(error) && error.response?.data?.message) {
    return error.response.data.message
  }
  return fallback
}

const ScimPage: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const userinfo = useAppSelector((state) => state.authReducer?.userinfo)
  const client_id = useAppSelector((state) => state.authReducer?.config?.clientId)
  SetTitle(t('titles.scim_management'))
  const { hasCedarReadPermission, hasCedarWritePermission, authorizeHelper } = useCedarling()
  const canReadScim = useMemo(
    () => hasCedarReadPermission(scimResourceId),
    [hasCedarReadPermission, scimResourceId],
  )
  const canWriteScim = useMemo(
    () => hasCedarWritePermission(scimResourceId),
    [hasCedarWritePermission, scimResourceId],
  )

  useEffect(() => {
    if (scimScopes && scimScopes.length > 0) {
      authorizeHelper(scimScopes)
    }
  }, [authorizeHelper, scimScopes])

  const { state: themeState } = useTheme()
  const { themeColors, isDark } = useMemo(
    () => ({
      themeColors: getThemeColor(themeState.theme),
      isDark: themeState.theme === THEME_DARK,
    }),
    [themeState.theme],
  )
  const { classes } = useStyles({ isDark, themeColors })

  const { data: scimConfiguration, isLoading } = useGetScimConfig()
  const userMessageRef = React.useRef<string>('')

  const patchScimMutation = usePatchScimConfig({
    mutation: {
      onMutate: async (variables: { data: JsonPatch[] }) => {
        await queryClient.cancelQueries({ queryKey: getGetScimConfigQueryKey() })
        const previousConfig = queryClient.getQueryData(getGetScimConfigQueryKey()) as
          | AppConfiguration3
          | undefined
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
                    const { [key]: omitted, ...rest } = updated
                    void omitted
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
      onSuccess: async (data: AppConfiguration3, variables: { data: JsonPatch[] }) => {
        dispatch(setWebhookModal(false))
        dispatch(updateToast(true, 'success', t('messages.success_in_saving')))
        triggerScimWebhook(data)
        const userMessage: string = userMessageRef.current || t('messages.success_in_saving')
        await logAudit({
          userinfo: userinfo ?? undefined,
          action: PATCH,
          resource: AUDIT_RESOURCE,
          message: userMessage,
          client_id: client_id,
          payload: variables?.data,
        })
      },
      onError: (
        error: Error | ApiErrorResponse,
        _variables: { data: JsonPatch[] },
        context: MutationContext | undefined,
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
    (formValues: ScimFormValues): void | Promise<AppConfiguration3> => {
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
      return patchScimMutation.mutateAsync({ data: patches })
    },
    [scimConfiguration, patchScimMutation, dispatch, t],
  )

  return (
    <GluuPageContent>
      <GluuViewWrapper canShow={canReadScim}>
        <GluuLoader blocking={isLoading || patchScimMutation.isPending}>
          <div className={classes.formCard}>
            <div className={classes.content}>
              <ScimConfiguration
                scimConfiguration={scimConfiguration}
                handleSubmit={handleSubmit}
                isSubmitting={patchScimMutation.isPending}
                canWriteScim={canWriteScim}
                classes={classes}
              />
            </div>
          </div>
        </GluuLoader>
      </GluuViewWrapper>
    </GluuPageContent>
  )
}

export default ScimPage
