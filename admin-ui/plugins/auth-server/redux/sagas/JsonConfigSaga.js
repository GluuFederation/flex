import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import JsonConfigApi from '../api/JsonConfigApi'
import { getClient } from 'Redux/api/base'
import { JSON_CONFIG } from '../audit/Resources'
import { PATCH, FETCH, DELETION } from '../../../../app/audit/UserActionType'
import { postUserAction } from 'Redux/api/backend-api'
import { updateToast } from 'Redux/features/toastSlice'
import { isFourZeroThreeError, addAdditionalData } from 'Utils/TokenController'
import { getJsonConfigResponse, patchJsonConfigResponse } from '../features/jsonConfigSlice'
import { initAudit, redirectToLogout } from 'Redux/sagas/SagaUtils'
import { enhanceJsonConfigAuditPayload } from '../utils/auditHelpers'
import * as JansConfigApi from 'jans_config_api'

function* newFunction() {
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.ConfigurationPropertiesApi(getClient(JansConfigApi, null, issuer))
  return new JsonConfigApi(api)
}

export function* getJsonConfig({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, FETCH, JSON_CONFIG, payload)
    const configApi = yield* newFunction()
    const data = yield call(configApi.fetchJsonConfig)
    yield put(getJsonConfigResponse({ data }))
    yield call(postUserAction, audit)
    return data
  } catch (e) {
    console.log(e)
    yield put(getJsonConfigResponse(null))
    if (isFourZeroThreeError(e)) {
      yield* redirectToLogout()
      return
    }
    return e
  }
}

export function* patchJsonConfig({ payload }) {
  const audit = yield* initAudit()
  try {
    const enhancedPayload = enhanceJsonConfigAuditPayload(payload, JSON_CONFIG)
    const isDeleteOperation = payload?.action?.action_data?.deletedMapping
    const actionType = isDeleteOperation ? DELETION : PATCH
    addAdditionalData(audit, actionType, JSON_CONFIG, enhancedPayload)
    const configApi = yield* newFunction()
    const data = yield call(configApi.patchJsonConfig, payload.action.action_data)
    yield put(updateToast(true, 'success'))
    yield put(patchJsonConfigResponse({ data }))
    yield call(postUserAction, audit)
    return data
  } catch (e) {
    console.log('error', e)
    yield put(updateToast(true, 'error'))
    yield put(patchJsonConfigResponse(null))
    if (isFourZeroThreeError(e)) {
      // Session expired - redirect to login
      yield* redirectToLogout()
      return
    }
    return e
  }
}

export function* watchGetJsonConfig() {
  yield takeLatest('jsonConfig/getJsonConfig', getJsonConfig)
}
export function* watchPatchJsonConfig() {
  yield takeLatest('jsonConfig/patchJsonConfig', patchJsonConfig)
}

export default function* rootSaga() {
  yield all([fork(watchGetJsonConfig), fork(watchPatchJsonConfig)])
}
