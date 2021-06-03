import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import {
  isFourZeroOneError,
  addAdditionalData,
} from '../../../../app/utils/TokenController'
import { postUserAction } from '../../../../app/redux/api/backend-api'
import {
  getOpenidClientsResponse,
  addClientResponse,
  editClientResponse,
  deleteClientResponse,
} from '../actions/OIDCActions'
import { getAPIAccessToken } from '../actions/AuthActions'
import { OIDC } from '../audit/Resources'
import {
  CREATE,
  UPDATE,
  DELETION,
  FETCH,
} from '../../../../app/audit/UserActionType'
import {
  GET_OPENID_CLIENTS,
  ADD_NEW_CLIENT,
  EDIT_CLIENT,
  DELETE_CLIENT,
  SEARCH_CLIENTS,
} from '../actions/types'
import OIDCApi from '../api/OIDCApi'
import { getClient } from '../../../../app/redux/api/base'
const JansConfigApi = require('jans_config_api')

function* newFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.OAuthOpenIDConnectClientsApi(
    getClient(JansConfigApi, token, issuer),
  )
  return new OIDCApi(api)
}
function* initAudit() {
  const auditlog = {}
  const client_id = yield select((state) => state.authReducer.config.clientId)
  const ip_address = yield select((state) => state.authReducer.location.IPv4)
  const userinfo = yield select((state) => state.authReducer.userinfo)
  const author = userinfo ? userinfo.family_name || userinfo.name : '-'
  auditlog['client_id'] = client_id
  auditlog['ip_address'] = ip_address
  auditlog['author'] = author
  auditlog['status'] = 'succeed'
  return auditlog
}

export function* getOauthOpenidClients({ payload }) {
  console.log('================Listing openid connect client saga')
  const audit = yield* initAudit()
  try {
    console.log('================one')
    addAdditionalData(audit, FETCH, OIDC, payload)
    console.log('================two')
    const openIdApi = yield* newFunction()
    console.log('================three')
    const data = yield call(
      openIdApi.getAllOpenidClients,
      payload.action.action_data,
    )
    yield put(getOpenidClientsResponse(data))
    yield call(postUserAction, audit)
  } catch (e) {
    console.log('================' + e)
    yield put(getOpenidClientsResponse(null))
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
    yield put(addClientResponse(data))
    yield call(postUserAction, audit)
  } catch (e) {
    yield put(addClientResponse(null))
    if (isFourZeroOneError(e)) {
      console.log(e)
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
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
    yield put(editClientResponse(data))
    yield call(postUserAction, audit)
  } catch (e) {
    console.log(e)
    yield put(editClientResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* deleteAClient({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, DELETION, OIDC, payload)
    const api = yield* newFunction()
    yield call(api.deleteAClient, payload.action.action_data)
    yield put(deleteClientResponse(payload.action.action_data))
    yield call(postUserAction, audit)
  } catch (e) {
    yield put(deleteClientResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* getOpenidClientsWatcher() {
  yield takeLatest(GET_OPENID_CLIENTS, getOauthOpenidClients)
}

export function* searchClientsWatcher() {
  yield takeLatest(SEARCH_CLIENTS, getOauthOpenidClients)
}

export function* addClientWatcher() {
  yield takeLatest(ADD_NEW_CLIENT, addNewClient)
}

export function* editClientWatcher() {
  yield takeLatest(EDIT_CLIENT, editAClient)
}
export function* deleteClientWatcher() {
  yield takeLatest(DELETE_CLIENT, deleteAClient)
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
