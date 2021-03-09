import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import { isFourZeroOneError, hasApiToken } from '../../utils/TokenController'
import { getAcrsResponse, editAcrsResponse } from '../actions/AcrsActions'
import { getAPIAccessToken } from '../actions/AuthActions'
import { GET_ACRS, PUT_ACRS } from '../actions/types'
import AcrApi from '../api/AcrApi'
import { getClient } from '../api/base'
const JansConfigApi = require('jans_config_api')

export function* getAcrs() {
  try {
    const api = yield* newFunction()
    const data = yield call(api.getAcrsConfig)
    yield put(getAcrsResponse(data))
  } catch (e) {
    yield put(getAcrsResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* editAcrs({ payload }) {
  try {
    const api = yield* newFunction()
    const data = yield call(api.updateAcrsConfig, payload.data)
    yield put(editAcrsResponse(data))
  } catch (e) {
    if (isFourZeroOneError(e) && !hasApiToken()) {
      yield put(getAPIAccessToken())
    }
  }
}
function* newFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.DefaultAuthenticationMethodApi(
    getClient(JansConfigApi, token, issuer),
  )
  return new AcrApi(api)
}

export function* watchGetAcrsConfig() {
  yield takeLatest(GET_ACRS, getAcrs)
}

export function* watchPutAcrsConfig() {
  yield takeLatest(PUT_ACRS, editAcrs)
}
export default function* rootSaga() {
  yield all([fork(watchGetAcrsConfig), fork(watchPutAcrsConfig)])
}
