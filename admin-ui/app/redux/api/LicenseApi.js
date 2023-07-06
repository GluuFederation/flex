import { handleResponse } from 'Utils/ApiUtils'

export default class LicenseApi {
  constructor(api) {
    this.api = api
  }
  getIsActive = () => {
    return new Promise((resolve, reject) => {
      this.api.isLicenseActive((error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }

  submitLicenseKey = (data) => {
    const options = {}
    options['licenseRequest'] = data.payload
    return new Promise((resolve, reject) => {
      this.api.activateAdminuiLicense(options, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }
  uploadSSAtoken = (data) => {
    const option = {}
    option['sSARequest'] = data.payload
    return new Promise((resolve, reject) => {
      this.api.adminuiPostSsa(option, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }
  checkAdminuiLicenseConfig = () => {
    return new Promise((resolve, reject) => {
      this.api.checkAdminuiLicenseConfig((error, data) => {
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
    const options = {}
    options['adminPermission'] = data
    return new Promise((resolve, reject) => {
      this.api.deleteAdminuiPermission(options, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }

  getTrialLicense = async () => {
    return new Promise((resolve, reject) => {
      this.api.getTrialLicense((error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }
}
