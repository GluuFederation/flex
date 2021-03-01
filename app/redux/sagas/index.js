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

export default function* rootSaga() {
  yield all([
    authSagas(),
    scopesSagas(),
    openidClientSaga(),
    attributeSaga(),
    customScriptSaga(),
    smtpSaga(),
  ])
}
