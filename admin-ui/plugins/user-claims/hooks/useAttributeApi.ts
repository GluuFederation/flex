import { useCallback } from 'react'
import { useAppSelector } from '@/redux/hooks'
import { useQueryClient } from '@tanstack/react-query'
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
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
import { useSchemaAuditLogger } from './useSchemaAuditLogger'
import { useSchemaWebhook } from './useSchemaWebhook'
import { API_ATTRIBUTE, ATTRIBUTE_CACHE_CONFIG, QUERY_KEY_PREFIX_ATTRIBUTES } from '../constants'
import type { RootState } from '@/redux/hooks'
import type { ModifiedFields } from '../components/types/UserClaimsListPage.types'

export const useAttributes = (params?: GetAttributesParams) => {
  const hasSession = useAppSelector((state: RootState) => state.authReducer?.hasSession)

  return useGetAttributes<GetAttributesQueryResult, Error>(params, {
    query: {
      enabled: hasSession === true,
      staleTime: ATTRIBUTE_CACHE_CONFIG.STALE_TIME,
      gcTime: ATTRIBUTE_CACHE_CONFIG.GC_TIME,
      retry: false,
    },
  })
}

/** Type-safe cast for PagedResult entries to JansAttribute[] */
export function toAttributeList(entries?: PagedResultEntriesItem[]): JansAttribute[] {
  if (!entries) return []
  return entries.map((entry) => Object.assign({} as JansAttribute, entry))
}

export const useAttribute = (inum: string) => {
  const hasSession = useAppSelector((state: RootState) => state.authReducer?.hasSession)

  return useGetAttributesByInum(inum, {
    query: {
      enabled: !!inum && hasSession === true,
      staleTime: ATTRIBUTE_CACHE_CONFIG.SINGLE_ATTRIBUTE_STALE_TIME,
      refetchOnMount: 'always',
      retry: false,
    },
  })
}

export const useCreateAttribute = () => {
  const queryClient = useQueryClient()
  const { logAudit } = useSchemaAuditLogger()
  const { triggerAttributeWebhook } = useSchemaWebhook()
  const baseMutation = usePostAttributes()

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
      mutateAsync(...args).catch(() => {})
    },
    mutateAsync,
  }
}

export const useUpdateAttribute = () => {
  const queryClient = useQueryClient()
  const { logAudit } = useSchemaAuditLogger()
  const { triggerAttributeWebhook } = useSchemaWebhook()
  const baseMutation = usePutAttributes()

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
      mutateAsync(...args).catch(() => {})
    },
    mutateAsync,
  }
}

export const useDeleteAttribute = () => {
  const queryClient = useQueryClient()
  const { logAudit } = useSchemaAuditLogger()
  const { triggerAttributeWebhook } = useSchemaWebhook()
  const baseMutation = useDeleteAttributesByInum()

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
      deleteWithAudit(...args).catch(() => {})
    },
    mutateAsync: deleteWithAudit,
  }
}
