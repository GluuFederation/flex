import { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useQueryClient } from '@tanstack/react-query'
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
  getGetConfigScriptsByInumQueryKey,
  type CustomScript,
  type GetConfigScriptsParams,
  type GetConfigScriptsByTypeParams,
} from 'JansConfigApi'
import { CREATE, UPDATE, DELETION } from '@/audit/UserActionType'
import { SCRIPT } from '../../../redux/audit/Resources'
import { triggerWebhook } from 'Plugins/admin/redux/features/WebhookSlice'
import { logAuditAction } from './auditUtils'
import { SCRIPT_CACHE_CONFIG } from '../constants'
import type { RootState } from 'Redux/sagas/types/audit'
import type { ScriptType } from '../types/customScript'

export type { ScriptType }

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
  const hasSession = useSelector((state: RootState) => state.authReducer?.hasSession)

  return useGetConfigScripts(params, {
    query: {
      enabled: hasSession === true,
      staleTime: SCRIPT_CACHE_CONFIG.STALE_TIME,
      gcTime: SCRIPT_CACHE_CONFIG.GC_TIME,
    },
  })
}

export function useCustomScriptsByType(
  type: string,
  params?: Omit<GetConfigScriptsByTypeParams, 'type'>,
) {
  const hasSession = useSelector((state: RootState) => state.authReducer?.hasSession)

  return useGetConfigScriptsByType(type, params, {
    query: {
      enabled: !!type && hasSession === true,
      staleTime: SCRIPT_CACHE_CONFIG.STALE_TIME,
      gcTime: SCRIPT_CACHE_CONFIG.GC_TIME,
    },
  })
}

export function useCustomScript(inum: string) {
  const hasSession = useSelector((state: RootState) => state.authReducer?.hasSession)

  return useGetConfigScriptsByInum(inum, {
    query: {
      enabled: !!inum && hasSession === true,
      staleTime: SCRIPT_CACHE_CONFIG.SINGLE_SCRIPT_STALE_TIME,
    },
  })
}

export function useCreateCustomScript() {
  const queryClient = useQueryClient()
  const webhookTrigger = useWebhookTrigger()
  const baseMutation = usePostConfigScripts()

  return {
    ...baseMutation,
    mutateAsync: async (variables: { data: CustomScript; actionMessage?: string }) => {
      const { actionMessage, ...baseVariables } = variables
      const result = await baseMutation.mutateAsync(baseVariables)

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: getGetConfigScriptsQueryKey() }),
        queryClient.invalidateQueries({
          queryKey: getGetConfigScriptsByTypeQueryKey(variables.data.scriptType || ''),
        }),
      ])

      webhookTrigger({ createdFeatureValue: result })
      await logAuditAction(CREATE, SCRIPT, {
        action: {
          action_data: structuredClone(variables.data) as Record<string, unknown>,
        },
        message: actionMessage,
      })

      return result
    },
  }
}

export function useUpdateCustomScript() {
  const queryClient = useQueryClient()
  const webhookTrigger = useWebhookTrigger()
  const baseMutation = usePutConfigScripts()

  return {
    ...baseMutation,
    mutateAsync: async (variables: { data: CustomScript; actionMessage?: string }) => {
      const { actionMessage, ...baseVariables } = variables
      const result = await baseMutation.mutateAsync(baseVariables)

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: getGetConfigScriptsQueryKey() }),
        queryClient.invalidateQueries({
          queryKey: getGetConfigScriptsByTypeQueryKey(variables.data.scriptType || ''),
        }),
        result.inum
          ? queryClient.invalidateQueries({
              queryKey: getGetConfigScriptsByInumQueryKey(result.inum),
            })
          : Promise.resolve(),
      ])

      webhookTrigger({ createdFeatureValue: result })
      await logAuditAction(UPDATE, SCRIPT, {
        action: {
          action_data: structuredClone(variables.data) as Record<string, unknown>,
        },
        message: actionMessage,
      })

      return result
    },
  }
}

export function useDeleteCustomScript() {
  const queryClient = useQueryClient()
  const webhookTrigger = useWebhookTrigger()
  const baseMutation = useDeleteConfigScriptsByInum()

  return {
    ...baseMutation,
    mutateAsync: async (variables: { inum: string; actionMessage?: string }) => {
      const { actionMessage, ...baseVariables } = variables
      const result = await baseMutation.mutateAsync(baseVariables)

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: getGetConfigScriptsQueryKey() }),
        queryClient.invalidateQueries({
          predicate: (query) => {
            const queryKey = query.queryKey
            if (!Array.isArray(queryKey) || typeof queryKey[0] !== 'string') {
              return false
            }
            const key = queryKey[0]
            return (
              key.startsWith('/api/v1/config/scripts/type/') ||
              key.startsWith('/api/v1/config/scripts/')
            )
          },
        }),
      ])

      webhookTrigger({ createdFeatureValue: { inum: variables.inum } })
      await logAuditAction(DELETION, SCRIPT, {
        action: { action_data: { inum: variables.inum } },
        message: actionMessage,
      })

      return result
    },
  }
}

export function useCustomScriptTypes() {
  const hasSession = useSelector((state: RootState) => state.authReducer?.hasSession)

  return useGetCustomScriptType({
    query: {
      enabled: hasSession === true,
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
    createScript: createMutation,
    updateScript: updateMutation,
    deleteScript: deleteMutation,
    scriptTypes: scriptTypesQuery.data || [],
    scriptTypesLoading: scriptTypesQuery.isLoading,
  }
}
