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
import fidoReducer from './FidoReducer'
import loggingReducer from './LoggingReducer'
import pluginMenuReducer from './PluginMenuReducer'
import {healthCheck} from '../../../plugins/redux/reducers'

const appReducers = {
  authReducer,
  scopeReducer,
  attributeReducer,
  openidClientReducer,
  customScriptReducer,
  smtpReducer,
  pluginMenuReducer,
};

const allReducers = {...appReducers, healthCheck};
const reducers = combineReducers(allReducers)

export default reducers
