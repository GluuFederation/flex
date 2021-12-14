export default class RoleMappingApi {
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

  handleResponse(error, reject, resolve, data) {
    if (error) {
      reject(error)
    } else {
      resolve(data)
    }
  }
}
