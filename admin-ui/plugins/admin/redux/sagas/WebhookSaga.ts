import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import i18n from 'i18next'
import type { SelectEffect } from 'redux-saga/effects'
import type { SagaIterator } from 'redux-saga'
import type { PayloadAction } from '@reduxjs/toolkit'
import {
  getWebhooksByFeatureId as getWebhooksByFeatureIdAction,
  getWebhooksByFeatureIdResponse,
  setTriggerWebhookResponse,
  setWebhookModal,
  setWebhookTriggerErrors,
  setFeatureToTrigger,
  setShowErrorModal,
  triggerWebhook as triggerWebhookAction,
} from 'Plugins/admin/redux/features/WebhookSlice'
import { FETCH } from '../../../../app/audit/UserActionType'
import { updateToast } from 'Redux/features/toastSlice'
import { isFourZeroThreeError, addAdditionalData } from 'Utils/TokenController'
import WebhookApi from 'Plugins/admin/redux/api/WebhookApi'
import { getClient } from 'Redux/api/base'
import { postUserAction } from 'Redux/api/backend-api'
import type { UserActionPayload } from 'Redux/api/backend-api'
import * as JansConfigApi from 'jans_config_api'
import { devLogger } from '@/utils/devLogger'
import { initAudit, redirectToLogout } from 'Redux/sagas/SagaUtils'
import { webhookOutputObject } from 'Plugins/admin/helper/utils'
import {
  getErrorMessage,
  isHttpLikeError,
  type AuditRecord,
  type HttpErrorLike,
  type SagaErrorShape,
} from './types/common'
import type { RootState } from 'Redux/sagas/types'
import type { JsonValue } from 'Routes/Apps/Gluu/types/common'
import type {
  WebhookEntry,
  TriggerWebhookSagaPayload,
  WebhookTriggerResponseItem,
  WebhooksByFeatureIdApiResponse,
  TriggerWebhookApiResponse,
} from './types/webhook'

function* createWebhookApi(): Generator<SelectEffect, WebhookApi, string> {
  const issuer: string = yield select((state: RootState) => state.authReducer.issuer)
  const api = new JansConfigApi.AdminUIWebhooksApi(getClient(JansConfigApi, null, issuer))
  return new WebhookApi(api)
}

export function* getWebhooksByFeatureId({
  payload,
}: PayloadAction<string>): SagaIterator<WebhooksByFeatureIdApiResponse | void> {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit as AuditRecord, FETCH, `/webhook/${payload}`, {})
    const webhookApi: WebhookApi = yield* createWebhookApi()
    const data: WebhooksByFeatureIdApiResponse = yield call(
      webhookApi.getWebhooksByFeatureId,
      payload,
    )
    const webhooks: WebhookEntry[] = data?.body ?? []
    const hasEnabledWebhooks = webhooks.some((item) => item.jansEnabled)
    if (webhooks.length && hasEnabledWebhooks) {
      yield put(setWebhookModal(true))
    }
    yield put(getWebhooksByFeatureIdResponse(webhooks))
    yield call(postUserAction, audit as UserActionPayload)
    return data
  } catch (e) {
    const errMsg = getErrorMessage(e as Error | SagaErrorShape)
    yield put(updateToast(true, 'error', errMsg))
    yield put(getWebhooksByFeatureIdResponse([]))
    if (isHttpLikeError(e as Error | SagaErrorShape) && isFourZeroThreeError(e as HttpErrorLike)) {
      yield* redirectToLogout()
    }
  }
}

