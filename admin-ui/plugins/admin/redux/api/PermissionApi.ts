import { handleResponse } from 'Utils/ApiUtils'

interface ApiInterface {
  getAllAdminuiPermissions: (callback: (error: Error | null, data: unknown) => void) => void
  addAdminuiPermission: (
    options: { adminPermission: AdminPermission },
    callback: (error: Error | null, data: unknown) => void,
  ) => void
  editAdminuiPermission: (
    options: { adminPermission: AdminPermission },
    callback: (error: Error | null, data: unknown) => void,
  ) => void
  deleteAdminuiPermission: (
    permission: string,
    callback: (error: Error | null, data: unknown) => void,
  ) => void
}

interface AdminPermission {
  permission?: string
  [key: string]: unknown
}

interface DeletePermissionData {
  permission: string
}

export default class PermissionApi {
  private api: ApiInterface

  constructor(api: ApiInterface) {
    this.api = api
  }

  getPermissions = (): Promise<unknown> => {
    return new Promise((resolve, reject) => {
      this.api.getAllAdminuiPermissions((error: Error | null, data: unknown) => {
        handleResponse(error, reject, resolve, data, null)
      })
    })
  }

  addPermission = (data: AdminPermission): Promise<unknown> => {
    const options: { adminPermission: AdminPermission } = {
      adminPermission: data,
    }
    return new Promise((resolve, reject) => {
      this.api.addAdminuiPermission(options, (error: Error | null, data: unknown) => {
        handleResponse(error, reject, resolve, data, null)
      })
    })
  }

  editPermission = (data: AdminPermission): Promise<unknown> => {
    const options: { adminPermission: AdminPermission } = {
      adminPermission: data,
    }
    return new Promise((resolve, reject) => {
      this.api.editAdminuiPermission(options, (error: Error | null, data: unknown) => {
        handleResponse(error, reject, resolve, data, null)
      })
    })
  }

  deletePermission = (data: DeletePermissionData): Promise<unknown> => {
    return new Promise((resolve, reject) => {
      this.api.deleteAdminuiPermission(
        encodeURIComponent(data.permission),
        (error: Error | null, data: unknown) => {
          handleResponse(error, reject, resolve, data, null)
        },
      )
    })
  }
}
