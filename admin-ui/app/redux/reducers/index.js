/**
 * App Reducers
 */
import { reducer as mauReducer } from 'Plugins/admin/redux/features/mauSlice'
import healthReducer from './HealthReducer'
import authReducer from './AuthReducer'
import fidoReducer from './FidoReducer'
import { reducer as initReducer } from '../features/initSlice'
import logoutReducer from './LogoutReducer'
import licenseReducer from './LicenseReducer'
import { reducer as licenseDetailsReducer } from '../features/licenseDetailsSlice'
import oidcDiscoveryReducer from './OidcDiscoveryReducer'
import attributesReducerRoot from './AttributesReducer'
import toastReducer from './ToastReducer'
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
  attributesReducerRoot,
  toastReducer
}

export default appReducers
