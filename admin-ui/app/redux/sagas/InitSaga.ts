import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import type { SelectEffect } from 'redux-saga/effects'
import type { PayloadAction } from '@reduxjs/toolkit'
import { isFourZeroThreeError, addAdditionalData } from 'Utils/TokenController'
import {
  getAttributesResponse,
  getScriptsResponse,
  getScopesResponse,
  getClientsResponse,
} from '../features/initSlice'
import { postUserAction } from '../api/backend-api'
import { initAudit, redirectToLogout } from '../sagas/SagaUtils'
import InitApi from '../api/InitApi'
import { getClient } from '../api/base'
import type { GenericItem, PagedResult } from 'Redux/types'
import type { AuditLog, SagaActionPayload, HttpErrorLike } from './types'
import type { UserActionPayload } from '../api/types/BackendApi'
import * as JansConfigApi from 'jans_config_api'

function* initScripts(): Generator<SelectEffect, InitApi, string> {
  const issuer = (yield select(
    (state: { authReducer: { issuer: string } }) => state.authReducer.issuer,
  )) as string
  const api = new JansConfigApi.CustomScriptsApi(getClient(JansConfigApi, null, issuer))
  return new InitApi(api)
}

function* initScopes(): Generator<SelectEffect, InitApi, string> {
  const issuer = (yield select(
    (state: { authReducer: { issuer: string } }) => state.authReducer.issuer,
  )) as string
  const api = new JansConfigApi.OAuthScopesApi(getClient(JansConfigApi, null, issuer))
  return new InitApi(api)
}

function* initClients(): Generator<SelectEffect, InitApi, string> {
  const issuer = (yield select(
    (state: { authReducer: { issuer: string } }) => state.authReducer.issuer,
  )) as string
  const api = new JansConfigApi.OAuthOpenIDConnectClientsApi(getClient(JansConfigApi, null, issuer))
  return new InitApi(api)
}

function* initAttributes(): Generator<SelectEffect, InitApi, string> {
  const issuer = (yield select(
    (state: { authReducer: { issuer: string } }) => state.authReducer.issuer,
  )) as string
  const api = new JansConfigApi.AttributeApi(getClient(JansConfigApi, null, issuer))
  return new InitApi(api)
}

export function* getScripts(action: PayloadAction<SagaActionPayload>) {
  const { payload } = action
  const audit: AuditLog = yield* initAudit()
  try {
    addAdditionalData(audit, 'FETCH SCRIPTS FOR STAT', 'SCRIPT', payload)
    const scriptApi: InitApi = yield* initScripts()
    const data = (yield call([scriptApi, scriptApi.getScripts])) as PagedResult
    yield put(getScriptsResponse({ data }))
    yield call(postUserAction, audit as UserActionPayload)
  } catch (e) {
    yield put(getScriptsResponse({ data: undefined }))
    if (isFourZeroThreeError(e as HttpErrorLike)) {
      yield* redirectToLogout()
      return
    }
  }
}

export function* getClients(action: PayloadAction<SagaActionPayload>) {
  const payload = action.payload ?? ({ action: {} } as SagaActionPayload)
  const audit: AuditLog = yield* initAudit()
  try {
    addAdditionalData(audit, 'FETCH CIENTS FOR STAT', 'OIDC', payload)
    const openIdApi: InitApi = yield* initClients()
    const data = (yield call(
      [openIdApi, openIdApi.getClients],
      payload.action.action_data as Record<string, string | number>,
    )) as PagedResult
    yield put(getClientsResponse({ data }))
    yield call(postUserAction, audit as UserActionPayload)
  } catch (e) {
    yield put(getClientsResponse({ data: undefined }))
    if (isFourZeroThreeError(e as HttpErrorLike)) {
      yield* redirectToLogout()
      return
    }
  }
}

export function* getScopes(action: PayloadAction<SagaActionPayload>) {
  const { payload } = action
  const audit: AuditLog = yield* initAudit()
  try {
    addAdditionalData(audit, 'FETCH SCOPES FOR STAT', 'SCOPE', payload)
    const scopeApi: InitApi = yield* initScopes()
    const data = (yield call(
      [scopeApi, scopeApi.getScopes],
      payload.action.action_data as Record<string, string | number>,
    )) as GenericItem[]
    yield put(getScopesResponse({ data }))
    yield call(postUserAction, audit as UserActionPayload)
  } catch (e) {
    yield put(getScopesResponse({ data: undefined }))
    if (isFourZeroThreeError(e as HttpErrorLike)) {
      yield* redirectToLogout()
      return
    }
  }
}

export function* getAttributes(action: PayloadAction<SagaActionPayload>) {
  const { payload } = action
  const audit: AuditLog = yield* initAudit()
  try {
    addAdditionalData(audit, 'FETCH ATTRIBUTES FOR STAT', 'SCOPE', payload)
    const attributeApi: InitApi = yield* initAttributes()
    const data = (yield call(
      [attributeApi, attributeApi.getAttributes],
      payload.options as Record<string, string | number>,
    )) as PagedResult
    yield put(getAttributesResponse({ data }))
    yield call(postUserAction, audit as UserActionPayload)
  } catch (e) {
    yield put(getAttributesResponse({ data: undefined }))
    if (isFourZeroThreeError(e as HttpErrorLike)) {
      yield* redirectToLogout()
      return
    }
  }
}

export function* watchGetScripts() {
  yield takeLatest(
    'init/getScripts',
    getScripts as (...args: [PayloadAction<SagaActionPayload>]) => Generator,
  )
}
export function* watchGetClients() {
  yield takeLatest(
    'init/getClients',
    getClients as (...args: [PayloadAction<SagaActionPayload>]) => Generator,
  )
}
export function* watchGetScopes() {
  yield takeLatest(
    'init/getScopes',
    getScopes as (...args: [PayloadAction<SagaActionPayload>]) => Generator,
  )
}
export function* watchGetAttributes() {
  yield takeLatest(
    'init/getAttributes',
    getAttributes as (...args: [PayloadAction<SagaActionPayload>]) => Generator,
  )
}

export default function* rootSaga() {
  yield all([
    fork(watchGetScripts),
    fork(watchGetClients),
    fork(watchGetScopes),
    fork(watchGetAttributes),
  ])
}
