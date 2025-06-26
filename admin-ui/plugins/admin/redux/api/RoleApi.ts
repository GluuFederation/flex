import { handleResponse } from 'Utils/ApiUtils'

interface ApiInterface {
  getAllAdminuiRoles: (callback: (error: Error | null, data: unknown) => void) => void
  addAdminuiRole: (
    options: { adminRole: AdminRole },
    callback: (error: Error | null, data: unknown) => void,
  ) => void
  editAdminuiRole: (
    options: { adminRole: AdminRole },
    callback: (error: Error | null, data: unknown) => void,
  ) => void
  deleteAdminuiRole: (role: string, callback: (error: Error | null, data: unknown) => void) => void
}

interface AdminRole {
  [key: string]: unknown
}

interface DeleteRoleData {
  role: string
}

export default class RoleApi {
  private readonly api: ApiInterface

  constructor(api: ApiInterface) {
    this.api = api
  }

  getRoles = (): Promise<unknown> => {
    return new Promise((resolve, reject) => {
      this.api.getAllAdminuiRoles((error: Error | null, data: unknown) => {
        handleResponse(error, reject, resolve, data, undefined)
      })
    })
  }

  addRole = (data: AdminRole): Promise<unknown> => {
    const options: { adminRole: AdminRole } = {
      adminRole: data,
    }
    return new Promise((resolve, reject) => {
      this.api.addAdminuiRole(options, (error: Error | null, data: unknown) => {
        handleResponse(error, reject, resolve, data, undefined)
      })
    })
  }

  editRole = (data: AdminRole): Promise<unknown> => {
    const options: { adminRole: AdminRole } = {
      adminRole: data,
    }
    return new Promise((resolve, reject) => {
      this.api.editAdminuiRole(options, (error: Error | null, data: unknown) => {
        handleResponse(error, reject, resolve, data, undefined)
      })
    })
  }

  deleteRole = (data: DeleteRoleData): Promise<unknown> => {
    return new Promise((resolve, reject) => {
      this.api.deleteAdminuiRole(data.role, (error: Error | null, data: unknown) => {
        handleResponse(error, reject, resolve, data, undefined)
      })
    })
  }
}
