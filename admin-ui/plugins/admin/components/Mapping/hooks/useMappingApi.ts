import {
  useGetAllAdminuiRolePermissions,
  useGetAllAdminuiRoles,
  useGetAllAdminuiPermissions,
} from 'JansConfigApi'

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
