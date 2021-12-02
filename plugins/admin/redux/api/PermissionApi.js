export default class PermissionApi {
  constructor(api) {
    this.api = api
  }
  getPermissions = () => {
    return new Promise((resolve, reject) => {
      console.log('=============')
    })
  }
  getPermission = (options) => {
    return new Promise((resolve, reject) => {
      console.log('=============')
    })
  }

  addPermission = (data) => {
    return new Promise((resolve, reject) => {
      console.log('=============')
    })
  }

  editPermission = (data) => {
    return new Promise((resolve, reject) => {
      console.log('=============')
    })
  }

  deletePermission = async (inum) => {
    return new Promise((resolve, reject) => {
      console.log('=============')
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
