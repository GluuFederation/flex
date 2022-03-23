/**
 * App Reducers
 */
import mauReducer from './MauReducer'
import healthReducer from './HealthReducer'
import authReducer from './AuthReducer'
import fidoReducer from './FidoReducer'
import initReducer from './InitReducer'
import logoutReducer from './LogoutReducer'
import licenseReducer from './LicenseReducer'
import licenseDetailsReducer from './LicenseDetailsReducer'
import oidcDiscoveryReducer from './OidcDiscoveryReducer'

const appReducers = {
  authReducer,
  fidoReducer,
  initReducer,
  logoutReducer,
  licenseReducer,
  oidcDiscoveryReducer,
  mauReducer,
  healthReducer,
  licenseDetailsReducer,
}

export default appReducers
