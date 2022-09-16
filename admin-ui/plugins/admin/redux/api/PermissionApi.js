import { handleResponse } from 'Utils/ApiUtils'

export default class PermissionApi {
  constructor(api) {
    this.api = api
  }
  getPermissions = () => {
    return new Promise((resolve, reject) => {
      this.api.getAdminuiPermissions((error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }

  addPermission = (data) => {
    const options = {}
    options['adminPermission'] = data
    return new Promise((resolve, reject) => {
      this.api.addAdminuiPermission(options, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }

  editPermission = (data) => {
    const options = {}
    options['adminPermission'] = data
    return new Promise((resolve, reject) => {
      this.api.editAdminuiPermission(options, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }
  
  deletePermission = async (data) => {
    return new Promise((resolve, reject) => {
      this.api.deleteAdminuiPermission(data.permission, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }
}
