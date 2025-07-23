import { handleResponse, handleError } from 'Utils/ApiUtils'
import { LicenseDetailsApiInterface, LicenseRequest } from './types/license'

const MAX_RETRIES = 1

export default class LicenseDetailsApi {
  private readonly api: LicenseDetailsApiInterface

  constructor(api: LicenseDetailsApiInterface) {
    this.api = api
  }

  getLicenseDetails = (): Promise<any> => {
    const retries = 0
    return new Promise((resolve, reject) => {
      const makeRequest = (retries: number): void => {
        new Promise((resolve, reject) => {
          this.api.getAdminuiLicense((error: Error | null, data: any) => {
            if (error) {
              reject(error)
            } else {
              resolve(data)
            }
          })
        })
          .then((response) => {
            resolve(response)
          })
          .catch((error) => {
            if (retries < MAX_RETRIES) {
              console.error(`Request failed. Retrying... (${retries + 1}/${MAX_RETRIES})`)
              retries++
              makeRequest(retries)
            } else {
              handleError(error, reject)
            }
          })
      }
      makeRequest(retries)
    })
  }

  updateLicenseDetails = (data: LicenseRequest): Promise<any> => {
    const options: { licenseRequest: LicenseRequest } = {
      licenseRequest: data,
    }
    return new Promise((resolve, reject) => {
      this.api.editAdminuiLicense(options, (error: Error | null, response: any) => {
        handleResponse(error, reject, resolve, data, response)
      })
    })
  }

  deleteLicense = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.api.licenseConfigDelete((error: Error | null, data: any) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }
}
