import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppSelector, useAppDispatch } from '@/redux/hooks'
import { updateToast } from 'Redux/features/toastSlice'
import { useQueryClient } from '@tanstack/react-query'
import type { UseMutationResult } from '@tanstack/react-query'
import {
  useGetAttributes,
  useGetAttributesByInum,
  usePostAttributes,
  usePutAttributes,
  useDeleteAttributesByInum,
  getGetAttributesQueryKey,
  getGetAttributesByInumQueryKey,
  type JansAttribute,
  type GetAttributesParams,
  type GetAttributesQueryResult,
  type PagedResultEntriesItem,
} from 'JansConfigApi'
import { CREATE, UPDATE, DELETION } from '@/audit/UserActionType'
import { logger } from '@/utils/logger'
import { adminUiFeatures } from '@/constants'
import { useSchemaAuditLogger } from './useSchemaAuditLogger'
import { useSchemaWebhook } from './useSchemaWebhook'
import { API_ATTRIBUTE, ATTRIBUTE_CACHE_CONFIG, QUERY_KEY_PREFIX_ATTRIBUTES } from '../constants'
import type { ModifiedFields } from '../components/types'

export const useAttributes = (params?: GetAttributesParams) => {
  const hasSession = useAppSelector((state) => state.authReducer?.hasSession)

  return useGetAttributes<GetAttributesQueryResult, Error>(params, {
    query: {
      enabled: hasSession === true,
      staleTime: ATTRIBUTE_CACHE_CONFIG.STALE_TIME,
      gcTime: ATTRIBUTE_CACHE_CONFIG.GC_TIME,
      retry: false,
    },
  })
}

export const toAttributeList = (entries?: PagedResultEntriesItem[]): JansAttribute[] => {
  if (!entries) return []
  return entries.map((entry) => Object.assign({} as JansAttribute, entry))
}

export const useAttribute = (inum: string) => {
  const hasSession = useAppSelector((state) => state.authReducer?.hasSession)

  return useGetAttributesByInum(inum, {
    query: {
      enabled: !!inum && hasSession === true,
      staleTime: ATTRIBUTE_CACHE_CONFIG.SINGLE_ATTRIBUTE_STALE_TIME,
      refetchOnMount: 'always',
      retry: false,
    },
  })
}

export const useCreateAttribute = (): UseMutationResult<
  JansAttribute,
  Error,
  { data: JansAttribute; userMessage?: string },
  void
> => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const { logAudit } = useSchemaAuditLogger()
  const { triggerAttributeWebhook } = useSchemaWebhook()
  const baseMutation = usePostAttributes({
    mutation: {
      onError: (error: Error) => {
        const err = error as { response?: { data?: { message?: string } } }
        const errorMsg = err?.response?.data?.message || t('messages.error_in_saving')
        dispatch(updateToast(true, 'error', errorMsg))
      },
    },
  })

  const mutateAsync = useCallback(
    async (variables: { data: JansAttribute; userMessage?: string }) => {
      const { userMessage, ...baseVariables } = variables
      const result = await baseMutation.mutateAsync(baseVariables)

      await queryClient.invalidateQueries({ queryKey: getGetAttributesQueryKey() })

      triggerAttributeWebhook(result)
      await logAudit({
        action: CREATE,
        resource: API_ATTRIBUTE,
        message: userMessage || '',
        payload: result,
      })

      return result
    },
    [baseMutation, queryClient, logAudit, triggerAttributeWebhook],
  )

  return {
    ...baseMutation,
    mutate: (...args: Parameters<typeof mutateAsync>) => {
      // Error is surfaced to the user via the mutation's onError toast; log a
      // dev breadcrumb and swallow the rejection to avoid an unhandled promise.
      mutateAsync(...args).catch((error) => {
        logger.error('dev', 'Create attribute failed:', error)
      })
    },
    mutateAsync,
  } as UseMutationResult<JansAttribute, Error, { data: JansAttribute; userMessage?: string }, void>
}

export const useUpdateAttribute = (): UseMutationResult<
  JansAttribute,
  Error,
  { data: JansAttribute; userMessage?: string; modifiedFields?: ModifiedFields },
  void
> => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const { logAudit } = useSchemaAuditLogger()
  const { triggerAttributeWebhook } = useSchemaWebhook()
  const baseMutation = usePutAttributes({
    mutation: {
      onError: (error: Error) => {
        const err = error as { response?: { data?: { message?: string } } }
        const errorMsg = err?.response?.data?.message || t('messages.error_in_saving')
        dispatch(updateToast(true, 'error', errorMsg))
      },
    },
  })

  const mutateAsync = useCallback(
    async (variables: {
      data: JansAttribute
      userMessage?: string
      modifiedFields?: ModifiedFields
    }) => {
      const { userMessage, modifiedFields, ...baseVariables } = variables
      const result = await baseMutation.mutateAsync(baseVariables)

      const inumToInvalidate = result.inum ?? variables.data.inum
      if (inumToInvalidate) {
        queryClient.setQueryData(getGetAttributesByInumQueryKey(inumToInvalidate), result)
      }
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: getGetAttributesQueryKey() }),
        inumToInvalidate
          ? queryClient.invalidateQueries({
              queryKey: getGetAttributesByInumQueryKey(inumToInvalidate),
            })
          : Promise.resolve(),
      ])

      triggerAttributeWebhook(result)
      await logAudit({
        action: UPDATE,
        resource: API_ATTRIBUTE,
        message: userMessage || '',
        modifiedFields,
      })

      return result
    },
    [baseMutation, queryClient, logAudit, triggerAttributeWebhook],
  )

  return {
    ...baseMutation,
    mutate: (...args: Parameters<typeof mutateAsync>) => {
      // Error is surfaced to the user via the mutation's onError toast; log a
      // dev breadcrumb and swallow the rejection to avoid an unhandled promise.
      mutateAsync(...args).catch((error) => {
        logger.error('dev', 'Update attribute failed:', error)
      })
    },
    mutateAsync,
  } as UseMutationResult<
    JansAttribute,
    Error,
    { data: JansAttribute; userMessage?: string; modifiedFields?: ModifiedFields },
    void
  >
}

export const useDeleteAttribute = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const { logAudit } = useSchemaAuditLogger()
  const { triggerAttributeWebhook } = useSchemaWebhook()
  const baseMutation = useDeleteAttributesByInum({
    mutation: {
      onError: (error: Error) => {
        const err = error as { response?: { data?: { message?: string } } }
        const errorMsg = err?.response?.data?.message || t('messages.error_in_saving')
        dispatch(updateToast(true, 'error', errorMsg))
      },
    },
  })

  const deleteWithAudit = useCallback(
    async (variables: { inum: string; name?: string; userMessage?: string }) => {
      const { userMessage, name, ...baseVariables } = variables
      const result = await baseMutation.mutateAsync(baseVariables)

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: getGetAttributesQueryKey() }),
        queryClient.invalidateQueries({
          predicate: (query) => {
            const queryKey = query.queryKey
            if (!Array.isArray(queryKey) || typeof queryKey[0] !== 'string') {
              return false
            }
            return queryKey[0].startsWith(QUERY_KEY_PREFIX_ATTRIBUTES)
          },
        }),
      ])

      const deleted = { inum: variables.inum, name }
      triggerAttributeWebhook(deleted, adminUiFeatures.attributes_delete)
      await logAudit({
        action: DELETION,
        resource: API_ATTRIBUTE,
        message: userMessage || `Deleted attribute ${name ?? variables.inum}`,
        payload: deleted,
      })

      return result
    },
    [baseMutation, queryClient, logAudit, triggerAttributeWebhook],
  )

  return {
    ...baseMutation,
    mutate: (...args: Parameters<typeof deleteWithAudit>) => {
      // Error is surfaced to the user via the mutation's onError toast; log a
      // dev breadcrumb and swallow the rejection to avoid an unhandled promise.
      deleteWithAudit(...args).catch((error) => {
        logger.error('dev', 'Delete attribute failed:', error)
      })
    },
    mutateAsync: deleteWithAudit,
  }
}
