/**
 * License Sagas
 */
import { all, call, fork, put, takeLatest, select } from 'redux-saga/effects'
import {
  GET_OIDC_DISCOVERY,
  GET_OIDC_DISCOVERY_RESPONSE,
} from '../actions/types'
import {
  getOidcDiscoveryResponse,
} from '../actions'
import { isFourZeroOneError } from '../../utils/TokenController'
import OidcDiscoveryApi from '../api/OidcDiscoveryApi'
import { getClient } from '../api/base'
import { getAPIAccessToken } from '../actions/AuthActions'
const JansConfigApi = require('jans_config_api')

function* newFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  
  const api = new JansConfigApi.ConfigurationPropertiesApi(
    getClient(JansConfigApi, token, issuer),
  )
  
  return new OidcDiscoveryApi(api)
}


export function* getOidcDiscovery() {
  try {
    const api = yield* newFunction()
    const data = yield call(api.getOidcDiscovery)
    yield put(getOidcDiscoveryResponse(data))
  } catch (e) {
    yield put(getOidcDiscoveryResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}


//watcher sagas
export function* watchGetFidoConfig() {
  yield takeLatest(GET_OIDC_DISCOVERY, getOidcDiscovery)
}

/**
 * License Root Saga
 */
export default function* rootSaga() {
  yield all([
    fork(watchGetFidoConfig),
  ])
}
