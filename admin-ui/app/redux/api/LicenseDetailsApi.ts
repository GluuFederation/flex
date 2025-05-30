// @ts-nocheck
import { handleResponse, handleError } from 'Utils/ApiUtils'
const MAX_RETRIES = 1;
export default class LicenseDetailsApi {
  constructor(api) {
    this.api = api
  }

  getLicenseDetails = () => {
    let retries = 0;
    return new Promise((resolve, reject) => {
      const makeRequest = (retries) => {
        (new Promise((resolve, reject) => {
          this.api.getAdminuiLicense((error, data) => {
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