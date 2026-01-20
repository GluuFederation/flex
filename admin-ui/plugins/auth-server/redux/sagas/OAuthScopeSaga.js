import { call, all, put, fork, takeEvery, takeLatest, select } from 'redux-saga/effects'
import { updateToast } from 'Redux/features/toastSlice'
import { SCOPE } from '../audit/Resources'
import { CREATE, UPDATE, DELETION, FETCH } from '../../../../app/audit/UserActionType'
import ScopeApi from '../api/ScopeApi'
import { getClient } from 'Redux/api/base'
import { isFourZeroThreeError, addAdditionalData } from 'Utils/TokenController'
import { postUserAction } from 'Redux/api/backend-api'
import { triggerWebhook } from 'Plugins/admin/redux/sagas/WebhookSaga'
import { initAudit, redirectToLogout } from 'Redux/sagas/SagaUtils'
const JansConfigApi = require('jans_config_api')
import {
  deleteScopeResponse,
  handleUpdateScopeResponse,
  scopeHandleLoading,
  setCurrentItem,
  editScopeResponse,
  addScopeResponse,
  getScopeByCreatorResponse,
  getClientScopesResponse,
} from '../features/scopeSlice'

function* newFunction() {
  const issuer = yield select((state) => state.authReducer.issuer)
  // Use null for token - HttpOnly session cookie handles auth
  const api = new JansConfigApi.OAuthScopesApi(getClient(JansConfigApi, null, issuer))
  return new ScopeApi(api)
}

export function* getScopeByInum({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, FETCH, SCOPE, {})
    const scopeApi = yield* newFunction()
    const data = yield call(scopeApi.getScope, payload.action)
    yield put(setCurrentItem(data))
    yield call(postUserAction, audit)
  } catch (e) {
    yield put(deleteScopeResponse(null))
    if (isFourZeroThreeError(e)) {
      // Session expired - redirect to login
      yield* redirectToLogout()
      return
    }
  }
}
export function* getScopeByCreator({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, FETCH, SCOPE, {})
    const scopeApi = yield* newFunction()
    const data = yield call(scopeApi.getScopeByCreator, payload.item.inum)
    yield put(getScopeByCreatorResponse(data))
    yield call(postUserAction, audit)
  } catch (e) {
    if (isFourZeroThreeError(e)) {
      // Session expired - redirect to login
      yield* redirectToLogout()
      return
    }
  }
}

export function* getScopes({ payload }) {
  const audit = yield* initAudit()
  try {
    yield put(scopeHandleLoading())
    addAdditionalData(audit, FETCH, SCOPE, payload)
    const scopeApi = yield* newFunction()
    const data = yield call(scopeApi.getAllScopes, payload.action)
    yield put(handleUpdateScopeResponse({ data: data }))
    yield call(postUserAction, audit)
    return data
  } catch (e) {
    yield put(handleUpdateScopeResponse({ data: null }))
    if (isFourZeroThreeError(e)) {
      // Session expired - redirect to login
      yield* redirectToLogout()
      return
    }
    return e
  }
}

export function* getClientScopes({ payload }) {
  const audit = yield* initAudit()
  try {
    yield put(scopeHandleLoading())
    addAdditionalData(audit, FETCH, SCOPE, payload)
    const scopeApi = yield* newFunction()
    const data = yield call(scopeApi.getAllScopes, payload.action)
    yield put(getClientScopesResponse({ data }))
    yield call(postUserAction, audit)
  } catch (e) {
    yield put(getClientScopesResponse(null))
    if (isFourZeroThreeError(e)) {
      // Session expired - redirect to login
      yield* redirectToLogout()
      return
    }
  }
}

export function* addAScope({ payload }) {
  const audit = yield* initAudit()
  try {
    yield put(scopeHandleLoading())
    addAdditionalData(audit, CREATE, SCOPE, payload)
    const scopeApi = yield* newFunction()
    const data = yield call(scopeApi.addNewScope, payload.action.action_data)
    yield put(updateToast(true, 'success'))
    yield put(addScopeResponse({ data }))
    yield call(postUserAction, audit)
    yield* triggerWebhook({ payload: { createdFeatureValue: data } })
    return data
  } catch (e) {
    yield put(updateToast(true, 'error'))
    yield put(addScopeResponse(null))
    if (isFourZeroThreeError(e)) {
      // Session expired - redirect to login
      yield* redirectToLogout()
      return
    }
    return e
  }
}

export function* editAnScope({ payload }) {
  const audit = yield* initAudit()
  try {
    yield put(scopeHandleLoading())
    addAdditionalData(audit, UPDATE, SCOPE, payload)
    const scopeApi = yield* newFunction()
    const data = yield call(scopeApi.editAScope, payload.action.action_data)
    yield put(updateToast(true, 'success'))
    yield put(editScopeResponse({ data }))
    yield call(postUserAction, audit)
    yield* triggerWebhook({ payload: { createdFeatureValue: data } })
    return data
  } catch (e) {
    yield put(updateToast(true, 'error'))
    yield put(editScopeResponse(null))
    if (isFourZeroThreeError(e)) {
      // Session expired - redirect to login
      yield* redirectToLogout()
      return
    }
    return e
  }
}

export function* deleteAnScope({ payload }) {
  const audit = yield* initAudit()
  try {
    yield put(scopeHandleLoading())
    addAdditionalData(audit, DELETION, SCOPE, payload)
    const scopeApi = yield* newFunction()
    yield call(scopeApi.deleteAScope, payload.action.action_data?.inum)
    yield put(updateToast(true, 'success'))
    yield put(deleteScopeResponse({ data: payload.action.action_data?.inum }))
    yield call(postUserAction, audit)
    yield* triggerWebhook({ payload: { createdFeatureValue: payload.action.action_data } })
  } catch (e) {
    yield put(updateToast(true, 'error'))
    yield put(deleteScopeResponse({ data: null }))
    if (isFourZeroThreeError(e)) {
      // Session expired - redirect to login
      yield* redirectToLogout()
      return
    }
  }
}

export function* watchGetScopeByInum() {
  yield takeEvery('scope/getScopeByInum', getScopeByInum)
}
export function* watchGetScopeByCreator() {
  yield takeEvery('scope/getScopeByCreator', getScopeByCreator)
}
export function* watchGetScopes() {
  yield takeLatest('scope/getScopes', getScopes)
}
export function* watchGetClientScopes() {
  yield takeLatest('scope/getClientScopes', getClientScopes)
}
export function* watchSearchScopes() {
  yield takeLatest('scope/searchScopes', getScopes)
}
export function* watchAddScope() {
  yield takeLatest('scope/addScope', addAScope)
}
export function* watchEditScope() {
  yield takeLatest('scope/editScope', editAnScope)
}
export function* watchDeleteScope() {
  yield takeLatest('scope/deleteScope', deleteAnScope)
}

export default function* rootSaga() {
  yield all([
    fork(watchGetScopeByInum),
    fork(watchGetScopes),
    fork(watchSearchScopes),
    fork(watchAddScope),
    fork(watchEditScope),
    fork(watchDeleteScope),
    fork(watchGetScopeByCreator),
    fork(watchGetClientScopes),
  ])
}
