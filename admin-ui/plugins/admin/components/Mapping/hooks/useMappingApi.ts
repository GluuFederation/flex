import { useCallback, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useQueryClient } from '@tanstack/react-query'
import {
  useGetAllAdminuiRolePermissions,
  useGetAllAdminuiRoles,
  useGetAllAdminuiPermissions,
  useMapPermissionsToRole,
  useAddRolePermissionsMapping,
  getGetAllAdminuiRolePermissionsQueryKey,
} from 'JansConfigApi'
import type { RolePermissionMapping } from 'JansConfigApi'
import { updateToast } from 'Redux/features/toastSlice'

export interface MutationCallbacks {
  onSuccess?: () => void
  onError?: (error: unknown) => void
}

const extractErrorMessage = (error: unknown, fallback: string): string =>
  (error as { response?: { data?: { responseMessage?: string } } })?.response?.data
    ?.responseMessage ||
  (error as Error)?.message ||
  fallback

export const useMappingData = (enabled: boolean = true) => {
  const mappingQuery = useGetAllAdminuiRolePermissions({
    query: { enabled },
  })

  const rolesQuery = useGetAllAdminuiRoles({
    query: { enabled },
  })

  const permissionsQuery = useGetAllAdminuiPermissions({
    query: { enabled },
  })

  return {
    mapping: mappingQuery.data ?? [],
    roles: rolesQuery.data ?? [],
    permissions: permissionsQuery.data ?? [],
    isLoading: mappingQuery.isLoading || rolesQuery.isLoading || permissionsQuery.isLoading,
    isError: mappingQuery.isError || rolesQuery.isError || permissionsQuery.isError,
    refetch: () => {
      mappingQuery.refetch()
      rolesQuery.refetch()
      permissionsQuery.refetch()
    },
  }
}

export const useUpdateMappingWithAudit = (callbacks?: MutationCallbacks) => {
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const mutation = useMapPermissionsToRole()
  const callbacksRef = useRef(callbacks)
  callbacksRef.current = callbacks

  const updateMapping = useCallback(
    async (data: RolePermissionMapping) => {
      try {
        const result = await mutation.mutateAsync({ data })
        dispatch(updateToast(true, 'success', 'Mapping updated successfully'))
        queryClient.invalidateQueries({ queryKey: getGetAllAdminuiRolePermissionsQueryKey() })
        callbacksRef.current?.onSuccess?.()
        return result
      } catch (error: unknown) {
        dispatch(updateToast(true, 'error', extractErrorMessage(error, 'Failed to update mapping')))
        callbacksRef.current?.onError?.(error)
        throw error
      }
    },
    [mutation, dispatch, queryClient],
  )

  return {
    updateMapping,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  }
}

export const useAddMappingWithAudit = (callbacks?: MutationCallbacks) => {
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const mutation = useAddRolePermissionsMapping()
  const callbacksRef = useRef(callbacks)
  callbacksRef.current = callbacks

  const addMapping = useCallback(
    async (data: RolePermissionMapping) => {
      try {
        const result = await mutation.mutateAsync({ data })
        dispatch(updateToast(true, 'success', 'Mapping added successfully'))
        queryClient.invalidateQueries({ queryKey: getGetAllAdminuiRolePermissionsQueryKey() })
        callbacksRef.current?.onSuccess?.()
        return result
      } catch (error: unknown) {
        dispatch(updateToast(true, 'error', extractErrorMessage(error, 'Failed to add mapping')))
        callbacksRef.current?.onError?.(error)
        throw error
      }
    },
    [mutation, dispatch, queryClient],
  )

  return {
    addMapping,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  }
}
