import { handleResponse } from 'Utils/ApiUtils'

export default class LicenseDetailsApi {
  constructor(api) {
    this.api = api
  }

  getLicenseDetails = () => {
    return new Promise((resolve, reject) => {
      this.api.getAdminuiLicense((error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }

  updateLicenseDetails = (data) => {
    const options = {}
    options['licenseRequest'] = data
    return new Promise((resolve, reject) => {
      this.api.editAdminuiLicense(options, (error, options) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }
}