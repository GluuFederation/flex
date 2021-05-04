/**
 * App Reducers
 */

import authReducer from './AuthReducer'
import scopeReducer from './ScopeReducer'
import attributeReducer from './AttributeReducer'
import jsonConfigReducer from './JsonConfigReducer'
import oidcReducer from './OIDCReducer'
import customScriptReducer from './CustomScriptReducer'
import smtpReducer from './SmtpReducer'
import acrReducer from './AcrReducer'
import fidoReducer from './FidoReducer'
import loggingReducer from './LoggingReducer'
import ldapReducer from './LdapReducer'
import couchBaseReducer from './CouchbaseReducer'
import cacheReducer from './CacheReducer'
import jwksReducer from './JwksReducer'
import initReducer from './InitReducer'

const appReducers = {
  authReducer,
  scopeReducer,
  attributeReducer,
  oidcReducer,
  customScriptReducer,
  smtpReducer,
  acrReducer,
  fidoReducer,
  loggingReducer,
  ldapReducer,
  couchBaseReducer,
  cacheReducer,
  jwksReducer,
  initReducer,
  jsonConfigReducer,
}

export default appReducers;