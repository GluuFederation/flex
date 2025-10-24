import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import { isFourZeroOneError } from 'Utils/TokenController'
import { getAPIAccessToken } from 'Redux/features/authSlice'
import AgamaApi from '../api/AgamaApi'
import { getClient } from 'Redux/api/base'
import {
  getAgamaResponse,
  getAddAgamaResponse,
  getAgama,
  getAgamaRepositoriesResponse,
  getAgamaRepositoryFileResponse,
} from '../features/agamaSlice'
const JansConfigApi = require('jans_config_api')

function* newFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.AgamaApi(getClient(JansConfigApi, token, issuer))
  return new AgamaApi(api)
}

export function* getAgamas() {
  try {
    const api = yield* newFunction()
    const data = yield call(api.getAgama, {})
    yield put(getAgamaResponse(data))
    return data
  } catch (e) {
    yield put(getAgamaResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* addAgama(payload) {
  const token = yield select((state) => state.authReducer.token.access_token)
  try {
    payload.payload['token'] = token
    const api = yield* newFunction()
    const data = yield call(api.addAgama, payload)
    yield put(getAddAgamaResponse(data))
    yield put(getAgama())
    return data
  } catch (e) {
    yield put(getAddAgamaResponse(null))
    return e
  }
}

export function* deleteAgamas(payload) {
  try {
    const api = yield* newFunction()
    const data = yield call(api.deleteAgama, payload)
    yield put(getAgama())
    return data
  } catch (e) {
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* getAgamaRepository() {
  try {
    const api = yield* newFunction()
    const data = yield call(api.getAgamaRepositories)
    yield put(getAgamaRepositoriesResponse(data))
    return data
  } catch (e) {
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* getAgamaRepositoryFile(body) {
  try {
    const { payload } = body
    const token = yield select((state) => state.authReducer.token.access_token)

    payload.token = token
    const api = yield* newFunction()
    const data = yield call(api.getAgamaRepositoryFile, payload)

    yield put(getAgamaRepositoryFileResponse(data.data))
    return data
  } catch (e) {
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* watchGetAgama() {
  yield takeLatest('agama/getAgama', getAgamas)
}
export function* watchDeleteAgama() {
  yield takeLatest('agama/deleteAgama', deleteAgamas)
}
export function* watchAddAgama() {
  yield takeLatest('agama/addAgama', addAgama)
}
export function* watchGetAgamaRepository() {
  yield takeLatest('agama/getAgamaRepository', getAgamaRepository)
}

export function* watchAgamaRepositoryFile() {
  yield takeLatest('agama/getAgamaRepositoryFile', getAgamaRepositoryFile)
}

export default function* rootSaga() {
  yield all([
    fork(watchGetAgama),
    fork(watchDeleteAgama),
    fork(watchAddAgama),
    fork(watchGetAgamaRepository),
    fork(watchAgamaRepositoryFile),
  ])
}
