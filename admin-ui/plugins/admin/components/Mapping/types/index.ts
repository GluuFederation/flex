import type { RolePermissionMapping, AdminRole, AdminPermission } from 'JansConfigApi'

export type { RolePermissionMapping, AdminRole, AdminPermission }

export interface MappingItemProps {
  candidate: RolePermissionMapping
}

export interface MappingAddDialogFormProps {
  handler: () => void
  modal: boolean
  onAccept: (roleData: RolePermissionMapping) => void
  roles: AdminRole[]
  permissions: AdminPermission[]
  mapping?: RolePermissionMapping[]
}

export interface ThemeContextValue {
  state: {
    theme: string
  }
}
