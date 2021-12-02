export default class RoleApi {
  constructor(api) {
    this.api = api
  }
  getRoles = () => {
    return new Promise((resolve, reject) => {
      console.log('=============get roles')
    })
  }
  getRole = (options) => {
    return new Promise((resolve, reject) => {
      console.log('=============get role')
    })
  }

  addRole = (data) => {
    return new Promise((resolve, reject) => {
      console.log('============= add role ' + data)
    })
  }

  editRole = (data) => {
    return new Promise((resolve, reject) => {
      console.log('=============edit role ' + data)
    })
  }

  deleteRole = async (inum) => {
    return new Promise((resolve, reject) => {
      console.log('=============delete role ' + inum)
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
