export type ApiPermissionItem = {
  inum?: string
  permission?: string
}

export type RolePermissionMappingEntry = {
  role: string
  permissions: string[]
}

export type PermissionActionData =
  | { inum?: string; permission?: string }
  | string
  | null
  | undefined
