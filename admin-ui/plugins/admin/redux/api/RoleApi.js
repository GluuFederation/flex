import { handleResponse } from 'Utils/ApiUtils'

export default class RoleApi {
  constructor(api) {
    this.api = api
  }
  getRoles = () => {
    return new Promise((resolve, reject) => {
      this.api.getAdminuiRoles((error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }

  addRole = (data) => {
    const options = {}
    options['adminRole'] = data
    return new Promise((resolve, reject) => {
      this.api.addAdminuiRole(options, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }

  editRole = (data) => {
    const options = {}
    options['adminRole'] = data
    return new Promise((resolve, reject) => {
      this.api.editAdminuiRole(options, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }

  deleteRole = async (data) => {
    const options = {}
    options['adminRole'] = data
    return new Promise((resolve, reject) => {
      this.api.deleteAdminuiRole(options, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }
}
