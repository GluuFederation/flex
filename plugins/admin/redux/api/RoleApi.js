export default class RoleApi {
  constructor(api) {
    this.api = api
  }
  getRoles = () => {
    return new Promise((resolve, reject) => {})
  }
  getRole = (options) => {
    return new Promise((resolve, reject) => {})
  }

  addRole = (data) => {
    return new Promise((resolve, reject) => {})
  }

  editRole = (data) => {
    return new Promise((resolve, reject) => {})
  }

  deleteRole = async (inum) => {
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
