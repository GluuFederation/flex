import { useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAppDispatch } from '@/redux/hooks'
import { usePostOauthScopes, usePutOauthScopes, getGetOauthScopesQueryKey } from 'JansConfigApi'
import type { Scope } from 'JansConfigApi'
import { updateToast } from 'Redux/features/toastSlice'
import { triggerWebhook } from 'Plugins/admin/redux/features/WebhookSlice'
import { useTranslation } from 'react-i18next'
import { useScopeActions } from './useScopeActions'
import type { ModifiedFields } from '../types'
import type { ScopeWithMessage } from '../constants'
import { SCOPE_INUM_QUERY_KEY } from '../constants'
import type { JsonValue } from 'Routes/Apps/Gluu/types/common'

export const invalidateScopeQueries = (queryClient: ReturnType<typeof useQueryClient>) => {
  return queryClient.invalidateQueries({
    predicate: (query) => {
      const queryKey = query.queryKey[0] as string
      return queryKey === getGetOauthScopesQueryKey()[0] || queryKey === SCOPE_INUM_QUERY_KEY
    },
  })
}

export const useCreateScope = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const { logScopeCreation, navigateToScopeList } = useScopeActions()
  const createMutation = usePostOauthScopes()

  const createScope = useCallback(
    async (data: string, modifiedFields: ModifiedFields) => {
      if (!data) return

      let parsedData: ScopeWithMessage
      try {
        parsedData = JSON.parse(data) as ScopeWithMessage
      } catch (error) {
        console.error('Error parsing scope data:', error)
        throw new Error(t('messages.error_in_parsing_data'))
      }

      const message = parsedData.action_message || ''
      delete parsedData.action_message

      const response = await createMutation.mutateAsync({ data: parsedData as Scope })

      invalidateScopeQueries(queryClient)

      const successMessage =
        response?.id || response?.displayName
          ? `Scope '${response.id || response.displayName}' created successfully`
          : t('messages.scope_created_successfully')

      dispatch(updateToast(true, 'success', successMessage))
      dispatch(triggerWebhook({ createdFeatureValue: response as Record<string, JsonValue> }))

      try {
        await logScopeCreation(parsedData as Scope, message, modifiedFields)
      } catch (auditError) {
        console.error('Audit logging failed:', auditError)
      }

      navigateToScopeList()
    },
    [createMutation, logScopeCreation, navigateToScopeList, t, queryClient, dispatch],
  )

  return {
    createScope,
    isPending: createMutation.isPending,
    isError: createMutation.isError,
    error: createMutation.error,
  }
}

export const useUpdateScope = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const { logScopeUpdate, navigateToScopeList } = useScopeActions()
  const updateMutation = usePutOauthScopes()

  const updateScope = useCallback(
    async (data: string, modifiedFields: ModifiedFields) => {
      if (!data) return

      let parsedData: ScopeWithMessage
      try {
        parsedData = JSON.parse(data) as ScopeWithMessage
      } catch (error) {
        console.error('Error parsing scope data:', error)
        throw new Error(t('messages.error_in_parsing_data'))
      }

      const message = parsedData.action_message || ''
      delete parsedData.action_message

      const response = await updateMutation.mutateAsync({ data: parsedData as Scope })

      invalidateScopeQueries(queryClient)

      const successMessage =
        response?.id || response?.displayName
          ? `Scope '${response.id || response.displayName}' updated successfully`
          : t('messages.scope_updated_successfully')

      dispatch(updateToast(true, 'success', successMessage))
      dispatch(triggerWebhook({ createdFeatureValue: response as Record<string, JsonValue> }))

      try {
        await logScopeUpdate(parsedData as Scope, message, modifiedFields)
      } catch (auditError) {
        console.error('Audit logging failed:', auditError)
      }

      navigateToScopeList()
    },
    [updateMutation, logScopeUpdate, navigateToScopeList, t, queryClient, dispatch],
  )

  return {
    updateScope,
    isPending: updateMutation.isPending,
    isError: updateMutation.isError,
    error: updateMutation.error,
  }
}
