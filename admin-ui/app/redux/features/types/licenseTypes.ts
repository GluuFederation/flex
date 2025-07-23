export interface LicenseState {
  isLicenseValid: boolean
  islicenseCheckResultLoaded: boolean
  isLicenseActivationResultLoaded: boolean
  isLicenceAPIkeyValid: boolean
  isLoading: boolean
  isConfigValid: boolean | null
  error: string
  errorSSA: string
  generatingTrialKey: boolean
  isNoValidLicenseKeyFound: boolean
  isUnderThresholdLimit: boolean
  isValidatingFlow: boolean
}
