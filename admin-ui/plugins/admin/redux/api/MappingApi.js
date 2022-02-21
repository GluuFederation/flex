export default class MappingApi {
  constructor(api) {
    this.api = api
  }
  getMappings = () => {
    return new Promise((resolve, reject) => {
      this.api.getAdminuiRolePermissions((error, data) => {
        this.handleResponse(error, reject, resolve, data)
      })
    })
  }

  updateMapping = (data) => {
    const options = {}
    options['rolePermissionMapping'] = data
    return new Promise((resolve, reject) => {
      this.api.mapPermissionsToRole(options, (error, options) => {
        this.handleResponse(error, reject, resolve, data)
      })
    })
  }

  handleResponse(error, reject, resolve, data) {
    if (error) {
      reject(error)
    } else {
      resolve(data)
    }
  }
}
