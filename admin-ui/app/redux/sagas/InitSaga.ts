import { call, all, put, fork, takeLatest } from 'redux-saga/effects'
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
import type { GenericItem, PagedResult } from 'Redux/types'
import type { AuditLog, SagaActionPayload, HttpErrorLike } from './types'
import type { UserActionPayload } from '../api/types/BackendApi'
import {
  getConfigScripts,
  getOauthScopes,
  getOauthOpenidClients,
  getAttributes as fetchAttributes,
} from 'JansConfigApi'
import type {
  GetOauthScopesParams,
  GetOauthOpenidClientsParams,
  GetAttributesParams,
} from 'JansConfigApi'

export function* getScripts(action: PayloadAction<SagaActionPayload>) {
  const payload = action.payload ?? ({ action: {} } as SagaActionPayload)
  const audit: AuditLog = yield* initAudit()
  try {
    addAdditionalData(audit, 'FETCH SCRIPTS FOR STAT', 'SCRIPT', payload)
    const data = (yield call(getConfigScripts)) as PagedResult
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
    addAdditionalData(audit, 'FETCH CLIENTS FOR STAT', 'OIDC', payload)
    const params = (payload.action.action_data ?? {}) as GetOauthOpenidClientsParams
    const data = (yield call(getOauthOpenidClients, params)) as PagedResult
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
  const payload = action.payload ?? ({ action: {} } as SagaActionPayload)
  const audit: AuditLog = yield* initAudit()
  try {
    addAdditionalData(audit, 'FETCH SCOPES FOR STAT', 'SCOPE', payload)
    const params = (payload.action.action_data ?? {}) as GetOauthScopesParams
    const data = (yield call(getOauthScopes, params)) as GenericItem[]
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
  const payload = action.payload ?? ({ action: {} } as SagaActionPayload)
  const audit: AuditLog = yield* initAudit()
  try {
    addAdditionalData(audit, 'FETCH ATTRIBUTES FOR STAT', 'SCOPE', payload)
    const params = (payload.options ?? {}) as GetAttributesParams
    const data = (yield call(fetchAttributes, params)) as PagedResult
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
