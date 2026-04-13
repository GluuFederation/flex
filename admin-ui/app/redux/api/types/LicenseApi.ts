import type { AdminPermission, LicenseRequest, LicenseResponse, SSARequest } from 'JansConfigApi'

/** Callback-style API from jans_config_api AdminUILicenseApi (used by saga with getClientWithToken) */
export type AdminUILicenseApiInterface = {
  isLicenseActive: (callback: (error: Error | null, data: LicenseResponse | null) => void) => void
  checkAdminuiLicenseConfig: (
    callback: (error: Error | null, data: LicenseResponse | null) => void,
  ) => void
  activateAdminuiLicense: (
    options: { licenseRequest: LicenseRequest },
    callback: (error: Error | null, data: LicenseResponse | null) => void,
  ) => void
  adminuiPostSsa: (
    options: { sSARequest: SSARequest },
    callback: (error: Error | null, data: LicenseResponse | null) => void,
  ) => void
  addAdminuiPermission: (
    options: { adminPermission: AdminPermission },
    callback: (error: Error | null, data: AdminPermission[] | null) => void,
  ) => void
  editAdminuiPermission: (
    options: { adminPermission: AdminPermission },
    callback: (error: Error | null, data: AdminPermission[] | null) => void,
  ) => void
  deleteAdminuiPermission: (
    options: { adminPermission: AdminPermission },
    callback: (error: Error | null, data: AdminPermission[] | null) => void,
  ) => void
  getTrialLicense: (callback: (error: Error | null, data: LicenseResponse | null) => void) => void
  retrieveLicense: (callback: (error: Error | null, data: LicenseResponse | null) => void) => void
}

/** Payload for submitLicenseKey (saga passes { payload: LicenseRequest }) */
export type LicenseRequestPayload = {
  payload: LicenseRequest
}

/** Payload for uploadSSAtoken (saga passes { payload: SSARequest }) */
export type SSARequestPayload = {
  payload: SSARequest
}

/** Generic response shape from license API (success + responseObject). */
export type LicenseApiGenericResponse = {
  success?: boolean
  responseObject?: Record<string, string> | Array<{ name?: string; value?: string }>
}
