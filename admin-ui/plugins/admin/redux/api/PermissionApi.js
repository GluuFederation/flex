export default class PermissionApi {
  constructor(api) {
    this.api = api
  }
  getPermissions = () => {
    return new Promise((resolve, reject) => {
      this.api.getAdminuiPermissions((error, data) => {
        this.handleResponse(error, reject, resolve, data)
      })
    })
  }

  addPermission = (data) => {
    const options = {}
    options['adminPermission'] = data
    return new Promise((resolve, reject) => {
      this.api.addAdminuiPermission(options, (error, data) => {
        this.handleResponse(error, reject, resolve, data)
      })
    })
  }

  editPermission = (data) => {
    const options = {}
    options['adminPermission'] = data
    return new Promise((resolve, reject) => {
      this.api.editAdminuiPermission(options, (error, data) => {
        this.handleResponse(error, reject, resolve, data)
      })
    })
  }
  permission
  deletePermission = async (data) => {
    const options = {}
    options['adminPermission'] = data
    return new Promise((resolve, reject) => {
      this.api.deleteAdminuiPermission(options, (error, data) => {
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
