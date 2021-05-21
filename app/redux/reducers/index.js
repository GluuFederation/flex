/**
 * App Reducers
 */

import authReducer from './AuthReducer'
import fidoReducer from './FidoReducer'
import loggingReducer from './LoggingReducer'
import initReducer from './InitReducer'
import logoutReducer from './LogoutReducer'

const appReducers = {
  authReducer,
  fidoReducer,
  loggingReducer,
  initReducer,
  logoutReducer,
}

export default appReducers;