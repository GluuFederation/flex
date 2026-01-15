import {
  call,
  all,
  put,
  fork,
  takeLatest,
  select,
  CallEffect,
  PutEffect,
  SelectEffect,
  ForkEffect,
  AllEffect,
} from 'redux-saga/effects'
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
import { updateToast } from 'Redux/features/toastSlice'
import { isFourZeroSixError, addAdditionalData } from 'Utils/TokenController'
import WebhookApi from '../api/WebhookApi'
import { getClient } from 'Redux/api/base'
import { postUserAction } from 'Redux/api/backend-api'
const JansConfigApi = require('jans_config_api')
import { initAudit, redirectToLogout } from 'Redux/sagas/SagaUtils'
import { webhookOutputObject } from 'Plugins/admin/helper/utils'
import {
  RootState,
  Webhook,
  WebhookActionPayload,
  FeatureActionPayload,
  TriggerWebhookPayload,
  AuditLog,
  ApiError,
  WebhookResponse,
} from './types'

function* newFunction(): Generator<SelectEffect, WebhookApi, any> {
  const issuer: string = yield select((state: RootState) => state.authReducer.issuer)
  const api = new JansConfigApi.AdminUIWebhooksApi(getClient(JansConfigApi, null, issuer))
  return new WebhookApi(api)
}

export function* getWebhooks({
  payload,
}: {
  payload: WebhookActionPayload
}): Generator<CallEffect | PutEffect | SelectEffect, any, any> {
  const audit: AuditLog = yield call(initAudit)
  try {
    payload = payload || { action: {} }
    addAdditionalData(audit, FETCH, 'webhook', payload)
    const webhookApi: WebhookApi = yield call(newFunction)
    const data: any = yield call(webhookApi.getAllWebhooks, payload.action)
    yield put(getWebhookResponse({ data }))
    yield call(postUserAction, audit)
    return data
  } catch (e: unknown) {
    const error = e as ApiError
    yield put(
      updateToast(
        true,
        'error',
        error?.response?.body?.responseMessage || error.message || 'Unknown error',
      ),
    )
    yield put(getWebhookResponse({ data: null }))
    if (isFourZeroSixError(error)) {
      yield* redirectToLogout()
      return
    }
    return error
  }
}

export function* createWebhook({
  payload,
}: {
  payload: WebhookActionPayload
}): Generator<CallEffect | PutEffect | SelectEffect, any, any> {
  const audit: AuditLog = yield call(initAudit)
  try {
    addAdditionalData(audit, CREATE, 'webhook', payload)
    const webhookApi: WebhookApi = yield call(newFunction)
    const data: any = yield call(webhookApi.createWebhook, payload.action?.action_data)
    yield put(createWebhookResponse({ data }))
    yield call(postUserAction, audit)
    return data
  } catch (e: unknown) {
    const error = e as ApiError
    yield put(
      updateToast(
        true,
        'error',
        error?.response?.body?.responseMessage || error.message || 'Unknown error',
      ),
    )
    yield put(createWebhookResponse({ data: null }))
    if (isFourZeroSixError(error)) {
      yield* redirectToLogout()
      return
    }
    return error
  }
}

export function* deleteWebhook({
  payload,
}: {
  payload: WebhookActionPayload
}): Generator<CallEffect | PutEffect | SelectEffect, any, any> {
  const audit: AuditLog = yield call(initAudit)
  try {
    addAdditionalData(audit, DELETION, 'webhook', payload)
    const webhookApi: WebhookApi = yield call(newFunction)
    const data: any = yield call(webhookApi.deleteWebhookByInum, payload.action?.action_data?.inum)
    yield put(deleteWebhookResponse())
    yield call(postUserAction, audit)
    yield put(getWebhook({}))
    return data
  } catch (e: unknown) {
    const error = e as ApiError
    yield put(
      updateToast(
        true,
        'error',
        error?.response?.body?.responseMessage || error.message || 'Unknown error',
      ),
    )
    yield put(deleteWebhookResponse())
    if (isFourZeroSixError(error)) {
      yield* redirectToLogout()
      return
    }
    return error
  }
}

