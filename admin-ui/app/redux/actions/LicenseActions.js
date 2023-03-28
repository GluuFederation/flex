import {
  CHECK_FOR_VALID_LICENSE,
  CHECK_FOR_VALID_LICENSE_RESPONSE,
  ACTIVATE_CHECK_USER_API,
  ACTIVATE_CHECK_USER_LICENSE_KEY_RESPONSE,
  ACTIVATE_CHECK_USER_LICENSE_KEY,
  ACTIVATE_CHECK_IS_CONFIG_VALID,
  ACTIVATE_CHECK_IS_CONFIG_VALID_RESPONSE,
  UPLOAD_NEW_SSA_TOKEN
} from './types'

export const checkLicensePresent = (token) => ({
  type: CHECK_FOR_VALID_LICENSE,
  payload: { token },
})

export const checkUserApi = (payload) => ({
  type: ACTIVATE_CHECK_USER_API,
  payload: { payload },
})

export const checkUserLicenceKey = (payload) => ({
  type: ACTIVATE_CHECK_USER_LICENSE_KEY,
  payload: { payload },
})
export const checkUserLicenseKeyResponse = (payload) => ({
  type: ACTIVATE_CHECK_USER_LICENSE_KEY_RESPONSE,
  payload: payload,
})
export const checkLicensePresentResponse = (isLicenseValid) => ({
  type: CHECK_FOR_VALID_LICENSE_RESPONSE,
  payload: { isLicenseValid },
})
export const checkLicenseConfigValid = () => ({
  type: ACTIVATE_CHECK_IS_CONFIG_VALID,
})
export const checkLicenseConfigValidResponse = (apiResult) => ({
  type: ACTIVATE_CHECK_IS_CONFIG_VALID_RESPONSE,
  payload:  apiResult ,
})
export const uploadNewSsaToken = (data) => ({
  type: UPLOAD_NEW_SSA_TOKEN,
  payload:  data ,
})
