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
import {USER_LOGGED_OUT} from '../actions/types'
import jwksReducer from './JwksReducer'

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
  jwksReducer,
};

const allReducers = {...appReducers, healthCheck};
const reducers = combineReducers(allReducers)

const rootReducer = (state, action) => {
  // when a logout action is dispatched it will reset redux state
  if (action.type === USER_LOGGED_OUT) {
    localStorage.clear();
    state = undefined;
  }
  return reducers(state, action);
};

export default rootReducer;
