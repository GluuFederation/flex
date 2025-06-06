import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import { isFourZeroOneError } from 'Utils/TokenController'
import {
  getPersistenceTypeResponse,
  getDatabaseInfoResponse,
} from '../features/persistenceTypeSlice'
import { getAPIAccessToken } from 'Redux/features/authSlice'
import PersistenceConfigApi from '../api/PersistenceConfigApi'
import { getClient } from 'Redux/api/base'
const JansConfigApi = require('jans_config_api')

function* newFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.ConfigurationPropertiesApi(getClient(JansConfigApi, token, issuer))
  return new PersistenceConfigApi(api)
}

export function* getPersistenceType() {
  try {
    const api = yield* newFunction()
    const data = yield call(api.getPersistenceType)
    yield put(getPersistenceTypeResponse({ data: data.persistenceType }))
  } catch (e) {
    yield put(getPersistenceTypeResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* getDatabaseInfo() {
  try {
    const api = yield* newFunction()
    const data = yield call(api.getPersistenceType)
    yield put(getDatabaseInfoResponse({ data }))
  } catch (e) {
    yield put(getDatabaseInfoResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* watchGetDatabaseInfo() {
  yield takeLatest('persistenceType/getDatabaseInfo', getDatabaseInfo)
}

export function* watchGetPersistenceType() {
  yield takeLatest('persistenceType/getPersistenceType', getPersistenceType)
}

export default function* rootSaga() {
  yield all([fork(watchGetPersistenceType), fork(watchGetDatabaseInfo)])
}
