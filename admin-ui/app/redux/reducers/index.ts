/**
 * App Reducers
 */
import authReducer from '../features/authSlice'
import { reducer as initReducer } from '../features/initSlice'
import logoutReducer from '../features/logoutSlice'
import licenseReducer from '../features/licenseSlice'
import toastReducer from '../features/toastSlice'
import profileDetailsReducer from '../features/ProfileDetailsSlice'
import cedarPermissionsReducer from '../features/cedarPermissionsSlice'
import logoutAuditReducer from '../features/sessionSlice'

const appReducers = {
  authReducer,
  initReducer,
  logoutReducer,
  licenseReducer,
  toastReducer,
  profileDetailsReducer,
  cedarPermissions: cedarPermissionsReducer,
  logoutAuditReducer,
}

export default appReducers
