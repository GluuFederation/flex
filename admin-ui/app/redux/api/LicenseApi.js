export default class LicenseApi {
  constructor(api) {
    this.api = api
  }
  getIsActive = () => {
    return new Promise((resolve, reject) => {
      this.api.isLicenseActive((error, data) => {
        this.handleResponse(error, reject, resolve, data)
      })
    })
  }

  submitApiKey = (data) => {
    const options = {}
    options['licenseSpringCredentials'] = data
    return new Promise((resolve, reject) => {
      this.api.saveLicenseApiCredentials(options, (error, data) => {
        this.handleResponse(error, reject, resolve, data)
      })
    })
  }
  submitLicenseKey = (data) => {
    const options = {}
    options['licenseApiRequest'] = data
    return new Promise((resolve, reject) => {
      this.api.activateAdminuiLicense(options, (error, data) => {
        this.handleResponse(error, reject, resolve, data)
      })
    })
  }

  addPermission = (data) => {
    const options = {}
    options['adminPermission'] = data
    return new Promise((resolve, reject) => {
      this.api.addAdminuiPermission(options, (error, data) => {
        this.handleResponse(error, reject, resolve, data)
      })
    })
  }

  editPermission = (data) => {
    const options = {}
    options['adminPermission'] = data
    return new Promise((resolve, reject) => {
      this.api.editAdminuiPermission(options, (error, data) => {
        this.handleResponse(error, reject, resolve, data)
      })
    })
  }
  permission
  deletePermission = async (data) => {
    const options = {}
    options['adminPermission'] = data
    return new Promise((resolve, reject) => {
      this.api.deleteAdminuiPermission(options, (error, data) => {
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
