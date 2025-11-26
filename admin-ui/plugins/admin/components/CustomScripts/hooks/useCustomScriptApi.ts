import { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useQueryClient } from '@tanstack/react-query'
import type { UnknownAction } from '@reduxjs/toolkit'
import {
  useGetConfigScripts,
  useGetConfigScriptsByInum,
  useGetConfigScriptsByType,
  usePostConfigScripts,
  usePutConfigScripts,
  useDeleteConfigScriptsByInum,
  useGetCustomScriptType,
  getGetConfigScriptsQueryKey,
  getGetConfigScriptsByTypeQueryKey,
  type CustomScript,
  type GetConfigScriptsParams,
  type GetConfigScriptsByTypeParams,
} from 'JansConfigApi'
import { CREATE, UPDATE, DELETION, FETCH } from '@/audit/UserActionType'
import { SCRIPT } from '../../../redux/audit/Resources'
import { triggerWebhook } from 'Plugins/admin/redux/features/WebhookSlice'
import { logAuditAction } from './auditUtils'
import { SCRIPT_CACHE_CONFIG } from '../constants'
import type { RootState } from 'Redux/sagas/types/audit'

export interface ScriptType {
  value: string
  name: string
}

interface WebhookPayload {
  createdFeatureValue: CustomScript | { inum: string }
}

const useWebhookTrigger = () => {
  const dispatch = useDispatch()

  return useCallback(
    (payload: WebhookPayload) => {
      try {
        dispatch(triggerWebhook(payload))
      } catch (error) {
        console.error('Failed to trigger webhook:', error)
      }
    },
    [dispatch],
  )
}

export function useCustomScripts(params?: GetConfigScriptsParams) {
  const authToken = useSelector((state: RootState) => state.authReducer?.token?.access_token)

  return useGetConfigScripts(params, {
    query: {
      enabled: !!authToken,
      onSuccess: async () => {
        await logAuditAction(FETCH, SCRIPT, { action: { action_data: params } })
      },
      onError: (error: unknown) => {
        console.error('Failed to fetch custom scripts:', error)
      },
      staleTime: SCRIPT_CACHE_CONFIG.STALE_TIME,
      gcTime: SCRIPT_CACHE_CONFIG.GC_TIME,
    },
  })
}

export function useCustomScriptsByType(
  type: string,
  params?: Omit<GetConfigScriptsByTypeParams, 'type'>,
) {
  const authToken = useSelector((state: RootState) => state.authReducer?.token?.access_token)

  return useGetConfigScriptsByType(type, params, {
    query: {
      enabled: !!type && !!authToken,
      onSuccess: async () => {
        await logAuditAction(FETCH, SCRIPT, { action: { action_data: { type, ...params } } })
      },
      staleTime: SCRIPT_CACHE_CONFIG.STALE_TIME,
      gcTime: SCRIPT_CACHE_CONFIG.GC_TIME,
    },
  })
}

export function useCustomScript(inum: string) {
  const authToken = useSelector((state: RootState) => state.authReducer?.token?.access_token)

  return useGetConfigScriptsByInum(inum, {
    query: {
      enabled: !!inum && !!authToken,
      staleTime: SCRIPT_CACHE_CONFIG.SINGLE_SCRIPT_STALE_TIME,
    },
  })
}

export function useCreateCustomScript() {
  const queryClient = useQueryClient()
  const triggerWebhook = useWebhookTrigger()

  return usePostConfigScripts({
    mutation: {
      onSuccess: async (
        data: CustomScript,
        variables: { data: CustomScript; actionMessage?: string },
      ) => {
        queryClient.invalidateQueries({ queryKey: getGetConfigScriptsQueryKey() })
        triggerWebhook({ createdFeatureValue: data })
        await logAuditAction(CREATE, SCRIPT, {
          action: {
            action_data: JSON.parse(JSON.stringify(variables.data)) as Record<string, unknown>,
          },
          message: variables.actionMessage,
        })
      },
      onError: (error: unknown) => {
        console.error('Failed to create custom script:', error)
      },
    },
  })
}

