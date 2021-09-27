import {
    CHECK_FOR_VALID_LICENSE,
    CHECK_FOR_VALID_LICENSE_RESPONSE,
    ACTIVATE_LICENSE,
    ACTIVATE_LICENSE_RESPONSE,
  } from './types'
  
  export const checkLicensePresent = () => ({
    type: CHECK_FOR_VALID_LICENSE,
  })
  
  export const checkLicensePresentResponse = (isLicenseValid) => ({
    type: CHECK_FOR_VALID_LICENSE_RESPONSE,
    payload: { isLicenseValid },
  })

  export const activateLicense = (licenseKey) => ({
    type: ACTIVATE_LICENSE,
    payload: { licenseKey },
  })

  export const activateLicenseResponse = (isLicenseValid) => ({
    type: ACTIVATE_LICENSE_RESPONSE,
    payload: { isLicenseValid },
  })