export function* updateWebhook({
  payload,
}: {
  payload: WebhookActionPayload
}): Generator<CallEffect | PutEffect | SelectEffect, any, any> {
  const audit: AuditLog = yield call(initAudit)
  try {
    addAdditionalData(audit, UPDATE, 'webhook', payload)
    const webhookApi: WebhookApi = yield call(newFunction)
    const data: any = yield call(webhookApi.updateWebhook, payload.action?.action_data)
    yield put(updateWebhookResponse({ data }))
    yield call(postUserAction, audit)
    yield put(getWebhook({}))
    return data
  } catch (e: unknown) {
    const error = e as ApiError
    yield put(
      updateToast(
        true,
        'error',
        error?.response?.body?.responseMessage || error.message || 'Unknown error',
      ),
    )
    yield put(updateWebhookResponse({ data: null }))
    if (isFourZeroSixError(error)) {
      yield* redirectToLogout()
      return
    }
    return error
  }
}

export function* getFeatures(): Generator<CallEffect | PutEffect | SelectEffect, any, any> {
  const audit: AuditLog = yield call(initAudit)
  try {
    addAdditionalData(audit, FETCH, 'webhook', {})
    const webhookApi: WebhookApi = yield call(newFunction)
    const data: any = yield call(webhookApi.getAllFeatures)
    yield put(getFeaturesResponse(data?.body || []))
    yield call(postUserAction, audit)
    return data
  } catch (e: unknown) {
    const error = e as ApiError
    console.log('error: ', error)
    yield put(
      updateToast(
        true,
        'error',
        error?.response?.body?.responseMessage || error.message || 'Unknown error',
      ),
    )
    yield put(getFeaturesResponse([]))
    if (isFourZeroSixError(error)) {
      yield* redirectToLogout()
      return
    }
    return error
  }
}

export function* getFeaturesByWebhookId({
  payload,
}: {
  payload: FeatureActionPayload
}): Generator<CallEffect | PutEffect | SelectEffect, any, any> {
  const audit: AuditLog = yield call(initAudit)
  try {
    addAdditionalData(audit, FETCH, 'webhook', payload)
    const webhookApi: WebhookApi = yield call(newFunction)
    const data: any = yield call(webhookApi.getFeaturesByWebhookId, payload.webhookId || payload)
    yield put(getFeaturesByWebhookIdResponse(data?.body || []))
    yield call(postUserAction, audit)
    return data
  } catch (e: unknown) {
    const error = e as ApiError
    console.log('error: ', error)
    yield put(
      updateToast(
        true,
        'error',
        error?.response?.body?.responseMessage || error.message || 'Unknown error',
      ),
    )
    yield put(getFeaturesByWebhookIdResponse([]))
    if (isFourZeroSixError(error)) {
      yield* redirectToLogout()
      return
    }
    return error
  }
}

export function* getWebhooksByFeatureId({
  payload,
}: {
  payload: string
}): Generator<CallEffect | PutEffect | SelectEffect, any, any> {
  const audit: AuditLog = yield call(initAudit)
  try {
    addAdditionalData(audit, FETCH, `/webhook/${payload}`, payload)
    const webhookApi: WebhookApi = yield call(newFunction)
    const data: any = yield call(webhookApi.getWebhooksByFeatureId, payload)
    if (data?.body?.length && data?.body?.filter((item: Webhook) => item.jansEnabled)?.length) {
      yield put(setWebhookModal(true))
    }
    yield put(getWebhooksByFeatureIdResponse(data?.body || []))
    yield call(postUserAction, audit)
    return data
  } catch (e: unknown) {
    const error = e as ApiError
    console.log('error: ', error)
    yield put(
      updateToast(
        true,
        'error',
        error?.response?.body?.responseMessage || error.message || 'Unknown error',
      ),
    )
    yield put(getWebhooksByFeatureIdResponse([]))
    if (isFourZeroSixError(error)) {
      yield* redirectToLogout()
      return
    }
    return error
  }
}

