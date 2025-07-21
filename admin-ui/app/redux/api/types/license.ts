export interface LicenseDetailsApiInterface {
  getAdminuiLicense: (callback: (error: Error | null, data: any) => void) => void
  editAdminuiLicense: (
    options: { licenseRequest: any },
    callback: (error: Error | null, data: any) => void,
  ) => void
  licenseConfigDelete: (callback: (error: Error | null, data: any, response?: any) => void) => void
}

export interface LicenseApiInterface {
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

export interface LicenseRequest {
  payload?: any
  [key: string]: any
}

export interface AdminPermission {
  [key: string]: any
}
