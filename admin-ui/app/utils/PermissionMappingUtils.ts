// Utilities for resolving permission keys, computing mapped roles, and building user-friendly messages

export type ApiPermissionItem = {
  inum?: string
  permission?: string
  [key: string]: unknown
}

export type RolePermissionMappingEntry = {
  role: string
  permissions: string[]
}

type ActionData =
  | { inum?: string; permission?: string; [key: string]: unknown }
  | string
  | null
  | undefined

/**
 * Resolve the permission key (string) from actionData and the list of apiPermissions.
 * actionData may be an object with { inum, permission } or just an inum string.
 */
export function resolvePermissionKey(
  actionData: ActionData,
  apiPermissions: ApiPermissionItem[] | undefined,
): string | undefined {
  const isObject = (value: ActionData): value is { inum?: string; permission?: string } => {
    return typeof value === 'object' && value !== null
  }

  const permissionFromAction = isObject(actionData) ? actionData.permission : undefined
  if (permissionFromAction) return permissionFromAction

  const permissionInum = isObject(actionData) ? actionData.inum : actionData
  if (!permissionInum) return undefined

  const found = Array.isArray(apiPermissions)
    ? apiPermissions.find((p) => p?.inum === permissionInum)
    : undefined
  return found?.permission
}

/**
 * Find roles that contain the given permission key using the role-permission mapping from the store.
 */
export function findRolesForPermission(
  permissionKey: string | undefined,
  rolePermissionMapping: RolePermissionMappingEntry[] | undefined,
): string[] {
  if (!permissionKey || !Array.isArray(rolePermissionMapping)) return []
  return rolePermissionMapping
    .filter((r) => Array.isArray(r?.permissions) && r.permissions.includes(permissionKey))
    .map((r) => r.role)
}

export function buildMappingGuidanceMessage(
  permissionKey: string | undefined,
  mappedRoles: string[] | undefined,
): string {
  const rolesList = mappedRoles ? mappedRoles.join(', ') : ''
  const rolesWord = mappedRoles ? (mappedRoles.length > 1 ? 'roles' : 'role') : ''
  return ` This permission is mapped to ${rolesWord}: ${rolesList}. Please remove it from mapping menu.`
}

export function buildPermissionDeleteErrorMessage(
  error: unknown,
  actionData: ActionData,
  apiPermissions: ApiPermissionItem[] | undefined,
  rolePermissionMapping: RolePermissionMappingEntry[] | undefined,
): string {
  const permissionKey = resolvePermissionKey(actionData, apiPermissions)
  const mappedRoles = findRolesForPermission(permissionKey, rolePermissionMapping)
  return buildMappingGuidanceMessage(permissionKey, mappedRoles)
}
