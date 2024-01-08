import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import {
  getWebhook,
  getWebhookResponse,
  createWebhookResponse,
  deleteWebhookResponse,
  updateWebhookResponse,
  getFeaturesResponse,
  getFeaturesByWebhookIdResponse,
  getWebhooksByFeatureIdResponse,
  triggerWebhookResponse,
  setWebhookModal,
  setWebhookTriggerErrors
} from 'Plugins/admin/redux/features/WebhookSlice'
import {
  CREATE,
  FETCH,
  DELETION,
  UPDATE,
} from '../../../../app/audit/UserActionType'
import { getAPIAccessToken } from 'Redux/features/authSlice'
import { updateToast } from 'Redux/features/toastSlice'
import { isFourZeroOneError, addAdditionalData } from 'Utils/TokenController'
import WebhookApi from '../api/WebhookApi'
import { getClient } from 'Redux/api/base'
import { postUserAction } from 'Redux/api/backend-api'
const JansConfigApi = require('jans_config_api')
import { initAudit } from 'Redux/sagas/SagaUtils'

function* newFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.AdminUIWebhooksApi(
    getClient(JansConfigApi, token, issuer)
  )
  return new WebhookApi(api)
}

export function* getWebhooks({ payload }) {
  const audit = yield* initAudit()
  try {
    payload = payload || { action: {} }
    addAdditionalData(audit, FETCH, 'webhook', payload)
    const webhookApi = yield* newFunction()
    const data = yield call(webhookApi.getAllWebhooks, payload.action)
    yield put(getWebhookResponse({ data }))
    yield call(postUserAction, audit)
    return data
  } catch (e) {
    yield put(
      updateToast(
        true,
        'error',
        e?.response?.body?.responseMessage || e.message
      )
    )
    yield put(getWebhookResponse({ data: null }))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* createWebhook({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, CREATE, 'webhook', payload)
    const webhookApi = yield* newFunction()
    const data = yield call(
      webhookApi.createWebhook,
      payload.action.action_data
    )
    yield put(createWebhookResponse({ data }))
    yield call(postUserAction, audit)
    return data
  } catch (e) {
    yield put(
      updateToast(
        true,
        'error',
        e?.response?.body?.responseMessage || e.message
      )
    )
    yield put(createWebhookResponse({ data: null }))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* deleteWebhook({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, DELETION, 'webhook', payload)
    const webhookApi = yield* newFunction()
    const data = yield call(
      webhookApi.deleteWebhookByInum,
      payload.action.action_data.webhookId
    )
    yield put(deleteWebhookResponse({ data }))
    yield call(postUserAction, audit)
    yield put(getWebhook())
    return data
  } catch (e) {
    yield put(
      updateToast(
        true,
        'error',
        e?.response?.body?.responseMessage || e.message
      )
    )
    yield put(deleteWebhookResponse({ data: null }))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* updateWebhook({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, UPDATE, 'webhook', payload)
    const webhookApi = yield* newFunction()
    const data = yield call(
      webhookApi.updateWebhook,
      payload.action.action_data
    )
    yield put(updateWebhookResponse({ data }))
    yield call(postUserAction, audit)
    yield put(getWebhook())
    return data
  } catch (e) {
    yield put(
      updateToast(
        true,
        'error',
        e?.response?.body?.responseMessage || e.message
      )
    )
    yield put(updateWebhookResponse({ data: null }))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* getFeatures() {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, FETCH, 'aui-features', {})
    const webhookApi = yield* newFunction()
    const data = yield call(webhookApi.getAllFeatures)
    yield put(getFeaturesResponse(data?.body || []))
    yield call(postUserAction, audit)
    return data
  } catch (e) {
    console.log('error: ', e)
    yield put(
      updateToast(
        true,
        'error',
        e?.response?.body?.responseMessage || e.message
      )
    )
    yield put(getFeaturesResponse([]))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* getFeaturesByWebhookId({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, FETCH, 'aui-features', payload)
    const webhookApi = yield* newFunction()
    const data = yield call(webhookApi.getFeaturesByWebhookId, payload)
    yield put(getFeaturesByWebhookIdResponse(data?.body || []))
    yield call(postUserAction, audit)
    return data
  } catch (e) {
    console.log('error: ', e)
    yield put(
      updateToast(
        true,
        'error',
        e?.response?.body?.responseMessage || e.message
      )
    )
    yield put(getFeaturesByWebhookIdResponse([]))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* getWebhooksByFeatureId({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, FETCH, 'aui-features', payload)
    const webhookApi = yield* newFunction()
    const data = yield call(webhookApi.getWebhooksByFeatureId, payload)
    yield put(getWebhooksByFeatureIdResponse(data?.body || []))
    yield call(postUserAction, audit)
    return data
  } catch (e) {
    console.log('error: ', e)
    yield put(
      updateToast(
        true,
        'error',
        e?.response?.body?.responseMessage || e.message
      )
    )
    yield put(getWebhooksByFeatureIdResponse([]))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* triggerWebhook({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, FETCH, 'aui-features', payload)
    const webhookApi = yield* newFunction()
    const data = yield call(webhookApi.triggerWebhook, payload)
    const all_succeded = data?.body?.every((item) => item.success)
    if (all_succeded) yield put(setWebhookModal(false)) 
    else {
      const errors = data?.body?.map((item) => item.responseMessage)
      yield put(setWebhookTriggerErrors(errors))
      yield put(triggerWebhookResponse('Something went wrong while triggering webhook.'))
    }    
    yield call(postUserAction, audit)
    return data
  } catch (e) {
    console.log('error: ', e)
    yield put(
      updateToast(
        true,
        'error',
        e?.response?.body?.responseMessage || e.message
      )
    )
    yield put(setWebhookModal(true))
    yield put(triggerWebhookResponse(e?.response?.body?.responseMessage || e.message))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* watchGetWebhook() {
  yield takeLatest('webhook/getWebhook', getWebhooks)
}

export function* watchCreateWebhook() {
  yield takeLatest('webhook/createWebhook', createWebhook)
}

export function* watchDeleteWebhook() {
  yield takeLatest('webhook/deleteWebhook', deleteWebhook)
}

export function* watchUpdateWebhook() {
  yield takeLatest('webhook/updateWebhook', updateWebhook)
}

export function* watchGetFeatures() {
  yield takeLatest('webhook/getFeatures', getFeatures)
}

export function* watchGetFeaturesByWebhookId() {
  yield takeLatest('webhook/getFeaturesByWebhookId', getFeaturesByWebhookId)
}

export function* watchGetWebhooksByFeatureId() {
  yield takeLatest('webhook/getWebhooksByFeatureId', getWebhooksByFeatureId)
}

export function* watchGetTriggerWebhook() {
  yield takeLatest('webhook/triggerWebhook', triggerWebhook)
}

export default function* rootSaga() {
  yield all([
    fork(watchGetWebhook),
    fork(watchCreateWebhook),
    fork(watchDeleteWebhook),
    fork(watchUpdateWebhook),
    fork(watchGetFeatures),
    fork(watchGetFeaturesByWebhookId),
    fork(watchGetWebhooksByFeatureId),
    fork(watchGetTriggerWebhook)
  ])
}
