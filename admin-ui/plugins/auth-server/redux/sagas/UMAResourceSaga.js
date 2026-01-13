import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import { isFourZeroOneError, addAdditionalData } from 'Utils/TokenController'
import { postUserAction } from 'Redux/api/backend-api'
import {
  getUMAResourcesByClientResponse,
  deleteUMAResourceResponse,
} from '../features/umaResourceSlice'
import { UMA } from '../audit/Resources'
import { FETCH, DELETION } from '../../../../app/audit/UserActionType'
import UMAResourceApi from '../api/UMAResourceApi'
import { getClient } from 'Redux/api/base'
const JansConfigApi = require('jans_config_api')
import { initAudit } from 'Redux/sagas/SagaUtils'

function* newFunction() {
  const issuer = yield select((state) => state.authReducer.issuer)
  // Use null for token - HttpOnly session cookie handles auth
  const api = new JansConfigApi.OAuthUMAResourcesApi(getClient(JansConfigApi, null, issuer))

  return new UMAResourceApi(api)
}

export function* getUMAResourcesByClient({ payload }) {
  const audit = yield* initAudit()
  try {
    payload = payload ? payload : {}
    addAdditionalData(audit, FETCH, UMA, payload)
    const openIdApi = yield* newFunction()
    const data = yield call(openIdApi.getUMAResources, payload.inum)
    yield put(getUMAResourcesByClientResponse({ data }))
    yield call(postUserAction, audit)
  } catch (e) {
    console.log(e)
    yield put(getUMAResourcesByClientResponse(null))
    if (isFourZeroOneError(e)) {
      // Session expired - redirect to login
      window.location.href = '/logout'
    }
  }
}

export function* deleteUMAResourceById({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, DELETION, UMA, payload)
    const api = yield* newFunction()
    yield call(api.deteleUMAResource, payload.action.id)
    yield put(deleteUMAResourceResponse({ data: payload.action.id }))
    yield call(postUserAction, audit)
  } catch (e) {
    yield put(deleteUMAResourceResponse(null))
    if (isFourZeroOneError(e)) {
      // Session expired - redirect to login
      window.location.href = '/logout'
    }
  }
}

export function* getUMAResourcesByClientWatcher() {
  yield takeLatest('umaResource/getUMAResourcesByClient', getUMAResourcesByClient)
}

export function* deleteUMAResourceByIdWatcher() {
  yield takeLatest('umaResource/deleteUMAResource', deleteUMAResourceById)
}

export default function* rootSaga() {
  yield all([fork(getUMAResourcesByClientWatcher), fork(deleteUMAResourceByIdWatcher)])
}
