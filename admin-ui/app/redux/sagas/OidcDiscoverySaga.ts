// @ts-nocheck
import { all, call, fork, put, takeLatest, select } from 'redux-saga/effects'
import { getOidcDiscoveryResponse } from '../actions'
import { isFourZeroOneError } from 'Utils/TokenController'
import OidcDiscoveryApi from '../api/OidcDiscoveryApi'
import { getClient } from '../api/base'
const JansConfigApi = require('jans_config_api')

function* newFunction() {
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.ConfigurationPropertiesApi(getClient(JansConfigApi, null, issuer))

  return new OidcDiscoveryApi(api)
}

export function* getOidcDiscovery() {
  try {
    const api = yield* newFunction()
    const data = yield call(api.getOidcDiscovery)
    yield put(getOidcDiscoveryResponse({ configuration: data }))
  } catch (e) {
    yield put(getOidcDiscoveryResponse({ configuration: null }))
    if (isFourZeroOneError(e)) {
      // Session expired - redirect to login
      window.location.href = '/logout'
    }
  }
}

//watcher sagas
export function* watchGetFidoConfig() {
  yield takeLatest('oidcDiscovery/getOidcDiscovery', getOidcDiscovery)
}

export default function* rootSaga() {
  yield all([fork(watchGetFidoConfig)])
}
