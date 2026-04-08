import { useCallback, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAppDispatch } from '@/redux/hooks'
import {
  usePostOauthScopes,
  usePutOauthScopes,
  getGetOauthScopesQueryKey,
  getGetOauthScopesByInumQueryKey,
} from 'JansConfigApi'
import type { Scope } from 'JansConfigApi'
import { updateToast } from 'Redux/features/toastSlice'
import { triggerWebhook } from 'Plugins/admin/redux/features/WebhookSlice'
import { useTranslation } from 'react-i18next'
import { useScopeActions } from './useScopeActions'
import type { ModifiedFields } from '../types'
import type { ScopeWithMessage } from '../constants'
import { toScopeJsonRecord } from '../helper/utils'
import { devLogger } from '@/utils/devLogger'

export const invalidateScopeQueries = (queryClient: ReturnType<typeof useQueryClient>) => {
  const listKey = getGetOauthScopesQueryKey()[0]
  const inumKeyPrefix = getGetOauthScopesByInumQueryKey('')[0]
  return queryClient.invalidateQueries({
    predicate: (query) => {
      const queryKey = query.queryKey[0]
      if (typeof queryKey !== 'string') return false
      return queryKey === listKey || queryKey.startsWith(inumKeyPrefix)
    },
  })
}

export const useCreateScope = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const { logScopeCreation, navigateToScopeList } = useScopeActions()
  const createMutation = usePostOauthScopes()
  const [parseError, setParseError] = useState<Error | null>(null)

  const createScope = useCallback(
    async (data: string, modifiedFields: ModifiedFields) => {
      if (!data) return
      setParseError(null)

      let parsedData: ScopeWithMessage
      try {
        parsedData = JSON.parse(data) as ScopeWithMessage
      } catch (error) {
        devLogger.error('Error parsing scope data:', error)
        const parseErr = new Error(t('messages.error_in_parsing_data'))
        setParseError(parseErr)
        return Promise.reject(parseErr)
      }

      const message = parsedData.action_message || ''
      delete parsedData.action_message

      const response = await createMutation.mutateAsync({ data: parsedData as Scope })

      invalidateScopeQueries(queryClient)

      const successMessage =
        response?.id || response?.displayName
          ? t('messages.scope_created_successfully_with_name', {
              name: response.id || response.displayName,
            })
          : t('messages.scope_created_successfully')

      dispatch(updateToast(true, 'success', successMessage))
      dispatch(triggerWebhook({ createdFeatureValue: toScopeJsonRecord(response) }))

      try {
        await logScopeCreation(parsedData as Scope, message, modifiedFields)
      } catch (auditError) {
        devLogger.error('Audit logging failed:', auditError)
      }

      navigateToScopeList()
    },
    [createMutation, logScopeCreation, navigateToScopeList, t, queryClient, dispatch],
  )

  return {
    createScope,
    isPending: createMutation.isPending,
    isError: createMutation.isError || !!parseError,
    error: parseError ?? createMutation.error,
  }
}

export const useUpdateScope = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const { logScopeUpdate, navigateToScopeList } = useScopeActions()
  const updateMutation = usePutOauthScopes()
  const [parseError, setParseError] = useState<Error | null>(null)

  const updateScope = useCallback(
    async (data: string, modifiedFields: ModifiedFields) => {
      if (!data) return
      setParseError(null)

      let parsedData: ScopeWithMessage
      try {
        parsedData = JSON.parse(data) as ScopeWithMessage
      } catch (error) {
        devLogger.error('Error parsing scope data:', error)
        const parseErr = new Error(t('messages.error_in_parsing_data'))
        setParseError(parseErr)
        return Promise.reject(parseErr)
      }

      const message = parsedData.action_message || ''
      delete parsedData.action_message

      const response = await updateMutation.mutateAsync({ data: parsedData as Scope })

      invalidateScopeQueries(queryClient)

      const successMessage =
        response?.id || response?.displayName
          ? t('messages.scope_updated_successfully_with_name', {
              name: response.id || response.displayName,
            })
          : t('messages.scope_updated_successfully')

      dispatch(updateToast(true, 'success', successMessage))
      dispatch(triggerWebhook({ createdFeatureValue: toScopeJsonRecord(response) }))

      try {
        await logScopeUpdate(parsedData as Scope, message, modifiedFields)
      } catch (auditError) {
        devLogger.error('Audit logging failed:', auditError)
      }

      navigateToScopeList()
    },
    [updateMutation, logScopeUpdate, navigateToScopeList, t, queryClient, dispatch],
  )

  return {
    updateScope,
    isPending: updateMutation.isPending,
    isError: updateMutation.isError || !!parseError,
    error: parseError ?? updateMutation.error,
  }
}
