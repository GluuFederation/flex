// @ts-nocheck
import { handleResponse, handleError } from 'Utils/ApiUtils'
const MAX_RETRIES = 1;
export default class LicenseApi {
  constructor(api) {
    this.api = api
  }

  getIsActive = () => {
    let retries = 0;

    return new Promise((resolve, reject) => {
      const makeRequest = (retries) => {
        (new Promise((resolve, reject) => {
          this.api.isLicenseActive((error, data) => {
            if (error) {
              reject(error)
            } else {
              resolve(data)
            }
          })
        }))
          .then(response => { resolve(response) })
          .catch(error => {
            if (retries < MAX_RETRIES) {
              console.error(`Request failed. Retrying... (${retries + 1}/${MAX_RETRIES})`);
              retries++;
              makeRequest(retries);
            } else {
              handleError(error, reject)
            }
          })
      };
      makeRequest(retries);
    })
  }

  checkAdminuiLicenseConfig = () => {
    let retries = 0;
    return new Promise((resolve, reject) => {
      const makeRequest = (retries) => {
        (new Promise((resolve, reject) => {
          this.api.checkAdminuiLicenseConfig((error, data) => {
            if (error) {
              reject(error)
            } else {
              resolve(data)
            }
          })
        }))
          .then(response => { resolve(response) })
          .catch(error => {
            if (retries < MAX_RETRIES) {
              console.error(`Request failed. Retrying... (${retries + 1}/${MAX_RETRIES})`);
              retries++;
              makeRequest(retries);
            } else {
              handleError(error, reject)
            }
          })
      };
      makeRequest(retries);
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
      this.api.adminuiPostSsa(option, (error, data, response) => {
        handleResponse(error, reject, resolve, data, response)
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
    const options = {}
    options['adminPermission'] = data
    return new Promise((resolve, reject) => {
      this.api.deleteAdminuiPermission(options, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }

  getTrialLicense = () => {
    return new Promise((resolve, reject) => {
      this.api.getTrialLicense((error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }

  retrieveLicense = () => {
    return new Promise((resolve, reject) => {
      this.api.retrieveLicense((error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }
}