export function* triggerWebhook({
  payload,
}: PayloadAction<TriggerWebhookSagaPayload>): SagaIterator<TriggerWebhookApiResponse | void> {
  const audit = yield* initAudit()
  let featureToTrigger = ''
  try {
    const webhookApi: WebhookApi = yield* createWebhookApi()
    featureToTrigger = yield select((state: RootState) => state.webhookReducer.featureToTrigger)
    let featureWebhooks: WebhookEntry[] = yield select(
      (state: RootState) => state.webhookReducer.featureWebhooks,
    )

    const featureFromPayload = payload?.feature
    if (featureFromPayload) {
      featureToTrigger = featureFromPayload
      yield put(setFeatureToTrigger(featureFromPayload))

      if (!featureWebhooks?.length) {
        const data: WebhooksByFeatureIdApiResponse = yield call(
          webhookApi.getWebhooksByFeatureId,
          featureFromPayload,
        )
        featureWebhooks = data?.body ?? []
        yield put(getWebhooksByFeatureIdResponse(featureWebhooks))
      }
    }

    const enabledFeatureWebhooks = (featureWebhooks ?? []).filter(
      (item: WebhookEntry) => item.jansEnabled,
    )

    if (!enabledFeatureWebhooks.length || !featureToTrigger) {
      yield put(setFeatureToTrigger(''))
      yield put(setTriggerWebhookResponse(''))
      yield put(setWebhookTriggerErrors([]))
      yield put(setShowErrorModal(false))
      return
    }

    const outputObject = webhookOutputObject(
      enabledFeatureWebhooks as Parameters<typeof webhookOutputObject>[0],
      payload.createdFeatureValue,
    )
    const data: TriggerWebhookApiResponse = yield call(webhookApi.triggerWebhook, {
      feature: featureToTrigger,
      outputObject,
    })

    const responseItems = data?.body ?? []
    const enrichedResults = responseItems
      .map((body: WebhookTriggerResponseItem) => {
        const matchedOutput = outputObject.find(
          (output) => output.webhookId === body?.responseObject?.inum,
        )
        return matchedOutput ? { ...body, url: matchedOutput.url } : null
      })
      .filter((item): item is WebhookTriggerResponseItem & { url: string } => item !== null)

    addAdditionalData(audit as AuditRecord, FETCH, `/webhook/${featureToTrigger}`, {
      action: { action_data: { results: enrichedResults as JsonValue } },
    })
    yield put(setFeatureToTrigger(''))

    yield put(setShowErrorModal(false))
    yield put(setWebhookModal(false))
    yield put(setTriggerWebhookResponse(''))
    yield put(setWebhookTriggerErrors([]))
    yield put(updateToast(true, 'success', i18n.t('messages.all_webhooks_triggered_successfully')))

    const failedItems = responseItems.filter((item: WebhookTriggerResponseItem) => !item.success)
    if (failedItems.length) {
      const summary = failedItems.map((item: WebhookTriggerResponseItem) => ({
        name: item.responseObject?.webhookName ?? 'unknown',
        id: item.responseObject?.inum ?? 'unknown',
        message: item.responseMessage ?? 'No message',
      }))
      devLogger.warn(`[Webhook] ${failedItems.length} webhook(s) failed:`, summary)
    }
    yield call(postUserAction, audit as UserActionPayload)
    return data
  } catch (e) {
    const errMsg = getErrorMessage(e as Error | SagaErrorShape)
    yield put(updateToast(true, 'error', errMsg))
    yield put(setWebhookModal(true))
    yield put(setTriggerWebhookResponse(errMsg))
    addAdditionalData(audit as AuditRecord, FETCH, `/webhook/${featureToTrigger || 'trigger'}`, {
      action: { action_data: { error: errMsg, success: false } },
    })
    yield call(postUserAction, audit as UserActionPayload)
    if (isHttpLikeError(e as Error | SagaErrorShape) && isFourZeroThreeError(e as HttpErrorLike)) {
      yield* redirectToLogout()
      return
    }
  }
}

export function* watchGetWebhooksByFeatureId(): SagaIterator<void> {
  yield takeLatest(getWebhooksByFeatureIdAction.type, getWebhooksByFeatureId)
}

export function* watchGetTriggerWebhook(): SagaIterator<void> {
  yield takeLatest(triggerWebhookAction.type, triggerWebhook)
}

export default function* rootSaga(): SagaIterator<void> {
  yield all([fork(watchGetWebhooksByFeatureId), fork(watchGetTriggerWebhook)])
}
