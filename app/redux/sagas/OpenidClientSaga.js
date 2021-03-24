/**
 * Openid Client Sagas
 */
import { call, all, put, fork, select, takeLatest } from 'redux-saga/effects'
import {
  getOpenidClientsResponse,
  addClientResponse,
  editClientResponse,
  deleteClientResponse,
} from '../actions/OpenidClientActions'
import { getAPIAccessToken } from '../actions/AuthActions'
import {
  GET_OPENID_CLIENTS,
  ADD_CLIENT,
  EDIT_CLIENT,
  DELETE_CLIENT,
} from '../actions/types'
import OIDCApi from '../api/OIDCApi'
import { getClient } from '../api/base'
import { isFourZeroOneError } from '../../utils/TokenController'
const JansConfigApi = require('jans_config_api')

function* newFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.OAuthOpenIDConnectClientsApi(
    getClient(JansConfigApi, token, issuer),
  )
  return new OIDCApi(api)
}

export function* getOauthOpenidClients() {
  try {
    const openIdApi = yield* newFunction()
    const data = yield call(openIdApi.getAllOpenidClients)
    yield put(getOpenidClientsResponse(data))
  } catch (e) {
    yield put(getOpenidClientsResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* addNewClient({ payload }) {
  try {
    const postBody = {}
    postBody['client'] = JSON.parse(payload.data)
    //console.log('======Adding' + JSON.stringify(postBody))
    const api = yield* newFunction()
    const data = yield call(api.addNewClient, postBody)
    yield put(addClientResponse(data))
  } catch (e) {
    yield put(addClientResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* editAClient({ payload }) {
  try {
    const postBody = {}
    postBody['client'] = JSON.parse(payload.data)
    const api = yield* newFunction()
    const data = yield call(api.editAClient, postBody)
    yield put(editClientResponse(data))
  } catch (e) {
    yield put(editClientResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* deleteAClient({ payload }) {
  try {
    const api = yield* newFunction()
    const data = yield call(api.deleteAClient, payload.inum)
    yield put(deleteClientResponse(payload.inum))
  } catch (e) {
    yield put(deleteClientResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* watchGetOpenidClients() {
  yield takeLatest(GET_OPENID_CLIENTS, getOauthOpenidClients)
}

export function* watchAddClient() {
  yield takeLatest(ADD_CLIENT, addNewClient)
}

export function* watchEditClient() {
  yield takeLatest(EDIT_CLIENT, editAClient)
}
export function* watchDeleteClient() {
  yield takeLatest(DELETE_CLIENT, deleteAClient)
}

export default function* rootSaga() {
  yield all([
    fork(watchGetOpenidClients),
    fork(watchAddClient),
    fork(watchEditClient),
    fork(watchDeleteClient),
  ])
}
