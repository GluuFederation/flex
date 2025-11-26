import { useDispatch } from 'react-redux'
import { useQueryClient } from '@tanstack/react-query'
import {
  getGetConfigScriptsQueryKey,
  getGetConfigScriptsByTypeQueryKey,
  type CustomScript,
  type GetConfigScriptsParams,
  type GetConfigScriptsByTypeParams,
} from 'JansConfigApi'
import {
  useCustomScripts,
  useCustomScriptsByType,
  useCustomScript,
  useCreateCustomScript,
  useUpdateCustomScript,
  useDeleteCustomScript,
  useCustomScriptTypes,
  type ScriptType,
} from './useCustomScriptApi'

export function useCustomScriptActions() {
  const queryClient = useQueryClient()

  const createMutation = useCreateCustomScript()
  const updateMutation = useUpdateCustomScript()
  const deleteMutation = useDeleteCustomScript()
  const scriptTypesQuery = useCustomScriptTypes()

  const fetchScripts = (params?: GetConfigScriptsParams) => {
    return useCustomScripts(params)
  }

  const fetchScriptsByType = (
    type: string,
    params?: Omit<GetConfigScriptsByTypeParams, 'type'>,
  ) => {
    return useCustomScriptsByType(type, params)
  }

  const fetchScript = (inum: string) => {
    return useCustomScript(inum)
  }

  const createScript = async (scriptData: CustomScript) => {
    return await createMutation.mutateAsync({ data: scriptData })
  }

  const updateScript = async (scriptData: CustomScript) => {
    return await updateMutation.mutateAsync({ data: scriptData })
  }

  const deleteScript = async (inum: string) => {
    return await deleteMutation.mutateAsync({ inum })
  }

  const refetchScripts = () => {
    queryClient.invalidateQueries({ queryKey: getGetConfigScriptsQueryKey() })
  }

  const refetchScriptsByType = (type?: string) => {
    if (type) {
      queryClient.invalidateQueries({ queryKey: getGetConfigScriptsByTypeQueryKey(type) })
    } else {
      queryClient.invalidateQueries({ queryKey: ['getConfigScriptsByType'] })
    }
  }

  return {
    fetchScripts,
    fetchScriptsByType,
    fetchScript,
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

interface LegacyScriptAction {
  type: string
  limit?: number
  pattern?: string
  startIndex?: number
}

export function useCustomScriptLegacyActions() {
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
