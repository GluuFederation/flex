export interface TMappingApi {
  getAllAdminuiRolePermissions: (
    callback: (error: any, data: any) => void
  ) => Promise<any>
  mapPermissionsToRole: (
    opts: any,
    callback: (error: any, data: any) => void
  ) => Promise<any>
  removeRolePermissionsPermission: (
    opts: any,
    callback: (error: any, data: any) => void
  ) => Promise<any>
}

export interface TPermissionApi {
  getAllAdminuiPermissions: (
    callback: (error: any, data: any) => void
  ) => Promise<any>
  addAdminuiPermission: (
    opts: any,
    callback: (error: any, data: any) => void
  ) => Promise<any>
  editAdminuiPermission: (
    opts: any,
    callback: (error: any, data: any) => void
  ) => Promise<any>
  deleteAdminuiPermission: (
    opts: any,
    callback: (error: any, data: any) => void
  ) => Promise<any>
}

export interface TRoleApi {
  getAllAdminuiRoles: (
    callback: (error: any, data: any) => void
  ) => Promise<any>
  addAdminuiRole: (
    opts: any,
    callback: (error: any, data: any) => void
  ) => Promise<any>
  editAdminuiRole: (
    opts: any,
    callback: (error: any, data: any) => void
  ) => Promise<any>
  deleteAdminuiRole: (
    opts: string,
    callback: (error: any, data: any) => void
  ) => Promise<any>
}

export interface TScriptApi {
  getConfigScripts: (
    opts: any,
    callback: (error: any, data: any) => void
  ) => Promise<any>
  getConfigScriptsByType: (
    type: any,
    opts: any,
    callback: (error: any, data: any) => void
  ) => Promise<any>
  postConfigScripts: (
    opts: string,
    callback: (error: any, data: any) => void
  ) => Promise<any>
  putConfigScripts: (
    opts: string,
    callback: (error: any, data: any) => void
  ) => Promise<any>
  getConfigScriptsByInum: (
    opts: string,
    callback: (error: any, data: any) => void
  ) => Promise<any>
  deleteConfigScriptsByInum: (
    inum: string,
    callback: (error: any, data: any) => void
  ) => Promise<any>
}
