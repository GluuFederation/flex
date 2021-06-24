import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import { isFourZeroOneError } from '../../../../app/utils/TokenController'
import {
  getSqlResponse,
  addSqlResponse,
  editSqlResponse,
  deleteSqlResponse,
  testSqlResponse,
} from '../actions/SqlActions'
import { getAPIAccessToken } from '../../../../app/redux/actions/AuthActions'
import { GET_SQL, PUT_SQL, SET_SQL, DELETE_SQL, TEST_SQL } from '../actions/types'
import SqlApi from '../api/SqlApi'
import { getClient } from '../../../../app/redux/api/base'
const JansConfigApi = require('jans_config_api')

function* newFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.DatabaseSqlConfigurationApi(
    getClient(JansConfigApi, token, issuer),
  )
  return new SqlApi(api)
}

export function* getSql() {
  try {
    const api = yield* newFunction()
    const data = yield call(api.getSqlConfig)
    console.log('sql saga data: ', data)
    yield put(getSqlResponse(data))
  } catch (e) {
    yield put(getSqlResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* addSql({ payload }) {
  try {
    const api = yield* newFunction()
    const data = yield call(api.addSqlConfig, payload.data)
    yield put(addSqlResponse(data))
  } catch (e) {
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* editSql({ payload }) {
  try {
    const api = yield* newFunction()
    const data = yield call(api.updateSqlConfig, payload.data)
    yield put(editSqlResponse(data))
  } catch (e) {
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

//delete
export function* deleteSql({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, DELETION, LDAP, payload)
    const api = yield* newFunction()
    yield call(api.deleteSqlConfig, payload.configId)
    yield put(deleteSqlResponse(payload.configId))
    yield call(postUserAction, audit)
  } catch (e) {
    yield put(deleteSqlResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* testSql({ payload }) {
  const audit = yield* initAudit()
  try {
    const api = yield* newFunction()
    const data = yield call(api.testSqlConfig, payload.data)
    yield put(testSqlResponse(data))
    yield call(postUserAction, audit)
  } catch (e) {
    console.log(e)
    yield put(testSqlResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}


export function* watchGetSqlConfig() {
  yield takeLatest(GET_SQL, getSql)
}

export function* watchAddSqlConfig() {
  yield takeLatest(SET_SQL, addSql)
}

export function* watchPutSqlConfig() {
  yield takeLatest(PUT_SQL, editSql)
}

export function* watchDeleteSqlConfig() {
  yield takeLatest(DELETE_SQL, deleteSql)
}

export function* watchTestSqlConfig() {
  yield takeLatest(TEST_SQL, testSql)
}

export default function* rootSaga() {
  yield all([fork(watchGetSqlConfig), fork(watchAddSqlConfig), fork(watchPutSqlConfig), fork(watchDeleteSqlConfig), fork(watchTestSqlConfig)])
}
