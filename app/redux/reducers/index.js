/**
 * App Reducers
 */

import authReducer from './AuthReducer'
import fidoReducer from './FidoReducer'
import initReducer from './InitReducer'
import logoutReducer from './LogoutReducer'

const appReducers = {
  authReducer,
  fidoReducer,
  initReducer,
  logoutReducer,
}

export default appReducers;