import { call, put, takeLatest, select } from 'redux-saga/effects'
import {
  getLdapListSuccess,
  getLdapListFailure,
  deleteLdapSuccess,
  deleteLdapFailure,
} from '../features/authNLdapSlice'
import {
  addLdapSuccess,
  addLdapFailure,
  editLdapFailure,
  editLdapSuccess,
} from '../features/authNLdapSlice'
import { updateToast } from 'Redux/features/toastSlice'
import * as JansConfigApi from 'jans_config_api'
import { getClient } from 'Redux/api/base'
import { initAudit } from '@/redux/sagas/SagaUtils'
import { addAdditionalData } from '@/utils/TokenController'
import { DELETION, CREATE, UPDATE } from '@/audit/UserActionType'
import { postUserAction } from '@/redux/api/backend-api'
import { LDAP } from '@/utils/ApiResources'

function deleteLdapApi(token, issuer, configId) {
  const api = new JansConfigApi.DatabaseLDAPConfigurationApi(
    getClient(JansConfigApi, token, issuer),
  )
  return new Promise((resolve, reject) => {
    api.deleteConfigDatabaseLdapByName(configId, (error, data) => {
      if (error) reject(error)
      else resolve(data)
    })
  })
}

function* deleteLdapSaga({ payload }) {
  const audit = yield* initAudit()
  console.log('action in delete ldap saga', payload)
  try {
    const token = yield select((state) => state.authReducer.token.access_token)
    const issuer = yield select((state) => state.authReducer.issuer)
    addAdditionalData(audit, DELETION, LDAP, { message: payload?.userMessage })
    yield call(deleteLdapApi, token, issuer, payload?.configId)
    yield put(updateToast(true, 'success', 'LDAP deleted successfully'))
    yield put(deleteLdapSuccess())
    yield call(postUserAction, audit)
    yield put({ type: 'authNLdap/getLdapList' })
  } catch (e) {
    yield put(updateToast(true, 'error', 'Error deleting LDAP'))
    yield put(deleteLdapFailure())
  }
}
function addLdapApi(token, issuer, payload) {
  const api = new JansConfigApi.DatabaseLDAPConfigurationApi(
    getClient(JansConfigApi, token, issuer),
  )
  return new Promise((resolve, reject) => {
    api.postConfigDatabaseLdap(payload, (error, data) => {
      if (error) reject(error)
      else resolve(data)
    })
  })
}

function* addLdapSaga(action) {
  const audit = yield* initAudit()
  try {
    const token = yield select((state) => state.authReducer.token.access_token)
    const issuer = yield select((state) => state.authReducer.issuer)
    addAdditionalData(audit, CREATE, LDAP, { message: action?.payload?.action_message })
    yield call(addLdapApi, token, issuer, action.payload)
    yield put(updateToast(true, 'success', 'LDAP added successfully'))
    yield put(addLdapSuccess())
    yield call(postUserAction, audit)
    action?.onSuccessApply?.()
  } catch (e) {
    yield put(updateToast(true, 'error', 'Error adding LDAP'))
    yield put(addLdapFailure())
  }
}

function editLdapApi(token, issuer, payload) {
  const api = new JansConfigApi.DatabaseLDAPConfigurationApi(
    getClient(JansConfigApi, token, issuer),
  )
  return new Promise((resolve, reject) => {
    api.putConfigDatabaseLdap(payload, (error, data) => {
      if (error) reject(error)
      else resolve(data)
    })
  })
}

function* editLdapSaga(action) {
  const audit = yield* initAudit()
  try {
    const token = yield select((state) => state.authReducer.token.access_token)
    const issuer = yield select((state) => state.authReducer.issuer)
    addAdditionalData(audit, UPDATE, LDAP, { message: action?.payload?.action_message })
    yield call(editLdapApi, token, issuer, action?.payload)
    yield put(updateToast(true, 'success', 'LDAP updated successfully'))
    yield put(editLdapSuccess())
    action?.onSuccessApply?.()
    yield call(postUserAction, audit)
  } catch (e) {
    yield put(updateToast(true, 'error', 'Error updating LDAP'))
    yield put(editLdapFailure())
  }
}

function fetchLdapListApi(token, issuer) {
  const api = new JansConfigApi.DatabaseLDAPConfigurationApi(
    getClient(JansConfigApi, token, issuer),
  )
  return new Promise((resolve, reject) => {
    api.getConfigDatabaseLdap((error, data) => {
      if (error) reject(error)
      else resolve(data)
    })
  })
}

function* getLdapListSaga() {
  try {
    const token = yield select((state) => state.authReducer.token.access_token)
    const issuer = yield select((state) => state.authReducer.issuer)
    const data = yield call(fetchLdapListApi, token, issuer)
    yield put(getLdapListSuccess(data))
  } catch (e) {
    yield put(getLdapListFailure())
  }
}

export default function* authNLdapSaga() {
  yield takeLatest('authNLdap/getLdapList', getLdapListSaga)
  yield takeLatest('authNLdap/addLdap', addLdapSaga)
  yield takeLatest('authNLdap/deleteLdap', deleteLdapSaga)
  yield takeLatest('authNLdap/editLdap', editLdapSaga)
}
