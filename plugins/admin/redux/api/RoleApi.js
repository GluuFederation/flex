export default class RoleApi {
  constructor(api) {
    this.api = api
  }
  getRoles = () => {
    return new Promise((resolve, reject) => {
      this.api.getAdminuiRoles((error, data) => {
        this.handleResponse(error, reject, resolve, data)
      })
    })
  }

  addRole = (data) => {
    const options = {}
    options['adminRole'] = data
    return new Promise((resolve, reject) => {
      this.api.addAdminuiRole(options, (error, data) => {
        this.handleResponse(error, reject, resolve, data)
      })
    })
  }

  editRole = (data) => {
    const options = {}
    options['adminRole'] = data
    return new Promise((resolve, reject) => {
      this.api.editAdminuiRole(data.role, options, (error, data) => {
        this.handleResponse(error, reject, resolve, data)
      })
    })
  }

  deleteRole = async (data) => {
    return new Promise((resolve, reject) => {
      this.api.deleteAdminuiRole(data.role, (error, data) => {
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
