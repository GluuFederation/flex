import { handleResponse, handleError } from 'Utils/ApiUtils'

interface ApiInterface {
  isLicenseActive: (callback: (error: any, data: any) => void) => void
  checkAdminuiLicenseConfig: (callback: (error: any, data: any) => void) => void
  activateAdminuiLicense: (options: any, callback: (error: any, data: any) => void) => void
  adminuiPostSsa: (options: any, callback: (error: any, data: any, response: any) => void) => void
  addAdminuiPermission: (options: any, callback: (error: any, data: any) => void) => void
  editAdminuiPermission: (options: any, callback: (error: any, data: any) => void) => void
  deleteAdminuiPermission: (options: any, callback: (error: any, data: any) => void) => void
  getTrialLicense: (callback: (error: any, data: any) => void) => void
  retrieveLicense: (callback: (error: any, data: any) => void) => void
}

interface LicenseRequest {
  payload: any
}

interface AdminPermission {
  [key: string]: any
}

const MAX_RETRIES = 1

export default class LicenseApi {
  private api: ApiInterface

  constructor(api: ApiInterface) {
    this.api = api
  }

  getIsActive = (): Promise<any> => {
    const retries = 0

    return new Promise((resolve, reject) => {
      const makeRequest = (retries: number) => {
        new Promise((resolve, reject) => {
          this.api.isLicenseActive((error, data) => {
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

  checkAdminuiLicenseConfig = (): Promise<any> => {
    const retries = 0
    return new Promise((resolve, reject) => {
      const makeRequest = (retries: number) => {
        new Promise((resolve, reject) => {
          this.api.checkAdminuiLicenseConfig((error, data) => {
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

  submitLicenseKey = (data: LicenseRequest): Promise<any> => {
    const options: { licenseRequest: any } = {
      licenseRequest: data.payload,
    }
    return new Promise((resolve, reject) => {
      this.api.activateAdminuiLicense(options, (error, data) => {
        handleResponse(error, reject, resolve, data, null)
      })
    })
  }

  uploadSSAtoken = (data: LicenseRequest): Promise<any> => {
    const option: { sSARequest: any } = {
      sSARequest: data.payload,
    }
    return new Promise((resolve, reject) => {
      this.api.adminuiPostSsa(option, (error, data, response) => {
        handleResponse(error, reject, resolve, data, response)
      })
    })
  }

  addPermission = (data: AdminPermission): Promise<any> => {
    const options: { adminPermission: AdminPermission } = {
      adminPermission: data,
    }
    return new Promise((resolve, reject) => {
      this.api.addAdminuiPermission(options, (error, data) => {
        handleResponse(error, reject, resolve, data, null)
      })
    })
  }

  editPermission = (data: AdminPermission): Promise<any> => {
    const options: { adminPermission: AdminPermission } = {
      adminPermission: data,
    }
    return new Promise((resolve, reject) => {
      this.api.editAdminuiPermission(options, (error, data) => {
        handleResponse(error, reject, resolve, data, null)
      })
    })
  }

  deletePermission = (data: AdminPermission): Promise<any> => {
    const options: { adminPermission: AdminPermission } = {
      adminPermission: data,
    }
    return new Promise((resolve, reject) => {
      this.api.deleteAdminuiPermission(options, (error, data) => {
        handleResponse(error, reject, resolve, data, null)
      })
    })
  }

  getTrialLicense = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.api.getTrialLicense((error, data) => {
        handleResponse(error, reject, resolve, data, null)
      })
    })
  }

  retrieveLicense = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.api.retrieveLicense((error, data) => {
        handleResponse(error, reject, resolve, data, null)
      })
    })
  }
}
