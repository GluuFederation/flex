/**
 * Json config Sagas
 */
import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import { isFourZeroOneError } from '../../utils/TokenController'
import {
  getJsonConfigResponse,
  patchJsonConfigResponse,
} from '../actions/JsonConfigActions'
import { getAPIAccessToken } from '../actions/AuthActions'
import { GET_JSON_CONFIG, PATCH_JSON_CONFIG } from '../actions/types'
import JsonConfigApi from '../api/JsonConfigApi'
import { getClient } from '../api/base'

const JansConfigApi = require('jans_config_api')

function* newFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.ConfigurationPropertiesApi(
    getClient(JansConfigApi, token, issuer),
  )
  return new JsonConfigApi(api)
}

export function* getJsonConfig() {
  try {
    const configApi = yield* newFunction()
    const data = yield call(configApi.fetchJsonConfig)
    yield put(getJsonConfigResponse(data))
  } catch (e) {
    yield put(getJsonConfigResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* patchJsonConfig({ payload }) {
  try {
    const configApi = yield* newFunction()
    const data = yield call(configApi.patchJsonConfig, payload.options)
    yield put(patchJsonConfigResponse(data))
  } catch (e) {
    yield put(patchJsonConfigResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* watchGetJsonConfig() {
  yield takeLatest(GET_JSON_CONFIG, getJsonConfig)
}
export function* watchPatchJsonConfig() {
  yield takeLatest(PATCH_JSON_CONFIG, patchJsonConfig)
}

export default function* rootSaga() {
  yield all([fork(watchGetJsonConfig), fork(watchPatchJsonConfig)])
}
