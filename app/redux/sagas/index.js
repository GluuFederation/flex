/**
 * Root Sagas
 */
import { all } from 'redux-saga/effects'

// sagas
import authSagas from './AuthSaga'
import scopesSagas from './OAuthScopeSaga'
import attributeSaga from './AttributeSaga'
import openidClientSaga from './OpenidClientSaga'
import customScriptSaga from './CustomScriptSaga'
import smtpSaga from './SmtpSaga'
import acrsSaga from './AcrsSaga'
import fidoSaga from './FidoSaga'
import loggingSaga from './LoggingSaga'
import pluginSaga from './PluginMenuSaga'
import pluginArr from '../../../plugins/redux/sagas'

export default function* rootSaga() {

  yield all([].concat([
      authSagas(),
      scopesSagas(),
      openidClientSaga(),
      attributeSaga(),
      customScriptSaga(),
      smtpSaga(),
      pluginSaga(),
      acrsSaga(),
      fidoSaga(),
      loggingSaga(),
    ], pluginArr))
}
