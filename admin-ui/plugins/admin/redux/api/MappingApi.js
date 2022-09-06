import { handleResponse } from 'Utils/ApiUtils'

export default class MappingApi {
  constructor(api) {
    this.api = api
  }
  getMappings = () => {
    return new Promise((resolve, reject) => {
      this.api.getAdminuiRolePermissions((error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }

  updateMapping = (data) => {
    const options = {}
    options['rolePermissionMapping'] = data
    return new Promise((resolve, reject) => {
      this.api.mapPermissionsToRole(options, (error, options) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }

  addMapping = (data) => {
    const options = {}
    options['rolePermissionMapping'] = data
    return new Promise((resolve, reject) => {
      this.api.mapPermissionsToRole(options, (error, options) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }
  deleteMapping = (data) => {
    const options = {}
    options['rolePermissionMapping'] = data
    return new Promise((resolve, reject) => {
      this.api.removeRolePermissionsPermission(options, (error, options) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }
}
