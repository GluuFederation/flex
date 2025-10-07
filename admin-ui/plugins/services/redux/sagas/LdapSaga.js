import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import { isFourZeroOneError, addAdditionalData } from 'Utils/TokenController'
import { postUserAction } from 'Redux/api/backend-api'
import {
  getLdapResponse,
  editLdapResponse,
  addLdapResponse,
  deleteLdapResponse,
  testLdapResponse,
  toggleSavedFormFlag,
} from '../features/ldapSlice'
import { updateToast } from 'Redux/features/toastSlice'
import { getAPIAccessToken } from 'Redux/features/authSlice'
import { API_LDAP } from 'Plugins/user-management/redux/audit/Resources'
import { CREATE, UPDATE, DELETION, FETCH } from '../../../../app/audit/UserActionType'
import LdapApi from '../api/LdapApi'
import { getClient } from 'Redux/api/base'
const JansConfigApi = require('jans_config_api')
import { initAudit } from 'Redux/sagas/SagaUtils'

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
    addAdditionalData(audit, FETCH, API_LDAP, payload)
    const api = yield* newFunction()
    const data = yield call(api.getLdapConfig)
    yield put(getLdapResponse({ data }))
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
    addAdditionalData(audit, CREATE, API_LDAP, payload)
    const api = yield* newFunction()
    const data = yield call(api.addLdapConfig, payload.data.action_data)
    yield put(updateToast(true, 'success'))
    yield put(addLdapResponse({ data }))
    yield put(toggleSavedFormFlag(true))
    yield call(postUserAction, audit)
    return data
  } catch (e) {
    yield put(toggleSavedFormFlag(false))
    yield put(updateToast(true, 'error'))
    yield put(addLdapResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* editLdap({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, UPDATE, API_LDAP, payload)
    const api = yield* newFunction()
    const data = yield call(api.updateLdapConfig, payload.data.action_data)
    yield put(updateToast(true, 'success'))
    yield put(editLdapResponse({ data }))
    yield call(postUserAction, audit)
    yield put(toggleSavedFormFlag(true))
    return data
  } catch (e) {
    yield put(toggleSavedFormFlag(false))
    yield put(updateToast(true, 'error'))
    console.log(e)
    yield put(editLdapResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

//delete
export function* deleteLdap({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, DELETION, API_LDAP, payload)
    const api = yield* newFunction()
    const data = yield call(api.deleteLdapConfig, payload.configId)
    yield put(updateToast(true, 'success'))
    yield put(deleteLdapResponse({ configId: payload.configId }))
    yield call(postUserAction, audit)
    return data
  } catch (e) {
    yield put(updateToast(true, 'error'))
    yield put(deleteLdapResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* testLdap({ payload }) {
  const audit = yield* initAudit()
  try {
    const api = yield* newFunction()
    const data = yield call(api.testLdapConfig, payload.data)
    yield put(testLdapResponse({ data }))
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
  yield takeLatest('ldap/getLdapConfig', getLdap)
}

export function* watchPutLdapConfig() {
  yield takeLatest('ldap/editLdap', editLdap)
}

export function* watchAddLdapConfig() {
  yield takeLatest('ldap/addLdap', addLdap)
}

export function* watchDeleteLdap() {
  yield takeLatest('ldap/deleteLdap', deleteLdap)
}

export function* watchTestLdapConfig() {
  yield takeLatest('ldap/testLdap', testLdap)
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
