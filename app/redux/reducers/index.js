/**
 * App Reducers
 */

import authReducer from './AuthReducer'
import fidoReducer from './FidoReducer'
import initReducer from './InitReducer'
import logoutReducer from './LogoutReducer'
import licenseReducer from './LicenseReducer'

const appReducers = {
  authReducer,
  fidoReducer,
  initReducer,
  logoutReducer,
  licenseReducer,
}

export default appReducers;