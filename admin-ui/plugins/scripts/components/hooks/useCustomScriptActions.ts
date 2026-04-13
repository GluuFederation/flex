import { useQueryClient } from '@tanstack/react-query'
import {
  getGetConfigScriptsQueryKey,
  getGetConfigScriptsByTypeQueryKey,
  type CustomScript,
} from 'JansConfigApi'
import { QUERY_KEY_GET_CONFIG_SCRIPTS_BY_TYPE } from '../constants'
import {
  useCreateCustomScript,
  useUpdateCustomScript,
  useDeleteCustomScript,
  useCustomScriptTypes,
} from './useCustomScriptApi'
import type { LegacyScriptAction } from '../types'

export const useCustomScriptActions = () => {
  const queryClient = useQueryClient()

  const createMutation = useCreateCustomScript()
  const updateMutation = useUpdateCustomScript()
  const deleteMutation = useDeleteCustomScript()
  const scriptTypesQuery = useCustomScriptTypes()

  const createScript = async (scriptData: CustomScript, actionMessage?: string) => {
    return await createMutation.mutateAsync({ data: scriptData, actionMessage })
  }

  const updateScript = async (scriptData: CustomScript, actionMessage?: string) => {
    return await updateMutation.mutateAsync({ data: scriptData, actionMessage })
  }

  const deleteScript = async (inum: string, actionMessage?: string) => {
    return await deleteMutation.mutateAsync({ inum, actionMessage })
  }

  const refetchScripts = () => {
    queryClient.invalidateQueries({ queryKey: getGetConfigScriptsQueryKey() })
  }

  const refetchScriptsByType = (type?: string) => {
    if (type) {
      queryClient.invalidateQueries({ queryKey: getGetConfigScriptsByTypeQueryKey(type) })
    } else {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_GET_CONFIG_SCRIPTS_BY_TYPE] })
    }
  }

  return {
    createScript,
    updateScript,
    deleteScript,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isMutating: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
    scriptTypes: scriptTypesQuery.data || [],
    scriptTypesLoading: scriptTypesQuery.isLoading,
    scriptTypesError: scriptTypesQuery.error,
    refetchScripts,
    refetchScriptsByType,
  }
}

export const useCustomScriptLegacyActions = () => {
  const queryClient = useQueryClient()

  return {
    getCustomScriptByType: (payload: { action: LegacyScriptAction }) => {
      const { type, ...params } = payload.action
      queryClient.prefetchQuery({
        queryKey: getGetConfigScriptsByTypeQueryKey(type, params),
      })
    },
  }
}

export default useCustomScriptActions
