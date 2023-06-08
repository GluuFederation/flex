import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import { isFourZeroOneError } from 'Utils/TokenController'
import {
  getCouchBaseResponse,
  addCouchBaseResponse,
  editCouchBaseResponse,
} from '../features/couchbaseSlice'
import { getAPIAccessToken } from 'Redux/features/authSlice'
import CouchbaseApi from '../api/CouchbaseApi'
import { getClient } from 'Redux/api/base'
const JansConfigApi = require('jans_config_api')

function* newFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.DatabaseCouchbaseConfigurationApi(
    getClient(JansConfigApi, token, issuer),
  )
  return new CouchbaseApi(api)
}

export function* getCouchbase() {
  try {
    const api = yield* newFunction()
    const data = yield call(api.getCouchBaseConfig)
    yield put(getCouchBaseResponse({ data }))
  } catch (e) {
    yield put(getCouchBaseResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* addCouchbase({ payload }) {
  try {
    const api = yield* newFunction()
    const data = yield call(api.addCouchBaseConfig, payload.data)
    yield put(addCouchBaseResponse({ data }))
  } catch (e) {
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* editCouchbase({ payload }) {
  try {
    const api = yield* newFunction()
    const data = yield call(api.updateCouchBaseConfig, payload.data)
    yield put(editCouchBaseResponse({ data }))
  } catch (e) {
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* watchGetCouchbaseConfig() {
  yield takeLatest('couchbase/getCouchBaseConfig', getCouchbase)
}

export function* watchAddCouchbaseConfig() {
  yield takeLatest('couchbase/addCouchBase', addCouchbase)
}

export function* watchPutCouchbaseConfig() {
  yield takeLatest('couchbase/editCouchBase', editCouchbase)
}
export default function* rootSaga() {
  yield all([fork(watchGetCouchbaseConfig), fork(watchPutCouchbaseConfig)])
}
