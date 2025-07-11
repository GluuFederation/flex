import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import { isFourZeroOneError, addAdditionalData } from 'Utils/TokenController'
import {
  getSqlResponse,
  addSqlResponse,
  editSqlResponse,
  deleteSqlResponse,
  testSqlResponse,
} from '../features/sqlSlice'
import { getAPIAccessToken } from 'Redux/features/authSlice'
import { SQL } from '../audit/Resources'
import { CREATE, UPDATE, DELETION, FETCH } from '../../../../app/audit/UserActionType'
import { initAudit } from 'Redux/sagas/SagaUtils'
import SqlApi from '../api/SqlApi'
import { postUserAction } from 'Redux/api/backend-api'
import { getClient } from 'Redux/api/base'
const JansConfigApi = require('jans_config_api')

function* newFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.DatabaseSqlConfigurationApi(getClient(JansConfigApi, token, issuer))
  return new SqlApi(api)
}

export function* getSql(payload) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, FETCH, SQL, payload)
    const api = yield* newFunction()
    const data = yield call(api.getSqlConfig)
    yield put(getSqlResponse({ data }))
    yield call(postUserAction, audit)
  } catch (e) {
    yield put(getSqlResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* addSql({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, CREATE, SQL, payload)
    const api = yield* newFunction()
    const data = yield call(api.addSqlConfig, payload.data.action_data)
    yield put(addSqlResponse({ data }))
    yield call(postUserAction, audit)
  } catch (e) {
    yield put(addSqlResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* editSql({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, UPDATE, SQL, payload)
    const api = yield* newFunction()
    const data = yield call(api.updateSqlConfig, payload.data.action_data)
    yield put(editSqlResponse({ data }))
    yield call(postUserAction, audit)
  } catch (e) {
    yield put(editSqlResponse(null))
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
    addAdditionalData(audit, DELETION, SQL, payload)
    const api = yield* newFunction()
    yield call(api.deleteSqlConfig, payload.configId)
    yield put(deleteSqlResponse({ configId: payload.configId }))
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
    addAdditionalData(audit, DELETION, SQL, payload)
    const api = yield* newFunction()
    const data = yield call(api.testSqlConfig, payload.data)
    yield put(testSqlResponse({ data }))
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
  yield takeLatest('sql/getSqlConfig', getSql)
}

export function* watchAddSqlConfig() {
  yield takeLatest('sql/addSql', addSql)
}

export function* watchPutSqlConfig() {
  yield takeLatest('sql/editSql', editSql)
}

export function* watchDeleteSqlConfig() {
  yield takeLatest('sql/deleteSql', deleteSql)
}

export function* watchTestSqlConfig() {
  yield takeLatest('sql/testSql', testSql)
}

export default function* rootSaga() {
  yield all([
    fork(watchGetSqlConfig),
    fork(watchAddSqlConfig),
    fork(watchPutSqlConfig),
    fork(watchDeleteSqlConfig),
    fork(watchTestSqlConfig),
  ])
}
