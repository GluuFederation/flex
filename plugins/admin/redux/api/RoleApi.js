export default class RoleApi {
  constructor(api) {
    this.api = api
  }
  getRoles = () => {
    return new Promise((resolve, reject) => {
      console.log('=============')
    })
  }
  getRole = (options) => {
    return new Promise((resolve, reject) => {
      console.log('=============')
    })
  }

  addRole = (data) => {
    return new Promise((resolve, reject) => {
      console.log('=============')
    })
  }

  editRole = (data) => {
    return new Promise((resolve, reject) => {
      console.log('=============')
    })
  }

  deleteRole = async (inum) => {
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
