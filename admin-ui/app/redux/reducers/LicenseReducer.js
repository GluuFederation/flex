import {
  CHECK_FOR_VALID_LICENSE,
  CHECK_FOR_VALID_LICENSE_RESPONSE,
  ACTIVATE_LICENSE,
  ACTIVATE_LICENSE_RESPONSE,
} from '../actions/types';
import reducerRegistry from './ReducerRegistry';

const INIT_STATE = {
  isLicenseValid: false,
  islicenseCheckResultLoaded: false,
  isLicenseActivationResultLoaded: false,
};

const reducerName = 'licenseReducer';

export default function licenseReducer(state = INIT_STATE, action) {
  switch (action.type) {
  case CHECK_FOR_VALID_LICENSE:
    return {
      ...state,
      islicenseCheckResultLoaded: false,
    };
  case CHECK_FOR_VALID_LICENSE_RESPONSE:
    if (action.payload.isLicenseValid) {
      return {
        ...state,
        isLicenseValid: action.payload.isLicenseValid,
        islicenseCheckResultLoaded: true,
      };
    } else {
      return {
        ...state,
        islicenseCheckResultLoaded: true,
      };
    }
  case ACTIVATE_LICENSE:
    return {
      ...state,
      isLicenseActivationResultLoaded: false,
    };
  case ACTIVATE_LICENSE_RESPONSE:
    if (action.payload.isLicenseValid) {
      return {
        ...state,
        isLicenseValid: action.payload.isLicenseValid,
        isLicenseActivationResultLoaded: true,
      };
    } else {
      return {
        ...state,
        isLicenseActivationResultLoaded: true,
      };
    }

  default:
    return {
      ...state,
    };
  }
}
reducerRegistry.register(reducerName, licenseReducer);