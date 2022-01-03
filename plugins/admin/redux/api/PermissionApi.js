export default class PermissionApi {
  constructor(api) {
    this.api = api
  }
  getPermissions = () => {
    return new Promise((resolve, reject) => {
      console.log('=============get permissions')
      this.api.getAdminuiPermissions((error, data) => {
        this.handleResponse(error, reject, resolve, data)
      })
    })
  }

  addPermission = (data) => {
    const options = {}
    options['adminPermission'] = data
    return new Promise((resolve, reject) => {
      console.log('============= add permission')
      this.api.addAdminuiPermission(options, (error, data) => {
        this.handleResponse(error, reject, resolve, data)
      })
    })
  }

  editPermission = (data) => {
    const options = {}
    options['adminPermission'] = data
    return new Promise((resolve, reject) => {
      console.log('=============edit permission')
      this.api.editAdminuiPermission(options, (error, data) => {
        this.handleResponse(error, reject, resolve, data)
      })
    })
  }
  permission
  deletePermission = async (data) => {
    return new Promise((resolve, reject) => {
      console.log('=============delete permission')
      this.api.deleteAdminuiPermission(data.role, (error, data) => {
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
