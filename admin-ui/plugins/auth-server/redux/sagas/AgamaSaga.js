import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import { isFourZeroOneError } from 'Utils/TokenController'
import { getAPIAccessToken } from 'Redux/actions/AuthActions'
import { GET_AGAMA, DELETE_AGAMA } from '../actions/types'
import AgamaApi from '../api/AgamaApi'
import { getClient } from 'Redux/api/base'
import { getAgamaResponse } from '../actions/AgamaActions'
import { getAgama } from '../actions/AgamaActions'
const JansConfigApi = require('jans_config_api')

function* newFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.AgamaDeveloperStudioApi(
    getClient(JansConfigApi, token, issuer),
  )
  return new AgamaApi(api)
}

export function* getAgamas() {
  try {
    const api = yield* newFunction()
    const data = yield call(api.getAgama, {})
    yield put(getAgamaResponse(data))
  } catch (e) {
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}
export function* deleteAgamas(payload) {
  try {
    const api = yield* newFunction()
    const data = yield call(api.deleteAgama, payload)
    yield put(getAgama())
  } catch (e) {
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}




export function* watchGetAgama() {
  yield takeLatest(GET_AGAMA, getAgamas)
}
export function* watchDeleteAgama() {
  yield takeLatest(DELETE_AGAMA, deleteAgamas)
}


export default function* rootSaga() {
  yield all([fork(watchGetAgama), fork(watchDeleteAgama)])
}
