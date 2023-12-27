import { handleResponse } from 'Utils/ApiUtils'

export default class PermissionApi {
  constructor(api) {
    this.api = api
  }
  getPermissions = () => {
    return new Promise((resolve, reject) => {
      this.api.getAllAdminuiPermissions((error, data) => {
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
  
  deletePermission = (data) => {
    return new Promise((resolve, reject) => {
      this.api.deleteAdminuiPermission(encodeURIComponent(data.permission), (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }
}