export function useUpdateCustomScript() {
  const queryClient = useQueryClient()
  const triggerWebhook = useWebhookTrigger()

  return usePutConfigScripts({
    mutation: {
      onSuccess: async (
        data: CustomScript,
        variables: { data: CustomScript; actionMessage?: string },
      ) => {
        queryClient.invalidateQueries({ queryKey: getGetConfigScriptsQueryKey() })
        if (data.inum) {
          queryClient.invalidateQueries({
            queryKey: ['getConfigScriptsByInum', data.inum],
          })
        }

        triggerWebhook({ createdFeatureValue: data })
        await logAuditAction(UPDATE, SCRIPT, {
          action: {
            action_data: JSON.parse(JSON.stringify(variables.data)) as Record<string, unknown>,
          },
          message: variables.actionMessage,
        })
      },
      onError: (error: unknown) => {
        console.error('Failed to update custom script:', error)
      },
    },
  })
}

export function useDeleteCustomScript() {
  const queryClient = useQueryClient()
  const triggerWebhook = useWebhookTrigger()

  return useDeleteConfigScriptsByInum({
    mutation: {
      onSuccess: async (_data, variables: { inum: string; actionMessage?: string }) => {
        queryClient.invalidateQueries({ queryKey: getGetConfigScriptsQueryKey() })
        queryClient.invalidateQueries({
          predicate: (query) => {
            const queryKey = query.queryKey as string[]
            return (
              queryKey[0] === 'getConfigScriptsByType' || queryKey[0] === 'getConfigScriptsByInum'
            )
          },
        })
        await queryClient.refetchQueries({
          predicate: (query) => {
            const queryKey = query.queryKey as string[]
            return queryKey[0] === 'getConfigScriptsByType'
          },
        })
        triggerWebhook({ createdFeatureValue: { inum: variables.inum } })
        await logAuditAction(DELETION, SCRIPT, {
          action: { action_data: { inum: variables.inum } },
          message: variables.actionMessage,
        })
      },
      onError: (error: unknown) => {
        console.error('Failed to delete custom script:', error)
      },
    },
  })
}

export function useCustomScriptTypes() {
  const authToken = useSelector((state: RootState) => state.authReducer?.token?.access_token)

  return useGetCustomScriptType({
    query: {
      enabled: !!authToken,
      select: (data: string[]): ScriptType[] => {
        if (!data || !Array.isArray(data)) {
          return []
        }

        return data.map((type: string) => {
          if (!type) {
            return { value: '', name: '' }
          }

          if (type.includes('_')) {
            const words = type.split('_')
            const formattedWords = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            return {
              value: type,
              name: formattedWords.join(' '),
            }
          }

          return {
            value: type,
            name: type.charAt(0).toUpperCase() + type.slice(1),
          }
        })
      },
      staleTime: SCRIPT_CACHE_CONFIG.SCRIPT_TYPES_STALE_TIME,
      gcTime: SCRIPT_CACHE_CONFIG.SCRIPT_TYPES_GC_TIME,
    },
  })
}

export function useCustomScriptOperations() {
  const createMutation = useCreateCustomScript()
  const updateMutation = useUpdateCustomScript()
  const deleteMutation = useDeleteCustomScript()
  const scriptTypesQuery = useCustomScriptTypes()

  return {
    useScripts: useCustomScripts,
    useScriptsByType: useCustomScriptsByType,
    useScript: useCustomScript,
    useScriptTypes: useCustomScriptTypes,
    createScript: createMutation,
    updateScript: updateMutation,
    deleteScript: deleteMutation,
    scriptTypes: scriptTypesQuery.data || [],
    scriptTypesLoading: scriptTypesQuery.isLoading,
  }
}
