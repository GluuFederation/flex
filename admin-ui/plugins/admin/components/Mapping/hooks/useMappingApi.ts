import { useCallback, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
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
import { extractErrorMessage } from '../../../../schema/utils/errorHandler'

export interface MutationCallbacks {
  onSuccess?: () => void
  onError?: (error: unknown) => void
}

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
    error: mappingQuery.error || rolesQuery.error || permissionsQuery.error,
    refetch: () =>
      Promise.all([mappingQuery.refetch(), rolesQuery.refetch(), permissionsQuery.refetch()]),
  }
}

export const useUpdateMappingWithAudit = (callbacks?: MutationCallbacks) => {
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const { t } = useTranslation()
  const mutation = useMapPermissionsToRole()
  const callbacksRef = useRef(callbacks)
  callbacksRef.current = callbacks

  const updateMapping = useCallback(
    async (data: RolePermissionMapping) => {
      try {
        const result = await mutation.mutateAsync({ data })
        dispatch(updateToast(true, 'success', t('messages.mapping_updated_successfully')))
        queryClient.invalidateQueries({ queryKey: getGetAllAdminuiRolePermissionsQueryKey() })
        callbacksRef.current?.onSuccess?.()
        return result
      } catch (error: unknown) {
        dispatch(
          updateToast(
            true,
            'error',
            extractErrorMessage(error, t('messages.error_updating_mapping')),
          ),
        )
        callbacksRef.current?.onError?.(error)
        throw error
      }
    },
    [mutation, dispatch, queryClient, t],
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
  const { t } = useTranslation()
  const mutation = useAddRolePermissionsMapping()
  const callbacksRef = useRef(callbacks)
  callbacksRef.current = callbacks

  const addMapping = useCallback(
    async (data: RolePermissionMapping) => {
      try {
        const result = await mutation.mutateAsync({ data })
        dispatch(updateToast(true, 'success', t('messages.mapping_added_successfully')))
        queryClient.invalidateQueries({ queryKey: getGetAllAdminuiRolePermissionsQueryKey() })
        callbacksRef.current?.onSuccess?.()
        return result
      } catch (error: unknown) {
        dispatch(
          updateToast(
            true,
            'error',
            extractErrorMessage(error, t('messages.error_adding_mapping')),
          ),
        )
        callbacksRef.current?.onError?.(error)
        throw error
      }
    },
    [mutation, dispatch, queryClient, t],
  )

  return {
    addMapping,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  }
}
