import type { LicenseRequest } from '../../api/types/license'

export interface ResetLicenseAction {
  type: 'license/resetConfig'
  message: string
}

export interface UpdateLicenseDetailsAction {
  type: 'licenseDetails/updateLicenseDetails'
  payload: {
    action: {
      action_data: LicenseRequest
    }
  }
}
