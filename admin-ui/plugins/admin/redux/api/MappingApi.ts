import { handleResponse } from 'Utils/ApiUtils'

interface IApi {
  getAllAdminuiRolePermissions: (callback: (error: Error | null, data: unknown) => void) => void
  mapPermissionsToRole: (
    options: { rolePermissionMapping: unknown },
    callback: (error: Error | null, data: unknown) => void,
  ) => void
  removeRolePermissionsPermission: (
    role: string,
    callback: (error: Error | null, data: unknown) => void,
  ) => void
}

interface RolePermissionMapping {
  [key: string]: unknown
}

interface DeleteMappingData {
  role: string
}

export default class MappingApi {
  private readonly api: IApi

  constructor(api: IApi) {
    this.api = api
  }

  getMappings = (): Promise<unknown> => {
    return new Promise((resolve, reject) => {
      this.api.getAllAdminuiRolePermissions((error: Error | null, data: unknown) => {
        handleResponse(error, reject, resolve, data, null)
      })
    })
  }

  updateMapping = (data: RolePermissionMapping): Promise<unknown> => {
    const options: { rolePermissionMapping: RolePermissionMapping } = {
      rolePermissionMapping: data,
    }
    return new Promise((resolve, reject) => {
      this.api.mapPermissionsToRole(options, (error: Error | null, data: unknown) => {
        handleResponse(error, reject, resolve, data, null)
      })
    })
  }

  addMapping = (data: RolePermissionMapping): Promise<unknown> => {
    const options: { rolePermissionMapping: RolePermissionMapping } = {
      rolePermissionMapping: data,
    }
    return new Promise((resolve, reject) => {
      this.api.mapPermissionsToRole(options, (error: Error | null, data: unknown) => {
        handleResponse(error, reject, resolve, data, null)
      })
    })
  }

  deleteMapping = (data: DeleteMappingData): Promise<unknown> => {
    return new Promise((resolve, reject) => {
      this.api.removeRolePermissionsPermission(data.role, (error: Error | null, data: unknown) => {
        handleResponse(error, reject, resolve, data, null)
      })
    })
  }
}
