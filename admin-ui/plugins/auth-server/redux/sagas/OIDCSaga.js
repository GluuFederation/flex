import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import { isFourZeroOneError, addAdditionalData } from 'Utils/TokenController'
import { postUserAction } from 'Redux/api/backend-api'
import {
  getOpenidClientsResponse,
  addClientResponse,
  editClientResponse,
  deleteClientResponse,
  getOpenidClients,
} from '../features/oidcSlice'
import { getAPIAccessToken } from 'Redux/features/authSlice'
import { OIDC } from '../audit/Resources'
import { updateToast } from 'Redux/features/toastSlice'
import {
  CREATE,
  UPDATE,
  DELETION,
  FETCH,
} from '../../../../app/audit/UserActionType'
import OIDCApi from '../api/OIDCApi'
import { getClient } from 'Redux/api/base'
const JansConfigApi = require('jans_config_api')
import { initAudit } from 'Redux/sagas/SagaUtils'

function* newFunction() {
  const wholeToken = yield select((state) => state.authReducer.token)
  let token = null
  if (wholeToken) {
    token = yield select((state) => state.authReducer.token.access_token)
  } else {
    token = null
  }
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.OAuthOpenIDConnectClientsApi(
    getClient(JansConfigApi, token, issuer),
  )
  return new OIDCApi(api)
}

export function* getOauthOpenidClients({ payload }) {
  const audit = yield* initAudit()
  try {
    payload = payload ? payload : { action: {} }
    addAdditionalData(audit, FETCH, OIDC, payload)
    const openIdApi = yield* newFunction()
    const data = yield call(openIdApi.getAllOpenidClients, payload.action)
    yield put(getOpenidClientsResponse({ data }))
    yield call(postUserAction, audit)
    return data
  } catch (e) {
    console.log(e)
    yield put(getOpenidClientsResponse({ data: null }))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* addNewClient({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, CREATE, OIDC, payload)
    const api = yield* newFunction()
    const data = yield call(api.addNewOpenIdClient, payload.action.action_data)
    yield put(addClientResponse({ data }))
    yield put(updateToast(true, 'success'))
    yield call(postUserAction, audit)
    return data
  } catch (e) {
    yield put(updateToast(true, 'error'))
    yield put(addClientResponse(null))
    if (isFourZeroOneError(e)) {
      console.log(JSON.stringify(e))
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* editAClient({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, UPDATE, OIDC, payload)
    const postBody = {}
    postBody['client'] = payload.action.action_data
    const api = yield* newFunction()
    const data = yield call(api.editAClient, postBody)
    yield put(editClientResponse({ data }))
    yield put(updateToast(true, 'success'))
    yield call(postUserAction, audit)
    return data
  } catch (e) {
    yield put(updateToast(true, 'error'))
    console.log(e)
    yield put(editClientResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* deleteAClient({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, DELETION, OIDC, payload)
    const api = yield* newFunction()
    yield call(api.deleteAClient, payload.action.action_data)
    yield put(updateToast(true, 'success'))
    yield put(getOpenidClients())
    yield call(postUserAction, audit)
  } catch (e) {
    yield put(updateToast(true, 'error'))
    yield put(deleteClientResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* getOpenidClientsWatcher() {
  yield takeLatest('oidc/getOpenidClients', getOauthOpenidClients)
}

export function* searchClientsWatcher() {
  yield takeLatest('oidc/searchClients', getOauthOpenidClients)
}

export function* addClientWatcher() {
  yield takeLatest('oidc/addNewClientAction', addNewClient)
}

export function* editClientWatcher() {
  yield takeLatest('oidc/editClient', editAClient)
}
export function* deleteClientWatcher() {
  yield takeLatest('oidc/deleteClient', deleteAClient)
}

export default function* rootSaga() {
  yield all([
    fork(getOpenidClientsWatcher),
    fork(searchClientsWatcher),
    fork(addClientWatcher),
    fork(editClientWatcher),
    fork(deleteClientWatcher),
  ])
}
