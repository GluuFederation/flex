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

export default function* rootSaga() {
  yield all([
    authSagas(),
    scopesSagas(),
    openidClientSaga(),
    attributeSaga(),
    customScriptSaga(),
    smtpSaga(),
    acrsSaga(),
    fidoSaga(),
    loggingSaga(),
  ])
}
