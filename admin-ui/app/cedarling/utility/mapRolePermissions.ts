// @ts-nocheck

type ApiPermission = { permission: string; tag: string }

export const mapRolePermissions = (apiPermission, rolePermissionMapping) => {
  // Create a map from permission string to its tag
  const permissionTagMap = new Map()
  for (const perm of apiPermission) {
    permissionTagMap.set(perm.permission, perm.tag)
  }

  const result = rolePermissionMapping.map((roleObj) => {
    const mappedPermissions = roleObj.permissions
      .map((perm) => {
        const tag = permissionTagMap.get(perm)
        if (tag) {
          return { name: perm, tag }
        } else {
          return null // Ignore unknown permissions
        }
      })
      .filter((p) => p !== null) // Remove nulls

    return {
      role: roleObj.role,
      permissions: mappedPermissions,
    }
  })

  return result
}

export const findPermissionByUrl = (
  apiPermissions: ApiPermission[],
  url: string,
): ApiPermission | undefined => {
  return apiPermissions.find((perm) => perm.permission === url)
}
