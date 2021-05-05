/**
 * App Reducers
 */

import authReducer from './AuthReducer'
import scopeReducer from './ScopeReducer'
import attributeReducer from './AttributeReducer'
import jsonConfigReducer from './JsonConfigReducer'
import oidcReducer from './OIDCReducer'
import customScriptReducer from './CustomScriptReducer'
import fidoReducer from './FidoReducer'
import loggingReducer from './LoggingReducer'
import initReducer from './InitReducer'

const appReducers = {
  authReducer,
  scopeReducer,
  attributeReducer,
  oidcReducer,
  customScriptReducer,
  fidoReducer,
  loggingReducer,
  initReducer,
  jsonConfigReducer,
}

export default appReducers;