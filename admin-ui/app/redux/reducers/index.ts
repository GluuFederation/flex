/**
 * App Reducers
 */
import { reducer as mauReducer } from 'Plugins/admin/redux/features/mauSlice'
import healthReducer from '../features/healthSlice'
import authReducer from '../features/authSlice'
import { reducer as initReducer } from '../features/initSlice'
import logoutReducer from '../features/logoutSlice'
import licenseReducer from '../features/licenseSlice'
import { reducer as licenseDetailsReducer } from '../features/licenseDetailsSlice'
import oidcDiscoveryReducer from '../features/oidcDiscoverySlice'
import attributesReducerRoot from '../features/attributesSlice'
import toastReducer from '../features/toastSlice'
import profileDetailsReducer from '../features/ProfileDetailsSlice'
import cedarPermissionsReducer from '../features/cedarPermissionsSlice'
import auditReducer from 'Plugins/admin/redux/features/auditSlice'

const appReducers = {
  authReducer,
  initReducer,
  logoutReducer,
  licenseReducer,
  oidcDiscoveryReducer,
  mauReducer,
  healthReducer,
  licenseDetailsReducer,
  attributesReducerRoot,
  toastReducer,
  profileDetailsReducer,
  cedarPermissions: cedarPermissionsReducer,
  auditReducer,
}

export default appReducers
