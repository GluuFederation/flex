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
  getPermission = (options) => {
    return new Promise((resolve, reject) => {
      console.log('============= get single permission')
    })
  }

  addPermission = (data) => {
    return new Promise((resolve, reject) => {
      console.log('============= add permission')
    })
  }

  editPermission = (data) => {
    return new Promise((resolve, reject) => {
      console.log('=============edit permission')
    })
  }

  deletePermission = async (inum) => {
    return new Promise((resolve, reject) => {
      console.log('=============delete permission')
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
