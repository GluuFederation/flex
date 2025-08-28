import { call, put, takeLatest } from 'redux-saga/effects'
import {
  getLdapListSuccess,
  getLdapListFailure,
  deleteLdapSuccess,
  deleteLdapFailure,
} from '../features/authNLdapSlice'
import { addLdapSuccess, addLdapFailure, editLdapSuccess } from '../features/authNLdapSlice'
import { updateToast } from 'Redux/features/toastSlice'
import { DatabaseLDAPConfigurationApi } from 'jans_config_api'
function deleteLdapApi(configId) {
  const api = new DatabaseLDAPConfigurationApi()
  return new Promise((resolve, reject) => {
    api.deleteConfigDatabaseLdapByName(configId, (error, data) => {
      if (error) reject(error)
      else resolve(data)
    })
  })
}

function* deleteLdapSaga(action) {
  try {
    yield call(deleteLdapApi, action.payload.configId)
    yield put(updateToast(true, 'success', 'LDAP deleted successfully'))
    yield put(deleteLdapSuccess())
    yield put({ type: 'authNLdap/getLdapList' })
  } catch (e) {
    yield put(updateToast(true, 'error', 'Error deleting LDAP'))
    yield put(deleteLdapFailure())
  }
}
function addLdapApi(payload) {
  const api = new DatabaseLDAPConfigurationApi()
  return new Promise((resolve, reject) => {
    api.postConfigDatabaseLdap(payload, (error, data) => {
      if (error) reject(error)
      else resolve(data)
    })
  })
}

function* addLdapSaga(action) {
  try {
    console.log('LDAP ADD PAYLOAD TO API:', action.payload)
    yield call(addLdapApi, action.payload)
    yield put(updateToast(true, 'success', 'LDAP added successfully'))
    yield put(editLdapSuccess())
    action?.onSuccessApply?.()
  } catch (e) {
    yield put(updateToast(true, 'error', 'Error adding LDAP'))
    yield put(addLdapFailure())
  }
}

function editLdapApi(payload) {
  const api = new DatabaseLDAPConfigurationApi()
  return new Promise((resolve, reject) => {
    api.putConfigDatabaseLdap(payload, (error, data) => {
      if (error) reject(error)
      else resolve(data)
    })
  })
}

function* editLdapSaga(action) {
  try {
    yield call(editLdapApi, action.payload)
    yield put(updateToast(true, 'success', 'LDAP updated successfully'))
    yield put(addLdapSuccess())
    action?.onSuccessApply?.()
  } catch (e) {
    yield put(updateToast(true, 'error', 'Error updating LDAP'))
    yield put(addLdapFailure())
  }
}

function fetchLdapListApi() {
  const api = new DatabaseLDAPConfigurationApi()
  return new Promise((resolve, reject) => {
    api.getConfigDatabaseLdap((error, data) => {
      if (error) reject(error)
      else resolve(data)
    })
  })
}

function* getLdapListSaga() {
  try {
    const data = yield call(fetchLdapListApi)
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
