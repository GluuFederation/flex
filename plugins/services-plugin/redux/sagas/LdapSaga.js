import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import { 
  isFourZeroOneError,
  addAdditionalData,
 } from '../../../../app/utils/TokenController'
import { postUserAction } from '../../../../app/redux/api/backend-api'
import {
  getLdapResponse,
  editLdapResponse,
  addLdapResponse,
  deleteLdapResponse,
  testLdapResponse,
} from '../actions/LdapActions'
import { getAPIAccessToken } from '../../../../app/redux/actions/AuthActions'
import { LDAP } from '../audit/Resources'
import {
  CREATE,
  UPDATE,
  DELETION,
  FETCH,
} from '../../../../app/audit/UserActionType'
import {
  GET_LDAP,
  PUT_LDAP,
  ADD_LDAP,
  DELETE_LDAP,
  TEST_LDAP,
} from '../actions/types'
import LdapApi from '../api/LdapApi'
import { getClient } from '../../../../app/redux/api/base'
const JansConfigApi = require('jans_config_api')
import { initAudit } from '../../plugin-selector'

function* newFunction() {  
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.DatabaseLDAPConfigurationApi(
    getClient(JansConfigApi, token, issuer),
  )
  return new LdapApi(api)
}

export function* getLdap(payload) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, FETCH, LDAP, payload)
    const api = yield* newFunction()
    const data = yield call(api.getLdapConfig)
    yield put(getLdapResponse(data))
    yield call(postUserAction, audit)
  } catch (e) {
    yield put(getLdapResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* addLdap({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, CREATE, LDAP, payload)
    const api = yield* newFunction()
    const data = yield call(
      api.addLdapConfig,
      payload.action.action_data,
    )
    yield call(api.addLdapConfig, payload.action.action_data)
    yield put(addLdapResponse(data))
    yield call(postUserAction, audit)
  } catch (e) {
    yield put(addLdapResponse(null))
    if (isFourZeroOneError(e)) {
      console.log(e)
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* editLdap({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, UPDATE, LDAP, payload)
    const api = yield* newFunction()
    const data = yield call(
      api.updateLdapConfig,
      payload.data.action_data,
    )
    yield put(editLdapResponse(data))
    yield call(postUserAction, audit)
  } catch (e) {
    console.log(e)
    yield put(editLdapResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

//delete
export function* deleteLdap({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, DELETION, LDAP, payload)
    const api = yield* newFunction()
    yield call(api.deleteLdapConfig, payload.configId)
    yield put(deleteLdapResponse(payload.configId))
    yield call(postUserAction, audit)
  } catch (e) {
    yield put(deleteLdapResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* testLdap({ payload }) {
  const audit = yield* initAudit()
  try {
    // addAdditionalData(audit, UPDATE, LDAP, payload)
    const api = yield* newFunction()
    const data = yield call(api.testLdapConfig, payload.data)
    yield put(testLdapResponse(data))
    yield call(postUserAction, audit)
  } catch (e) {
    console.log(e)
    yield put(testLdapResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* watchGetLdapConfig() {
  yield takeLatest(GET_LDAP, getLdap)
}

export function* watchPutLdapConfig() {
  yield takeLatest(PUT_LDAP, editLdap)
}

export function* watchAddLdapConfig() {
  yield takeLatest(ADD_LDAP, addLdap)
}

export function* watchDeleteLdap() {
  yield takeLatest(DELETE_LDAP, deleteLdap)
}

export function* watchTestLdapConfig() {
  yield takeLatest(TEST_LDAP, testLdap)
}

export default function* rootSaga() {
  yield all([
    fork(watchGetLdapConfig),
    fork(watchPutLdapConfig),
    fork(watchAddLdapConfig),
    fork(watchDeleteLdap),
    fork(watchTestLdapConfig),
  ])
}
