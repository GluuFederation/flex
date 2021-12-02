export default class PermissionApi {
  constructor(api) {
    this.api = api
  }
  getPermissions = () => {
    return new Promise((resolve, reject) => {})
  }
  getPermission = (options) => {
    return new Promise((resolve, reject) => {})
  }

  addPermission = (data) => {
    return new Promise((resolve, reject) => {})
  }

  editPermission = (data) => {
    return new Promise((resolve, reject) => {})
  }

  deletePermission = async (inum) => {
    return new Promise((resolve, reject) => {})
  }

  handleResponse(error, reject, resolve, data) {
    if (error) {
      reject(error)
    } else {
      resolve(data)
    }
  }
}
