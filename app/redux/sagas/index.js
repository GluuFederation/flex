/**
 * Root Sagas
 */
import { all } from 'redux-saga/effects'

// sagas
import authSagas from './AuthSaga'
import scopesSagas from './OAuthScopeSaga'
import attributeSaga from './AttributeSaga'
import oidcSaga from './OIDCSaga'
import customScriptSaga from './CustomScriptSaga'
import fidoSaga from './FidoSaga'
import loggingSaga from './LoggingSaga'
import initSaga from './InitSaga'
import jsonConfigSaga from './JsonConfigSaga'
import process from '../../../plugins/PluginSagasResolver';

export default function* rootSaga() {

  let pluginSagaArr = process();
  yield all(
    [].concat(
      [
        authSagas(),
        scopesSagas(),
        attributeSaga(),
        customScriptSaga(),
        oidcSaga(),
        fidoSaga(),
        loggingSaga(),
        initSaga(),
        jsonConfigSaga(),
      ],
      pluginSagaArr,
    ),
  )
}
