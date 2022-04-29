import {
  CHECK_FOR_VALID_LICENSE,
  CHECK_FOR_VALID_LICENSE_RESPONSE,
  ACTIVATE_CHECK_USER_API,
  ACTIVATE_CHECK_LICENCE_API_VALID,
  ACTIVATE_CHECK_USER_LICENSE_KEY_RESPONSE,
  ACTIVATE_CHECK_USER_LICENSE_KEY,
} from '../actions/types'
import reducerRegistry from './ReducerRegistry'

const INIT_STATE = {
  isLicenseValid: false,
  islicenseCheckResultLoaded: false,
  isLicenseActivationResultLoaded: false,
  isLicenceAPIkeyValid: false,
  isLoading: false,
  error: '',
}

const reducerName = 'licenseReducer'

export default function licenseReducer(state = INIT_STATE, action) {
  switch (action.type) {
    case CHECK_FOR_VALID_LICENSE:
      return {
        ...state,
        islicenseCheckResultLoaded: false,
      }
    case ACTIVATE_CHECK_USER_API:
      return {
        ...state,
        isLoading: true,
        error: '',
      }
    case ACTIVATE_CHECK_USER_LICENSE_KEY:
      return {
        ...state,
        isLoading: true,
        error: '',
      }
    case ACTIVATE_CHECK_LICENCE_API_VALID:
      if (action.payload.apiResult) {
        return {
          ...state,
          isLicenceAPIkeyValid: action.payload,
          error: '',
          isLoading: false,
        }
      } else {
        return {
          ...state,
          error: action.payload.responseMessage,
          isLoading: false,
        }
      }
    case ACTIVATE_CHECK_USER_LICENSE_KEY_RESPONSE:
      if (action.payload.apiResult) {
        return {
          ...state,
          isLicenseValid: action.payload.apiResult,
          error: '',
          isLoading: false,
        }
      } else {
        return {
          ...state,
          error: action.payload.responseMessage,
          isLoading: false,
        }
      }
    case CHECK_FOR_VALID_LICENSE_RESPONSE:
      if (action.payload.isLicenseValid) {
        return {
          ...state,
          isLicenseValid: action.payload.isLicenseValid,
          islicenseCheckResultLoaded: true,
        }
      } else {
        return {
          ...state,
          islicenseCheckResultLoaded: true,
        }
      }

    default:
      return {
        ...state,
      }
  }
}
reducerRegistry.register(reducerName, licenseReducer)
