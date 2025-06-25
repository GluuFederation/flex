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
  setTriggerWebhookResponse,
  setWebhookModal,
  setWebhookTriggerErrors,
  setFeatureToTrigger,
  setShowErrorModal,
} from 'Plugins/admin/redux/features/WebhookSlice'
import { CREATE, FETCH, DELETION, UPDATE } from '../../../../app/audit/UserActionType'
import { getAPIAccessToken } from 'Redux/features/authSlice'
import { updateToast } from 'Redux/features/toastSlice'
import { isFourZeroOneError, addAdditionalData } from 'Utils/TokenController'
import WebhookApi from '../api/WebhookApi'
import { getClient } from 'Redux/api/base'
import { postUserAction } from 'Redux/api/backend-api'
const JansConfigApi = require('jans_config_api')
import { initAudit } from 'Redux/sagas/SagaUtils'
import { webhookOutputObject } from 'Plugins/admin/helper/utils'

function* newFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.AdminUIWebhooksApi(getClient(JansConfigApi, token, issuer))
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
    yield put(updateToast(true, 'error', e?.response?.body?.responseMessage || e.message))
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
    const data = yield call(webhookApi.createWebhook, payload.action.action_data)
    yield put(createWebhookResponse({ data }))
    yield call(postUserAction, audit)
    return data
  } catch (e) {
    yield put(updateToast(true, 'error', e?.response?.body?.responseMessage || e.message))
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
    const data = yield call(webhookApi.deleteWebhookByInum, payload.action.action_data.inum)
    yield put(deleteWebhookResponse({ data }))
    yield call(postUserAction, audit)
    yield put(getWebhook())
    return data
  } catch (e) {
    yield put(updateToast(true, 'error', e?.response?.body?.responseMessage || e.message))
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
    const data = yield call(webhookApi.updateWebhook, payload.action.action_data)
    yield put(updateWebhookResponse({ data }))
    yield call(postUserAction, audit)
    yield put(getWebhook())
    return data
  } catch (e) {
    yield put(updateToast(true, 'error', e?.response?.body?.responseMessage || e.message))
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
    addAdditionalData(audit, FETCH, 'webhook', {})
    const webhookApi = yield* newFunction()
    const data = yield call(webhookApi.getAllFeatures)
    yield put(getFeaturesResponse(data?.body || []))
    yield call(postUserAction, audit)
    return data
  } catch (e) {
    console.log('error: ', e)
    yield put(updateToast(true, 'error', e?.response?.body?.responseMessage || e.message))
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
    addAdditionalData(audit, FETCH, 'webhook', payload)
    const webhookApi = yield* newFunction()
    const data = yield call(webhookApi.getFeaturesByWebhookId, payload)
    yield put(getFeaturesByWebhookIdResponse(data?.body || []))
    yield call(postUserAction, audit)
    return data
  } catch (e) {
    console.log('error: ', e)
    yield put(updateToast(true, 'error', e?.response?.body?.responseMessage || e.message))
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
    addAdditionalData(audit, FETCH, `/webhook/${payload}`, payload)
    const webhookApi = yield* newFunction()
    const data = yield call(webhookApi.getWebhooksByFeatureId, payload)
    if (data?.body?.length && data?.body?.filter((item) => item.jansEnabled)?.length) {
      yield put(setWebhookModal(true))
    }
    yield put(getWebhooksByFeatureIdResponse(data?.body || []))
    yield call(postUserAction, audit)
    return data
  } catch (e) {
    console.log('error: ', e)
    yield put(updateToast(true, 'error', e?.response?.body?.responseMessage || e.message))
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
    const webhookApi = yield* newFunction()
    const featureToTrigger = yield select((state) => state.webhookReducer.featureToTrigger)
    const featureWebhooks = yield select((state) => state.webhookReducer.featureWebhooks)
    const enabledFeatureWebhooks = featureWebhooks?.filter((item) => item.jansEnabled)

    if (!enabledFeatureWebhooks.length || !featureToTrigger) {
      yield put(setFeatureToTrigger(''))
      return
    }

    const outputObject = webhookOutputObject(enabledFeatureWebhooks, payload.createdFeatureValue)
    const data = yield call(webhookApi.triggerWebhook, {
      feature: featureToTrigger,
      outputObject,
    })

    const action_data = data?.body
      ?.map((body) => {
        for (const output of outputObject) {
          if (output.inum === body?.responseObject?.inum) {
            return {
              ...body,
              url: output?.url,
            }
          }
        }
      })
      ?.filter((item) => item)

    addAdditionalData(audit, FETCH, `/webhook/${featureToTrigger}`, {
      action: { action_data: action_data || [] },
    })
    yield put(setFeatureToTrigger(''))
    const all_succeded = data?.body?.every((item) => item.success)
    if (all_succeded) {
      yield put(setShowErrorModal(false))
      yield put(setWebhookModal(false))
      yield put(setTriggerWebhookResponse(''))
      yield put(updateToast(true, 'success', 'All webhooks triggered successfully.'))
    } else {
      const errors = data?.body?.map((item) => !item.success && item)?.filter((err) => err)
      yield put(setWebhookTriggerErrors(errors))
      yield put(setTriggerWebhookResponse('Something went wrong while triggering webhook.'))
      yield put(updateToast(true, 'error', 'Something went wrong while triggering webhook.'))
      yield put(setShowErrorModal(true))
    }
    yield call(postUserAction, audit)
    return data
  } catch (e) {
    console.log('error: ', e)
    yield put(updateToast(true, 'error', e?.response?.body?.responseMessage || e.message))
    yield put(setWebhookModal(true))
    yield put(setTriggerWebhookResponse(e?.response?.body?.responseMessage || e.message))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    addAdditionalData(audit, FETCH, `/webhook/${payload}`, {
      action: { action_data: { error: e, success: false } },
    })
    yield call(postUserAction, audit)
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
    fork(watchGetTriggerWebhook),
  ])
}
