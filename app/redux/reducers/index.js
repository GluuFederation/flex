/**
 * App Reducers
 */

import authReducer from './AuthReducer'
import attributeReducer from './AttributeReducer'
import fidoReducer from './FidoReducer'
import loggingReducer from './LoggingReducer'
import initReducer from './InitReducer'
import logoutReducer from './LogoutReducer'

const appReducers = {
  authReducer,
  attributeReducer,
  fidoReducer,
  loggingReducer,
  initReducer,
  logoutReducer,
}

export default appReducers;