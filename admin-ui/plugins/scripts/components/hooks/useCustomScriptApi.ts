import { useCallback, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
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
import { SCRIPT } from 'Plugins/admin/redux/audit/Resources'
import { devLogger } from '@/utils/devLogger'
import { triggerWebhook } from 'Plugins/admin/redux/features/WebhookSlice'
import type { TriggerWebhookReducerPayload } from 'Plugins/admin/redux/types'
import type { JsonValue } from 'Routes/Apps/Gluu/types/common'
import type { AdditionalPayload } from 'Utils/TokenController'
import { logAuditAction } from '../helper'
import { getApiErrorDetail } from '../helper/utils'
import { updateToast } from '@/redux/features/toastSlice'
import {
  SCRIPT_CACHE_CONFIG,
  QUERY_KEY_PREFIX_SCRIPTS_BY_TYPE,
  QUERY_KEY_PREFIX_SCRIPTS,
} from '../constants'
import type { ScriptType } from '../types/customScript'

interface WebhookPayload {
  createdFeatureValue: CustomScript | { inum: string }
}

const useWebhookTrigger = () => {
  const dispatch = useAppDispatch()

  return useCallback(
    (payload: WebhookPayload) => {
      try {
        dispatch(
          triggerWebhook({
            createdFeatureValue: payload.createdFeatureValue as Record<string, JsonValue>,
          } as TriggerWebhookReducerPayload),
        )
      } catch (error) {
        devLogger.error('Failed to trigger webhook:', error)
      }
    },
    [dispatch],
  )
}

export const useCustomScripts = (params?: GetConfigScriptsParams) => {
  const hasSession = useAppSelector((state) => state.authReducer?.hasSession)

  return useGetConfigScripts(params, {
    query: {
      enabled: hasSession === true,
      staleTime: SCRIPT_CACHE_CONFIG.STALE_TIME,
      gcTime: SCRIPT_CACHE_CONFIG.GC_TIME,
      retry: false,
    },
  })
}

export const useCustomScriptsByType = (
  type: string,
  params?: Omit<GetConfigScriptsByTypeParams, 'type'>,
) => {
  const dispatch = useAppDispatch()
  const hasSession = useAppSelector((state) => state.authReducer?.hasSession)

  const result = useGetConfigScriptsByType(type, params, {
    query: {
      enabled: !!type && hasSession === true,
      staleTime: SCRIPT_CACHE_CONFIG.STALE_TIME,
      gcTime: SCRIPT_CACHE_CONFIG.GC_TIME,
      retry: false,
    },
  })

  const queryError = result.error
  useEffect(() => {
    if (queryError) {
      dispatch(updateToast(true, 'error', getApiErrorDetail(queryError)))
    }
  }, [queryError, dispatch])

  return result
}

export const useCustomScript = (inum: string) => {
  const hasSession = useAppSelector((state) => state.authReducer?.hasSession)

  return useGetConfigScriptsByInum(inum, {
    query: {
      enabled: !!inum && hasSession === true,
      staleTime: SCRIPT_CACHE_CONFIG.SINGLE_SCRIPT_STALE_TIME,
      refetchOnMount: 'always',
      retry: false,
    },
  })
}

export const useCreateCustomScript = () => {
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
          action_data: structuredClone(variables.data),
          action_message: actionMessage,
        },
      } as AdditionalPayload)

      return result
    },
  }
}

export const useUpdateCustomScript = () => {
  const queryClient = useQueryClient()
  const webhookTrigger = useWebhookTrigger()
  const baseMutation = usePutConfigScripts()

  return {
    ...baseMutation,
    mutateAsync: async (variables: { data: CustomScript; actionMessage?: string }) => {
      const { actionMessage, ...baseVariables } = variables
      const result = await baseMutation.mutateAsync(baseVariables)

      const inumToInvalidate = result.inum ?? variables.data.inum
      if (inumToInvalidate) {
        queryClient.setQueryData(getGetConfigScriptsByInumQueryKey(inumToInvalidate), result)
      }
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: getGetConfigScriptsQueryKey() }),
        queryClient.invalidateQueries({
          queryKey: getGetConfigScriptsByTypeQueryKey(variables.data.scriptType || ''),
        }),
        inumToInvalidate
          ? queryClient.invalidateQueries({
              queryKey: getGetConfigScriptsByInumQueryKey(inumToInvalidate),
            })
          : Promise.resolve(),
      ])

      webhookTrigger({ createdFeatureValue: result })
      await logAuditAction(UPDATE, SCRIPT, {
        action: {
          action_data: structuredClone(variables.data),
          action_message: actionMessage,
        },
      } as AdditionalPayload)

      return result
    },
  }
}

export const useDeleteCustomScript = () => {
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
              key.startsWith(QUERY_KEY_PREFIX_SCRIPTS_BY_TYPE) ||
              key.startsWith(QUERY_KEY_PREFIX_SCRIPTS)
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

export const useCustomScriptTypes = () => {
  const hasSession = useAppSelector((state) => state.authReducer?.hasSession)

  return useGetCustomScriptType({
    query: {
      enabled: hasSession === true,
      retry: false,
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

export const useCustomScriptOperations = () => {
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