export function* triggerWebhook({
  payload,
}: {
  payload: TriggerWebhookPayload
}): Generator<CallEffect | PutEffect | SelectEffect, any, any> {
  const audit: AuditLog = yield call(initAudit)
  try {
    const webhookApi: WebhookApi = yield call(newFunction)
    const featureToTrigger: string = yield select(
      (state: RootState) => state.webhookReducer.featureToTrigger,
    )
    const featureWebhooks: Webhook[] = yield select(
      (state: RootState) => state.webhookReducer.featureWebhooks,
    )
    const enabledFeatureWebhooks: Webhook[] = featureWebhooks?.filter(
      (item: Webhook) => item.jansEnabled,
    )

    if (!enabledFeatureWebhooks.length || !featureToTrigger) {
      yield put(setFeatureToTrigger(''))
      return
    }

    const outputObject = webhookOutputObject(enabledFeatureWebhooks, payload.createdFeatureValue)
    const data: any = yield call(webhookApi.triggerWebhook, {
      feature: featureToTrigger,
      outputObject,
    })

    const action_data = data?.body
      ?.map((body: WebhookResponse) => {
        for (const output of outputObject) {
          if (output.inum === body?.responseObject?.inum) {
            return {
              ...body,
              url: output?.url,
            }
          }
        }
      })
      ?.filter((item: any) => item)

    addAdditionalData(audit, FETCH, `/webhook/${featureToTrigger}`, {
      action: { action_data: action_data || [] },
    })
    yield put(setFeatureToTrigger(''))
    const all_succeded = data?.body?.every((item: WebhookResponse) => item.success)
    if (all_succeded) {
      yield put(setShowErrorModal(false))
      yield put(setWebhookModal(false))
      yield put(setTriggerWebhookResponse(''))
      yield put(updateToast(true, 'success', 'All webhooks triggered successfully.'))
    } else {
      const errors = data?.body
        ?.map((item: WebhookResponse) => !item.success && item)
        ?.filter((err: any) => err)
      yield put(setWebhookTriggerErrors(errors))
      yield put(setTriggerWebhookResponse('Something went wrong while triggering webhook.'))
      yield put(updateToast(true, 'error', 'Something went wrong while triggering webhook.'))
      yield put(setShowErrorModal(true))
    }
    yield call(postUserAction, audit)
    return data
  } catch (e: unknown) {
    const error = e as ApiError
    console.log('error: ', error)
    yield put(
      updateToast(
        true,
        'error',
        error?.response?.body?.responseMessage || error.message || 'Unknown error',
      ),
    )
    yield put(setWebhookModal(true))
    yield put(
      setTriggerWebhookResponse(
        error?.response?.body?.responseMessage || error.message || 'Unknown error',
      ),
    )
    if (isFourZeroSixError(error)) {
      yield* redirectToLogout()
      return
    }
    addAdditionalData(audit, FETCH, `/webhook/${payload}`, {
      action: { action_data: { error: error, success: false } },
    })
    yield call(postUserAction, audit)
    return error
  }
}

export function* watchGetWebhook(): Generator<ForkEffect<never>, void, unknown> {
  yield takeLatest('webhook/getWebhook' as any, getWebhooks)
}

export function* watchCreateWebhook(): Generator<ForkEffect<never>, void, unknown> {
  yield takeLatest('webhook/createWebhook' as any, createWebhook)
}

export function* watchDeleteWebhook(): Generator<ForkEffect<never>, void, unknown> {
  yield takeLatest('webhook/deleteWebhook' as any, deleteWebhook)
}

export function* watchUpdateWebhook(): Generator<ForkEffect<never>, void, unknown> {
  yield takeLatest('webhook/updateWebhook' as any, updateWebhook)
}

export function* watchGetFeatures(): Generator<ForkEffect<never>, void, unknown> {
  yield takeLatest('webhook/getFeatures' as any, getFeatures)
}

export function* watchGetFeaturesByWebhookId(): Generator<ForkEffect<never>, void, unknown> {
  yield takeLatest('webhook/getFeaturesByWebhookId' as any, getFeaturesByWebhookId)
}

export function* watchGetWebhooksByFeatureId(): Generator<ForkEffect<never>, void, unknown> {
  yield takeLatest('webhook/getWebhooksByFeatureId' as any, getWebhooksByFeatureId)
}

export function* watchGetTriggerWebhook(): Generator<ForkEffect<never>, void, unknown> {
  yield takeLatest('webhook/triggerWebhook' as any, triggerWebhook)
}

export default function* rootSaga(): Generator<AllEffect<ForkEffect<void>>, void, unknown> {
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
