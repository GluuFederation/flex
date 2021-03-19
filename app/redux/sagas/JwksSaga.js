import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import { isFourZeroOneError } from '../../utils/TokenController'
import { getJwksResponse } from '../actions/JwksActions'
import { getAPIAccessToken } from '../actions/AuthActions'
import { GET_JWKS } from '../actions/types'
import JwksApi from '../api/JwksApi'
import { getClient } from '../api/base'
const JansConfigApi = require('jans_config_api')

function* newFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.ConfigurationJWKJSONWebKeyJWKApi(
    getClient(JansConfigApi, token, issuer),
  )
  return new JwksApi(api)
}

export function* getJwksConfig() {
  try {
    const api = yield* newFunction()
    const data = yield call(api.getJwks)
    yield put(getJwksResponse(data))
  } catch (e) {
    yield put(getJwksResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* watchGetJwksConfig() {
  yield takeLatest(GET_JWKS, getJwksConfig)
}

export default function* rootSaga() {
  yield all([fork(watchGetJwksConfig)])
}
