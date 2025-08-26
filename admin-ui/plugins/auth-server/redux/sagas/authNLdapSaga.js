import { call, put, takeLatest } from 'redux-saga/effects'
import { getLdapListSuccess, getLdapListFailure } from '../features/authNLdapSlice'
import { DatabaseLDAPConfigurationApi } from 'jans_config_api'
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
    yield put({ type: 'authNLdap/getLdapList' })
  } catch (e) {
    // Optionally, handle error
    yield put(getLdapListFailure())
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
}
