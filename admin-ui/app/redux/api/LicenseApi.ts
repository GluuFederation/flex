import type { AdminPermission, LicenseRequest, LicenseResponse, SSARequest } from 'JansConfigApi'
import type {
  AdminUILicenseApiInterface,
  LicenseRequestPayload,
  SSARequestPayload,
} from './types/LicenseApi'
import { handleTypedResponse, handleError } from 'Utils/ApiUtils'
import { devLogger } from '@/utils/devLogger'

export type {
  AdminUILicenseApiInterface,
  LicenseRequestPayload,
  SSARequestPayload,
} from './types/LicenseApi'

const MAX_RETRIES = 1

export default class LicenseApi {
  private api: AdminUILicenseApiInterface

  constructor(api: AdminUILicenseApiInterface) {
    this.api = api
  }

  getIsActive = (): Promise<LicenseResponse | null> => {
    const retries = 0

    return new Promise((resolve, reject) => {
      const makeRequest = (retries: number) => {
        new Promise<LicenseResponse | null>((resolveInner, reject) => {
          this.api.isLicenseActive((error, data) => {
            if (error) {
              reject(error)
            } else {
              resolveInner(data)
            }
          })
        })
          .then((response) => {
            resolve(response)
          })
          .catch((error) => {
            if (retries < MAX_RETRIES) {
              devLogger.error(`Request failed. Retrying... (${retries + 1}/${MAX_RETRIES})`)
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

  checkAdminuiLicenseConfig = (): Promise<LicenseResponse | null> => {
    const retries = 0
    return new Promise((resolve, reject) => {
      const makeRequest = (retries: number) => {
        new Promise<LicenseResponse | null>((resolveInner, reject) => {
          this.api.checkAdminuiLicenseConfig((error, data) => {
            if (error) {
              reject(error)
            } else {
              resolveInner(data)
            }
          })
        })
          .then((response) => {
            resolve(response)
          })
          .catch((error) => {
            if (retries < MAX_RETRIES) {
              devLogger.error(`Request failed. Retrying... (${retries + 1}/${MAX_RETRIES})`)
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

  submitLicenseKey = (data: LicenseRequestPayload): Promise<LicenseResponse | null> => {
    const options: { licenseRequest: LicenseRequest } = {
      licenseRequest: data.payload,
    }
    return new Promise((resolve, reject) => {
      this.api.activateAdminuiLicense(options, (error, data) => {
        handleTypedResponse<LicenseResponse | null>(error, reject, resolve, data ?? null, null)
      })
    })
  }

  uploadSSAtoken = (data: SSARequestPayload): Promise<LicenseResponse | null> => {
    const option: { sSARequest: SSARequest } = {
      sSARequest: data.payload,
    }
    return new Promise((resolve, reject) => {
      this.api.adminuiPostSsa(option, (error, data) => {
        handleTypedResponse<LicenseResponse | null>(error, reject, resolve, data ?? null, null)
      })
    })
  }

  addPermission = (data: AdminPermission): Promise<AdminPermission[] | null> => {
    const options: { adminPermission: AdminPermission } = {
      adminPermission: data,
    }
    return new Promise((resolve, reject) => {
      this.api.addAdminuiPermission(options, (error, data) => {
        handleTypedResponse<AdminPermission[] | null>(error, reject, resolve, data ?? null, null)
      })
    })
  }

  editPermission = (data: AdminPermission): Promise<AdminPermission[] | null> => {
    const options: { adminPermission: AdminPermission } = {
      adminPermission: data,
    }
    return new Promise((resolve, reject) => {
      this.api.editAdminuiPermission(options, (error, data) => {
        handleTypedResponse<AdminPermission[] | null>(error, reject, resolve, data ?? null, null)
      })
    })
  }

  deletePermission = (data: AdminPermission): Promise<AdminPermission[] | null> => {
    const options: { adminPermission: AdminPermission } = {
      adminPermission: data,
    }
    return new Promise((resolve, reject) => {
      this.api.deleteAdminuiPermission(options, (error, data) => {
        handleTypedResponse<AdminPermission[] | null>(error, reject, resolve, data ?? null, null)
      })
    })
  }

  getTrialLicense = (): Promise<LicenseResponse | null> => {
    return new Promise((resolve, reject) => {
      this.api.getTrialLicense((error, data) => {
        handleTypedResponse<LicenseResponse | null>(error, reject, resolve, data ?? null, null)
      })
    })
  }

  retrieveLicense = (): Promise<LicenseResponse | null> => {
    return new Promise((resolve, reject) => {
      this.api.retrieveLicense((error, data) => {
        handleTypedResponse<LicenseResponse | null>(error, reject, resolve, data ?? null, null)
      })
    })
  }
}
