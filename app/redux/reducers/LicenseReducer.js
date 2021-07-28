import {
  CHECK_FOR_VALID_LICENSE,
  CHECK_FOR_VALID_LICENSE_RESPONSE,
  ACTIVATE_LICENSE,
  ACTIVATE_LICENSE_RESPONSE,
} from '../actions/types'
import reducerRegistry from './ReducerRegistry';

const INIT_STATE = {
  isLicensePresent: false,
  isLoadedLicensePresent: false,
}

const reducerName = 'licenseReducer';

export default function licenseReducer(state = INIT_STATE, action) {
  switch (action.type) {
    case CHECK_FOR_VALID_LICENSE:
      return {
        ...state,
      }
    case CHECK_FOR_VALID_LICENSE_RESPONSE:
      if (action.payload.isLicensePresent) {
        return {
          ...state,
          isLicensePresent: action.payload.isLicensePresent,
          isLoadedLicensePresent: true,
        }
      } else {
        return {
          ...state,
          isLoadedLicensePresent: true,
        }
      }
    case ACTIVATE_LICENSE:
      return {
        ...state,
      }
    case ACTIVATE_LICENSE_RESPONSE:
      if (action.payload.isLicensePresent) {
        return {
          ...state,
          isLicensePresent: action.payload.isLicensePresent,
          isLoadedLicensePresent: true,
        }
      } else {
        return {
          ...state,
          isLoadedLicensePresent: true,
        }
      }

    default:
      return {
        ...state,
      }
  }
}
reducerRegistry.register(reducerName, licenseReducer);