/**
 * App Reducers
 */
import { combineReducers } from 'redux'
import authReducer from './AuthReducer'
import scopeReducer from './ScopeReducer'
import attributeReducer from './AttributeReducer'
import openidClientReducer from './OpenidClientReducer'
import customScriptReducer from './CustomScriptReducer'
import smtpReducer from './SmtpReducer'
import acrsReducer from './AcrsReducer'
import fidoReducer from './FidoReducer'
import loggingReducer from './LoggingReducer'
import pluginMenuReducer from './PluginMenuReducer'
import {healthCheck} from '../../../plugins/redux/reducers'
import ldapReducer from './LdapReducer'
import couchBaseReducer from './CouchbaseReducer'

const appReducers = {
  authReducer,
  scopeReducer,
  attributeReducer,
  openidClientReducer,
  customScriptReducer,
  smtpReducer,
  acrsReducer,
  fidoReducer,
  loggingReducer,
  pluginMenuReducer,
  ldapReducer,
  couchBaseReducer,
};

const allReducers = {...appReducers, healthCheck};
const reducers = combineReducers(allReducers)

export default reducers
