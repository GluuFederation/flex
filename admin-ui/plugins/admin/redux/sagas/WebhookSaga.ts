import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import i18n from 'i18next'
import type { SagaIterator } from 'redux-saga'
import type { PayloadAction } from '@reduxjs/toolkit'
import { getWebhooksByFeatureId } from 'JansConfigApi'
import { customInstance } from '../../../../orval-mutator'
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
import { postUserAction } from 'Redux/api/backend-api'
import type { UserActionPayload } from 'Redux/api/backend-api'
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
import type {
  WebhookEntry,
  TriggerWebhookSagaPayload,
  WebhookTriggerResponseItem,
} from './types/webhook'

export function* getWebhooksByFeatureIdSaga({
  payload,
}: PayloadAction<string>): SagaIterator<void> {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit as AuditRecord, FETCH, `/webhook/${payload}`, {})
    const data = (yield call(getWebhooksByFeatureId, payload)) as WebhookEntry[]
    const webhooks: WebhookEntry[] = data ?? []
    const hasEnabledWebhooks = webhooks.some((item) => item.jansEnabled)
    if (webhooks.length && hasEnabledWebhooks) {
      yield put(setWebhookModal(true))
    }
    yield put(getWebhooksByFeatureIdResponse(webhooks))
    yield call(postUserAction, audit as UserActionPayload)
  } catch (e) {
    const errMsg = getErrorMessage(e as Error | SagaErrorShape)
    yield put(updateToast(true, 'error', errMsg))
    yield put(getWebhooksByFeatureIdResponse([]))
    if (isHttpLikeError(e as Error | SagaErrorShape) && isFourZeroThreeError(e as HttpErrorLike)) {
      yield* redirectToLogout()
    }
  }
}

export function* triggerWebhookSaga({
  payload,
}: PayloadAction<TriggerWebhookSagaPayload>): SagaIterator<void> {
  const audit = yield* initAudit()
  let featureToTrigger = ''
  let hadFailures = false
  try {
    featureToTrigger = yield select((state: RootState) => state.webhookReducer.featureToTrigger)
    let featureWebhooks: WebhookEntry[] = yield select(
      (state: RootState) => state.webhookReducer.featureWebhooks,
    )

    const featureFromPayload = payload?.feature
    if (featureFromPayload) {
      featureToTrigger = featureFromPayload
      yield put(setFeatureToTrigger(featureFromPayload))

      if (!featureWebhooks?.length) {
        const data = (yield call(getWebhooksByFeatureId, featureFromPayload)) as WebhookEntry[]
        featureWebhooks = data ?? []
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

    const responseItems = (yield call(customInstance<WebhookTriggerResponseItem[]>, {
      url: `/admin-ui/webhook/trigger/${encodeURIComponent(featureToTrigger)}`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: outputObject.map(({ webhookId, shortcodeValueMap }) => ({
        webhookId,
        shortcodeValueMap,
      })),
    })) as WebhookTriggerResponseItem[]

    const enrichedResults = (responseItems ?? [])
      .map((body: WebhookTriggerResponseItem) => {
        const matchedOutput = outputObject.find(
          (output) => output.webhookId === body?.responseObject?.inum,
        )
        return matchedOutput ? { ...body, url: matchedOutput.url } : null
      })
      .filter((item): item is WebhookTriggerResponseItem & { url: string } => item !== null)

    addAdditionalData(audit as AuditRecord, FETCH, `/webhook/${featureToTrigger}`, {
      action: { action_data: { results: enrichedResults } },
    })
    yield put(setFeatureToTrigger(''))

    const failedItems = (responseItems ?? []).filter(
      (item: WebhookTriggerResponseItem) => item.success === false,
    )
    yield call(postUserAction, audit as UserActionPayload)
    if (failedItems.length) {
      hadFailures = true
      const firstReason = failedItems[0]?.responseMessage ?? ''
      const failMsg = firstReason
        ? `${i18n.t('messages.webhooks_triggered_with_failures')} ${firstReason}`
        : i18n.t('messages.webhook_trigger_failed')
      yield put(updateToast(true, 'error', failMsg))
      yield put(setWebhookTriggerErrors(failedItems))
      yield put(setShowErrorModal(true))
    } else {
      yield put(
        updateToast(true, 'success', i18n.t('messages.all_webhooks_triggered_successfully')),
      )
    }
  } catch (e) {
    const errMsg = getErrorMessage(e as Error | SagaErrorShape)
    addAdditionalData(audit as AuditRecord, FETCH, `/webhook/${featureToTrigger || 'trigger'}`, {
      action: { action_data: { error: errMsg, success: false } },
    })
    yield call(postUserAction, audit as UserActionPayload)
    if (isHttpLikeError(e as Error | SagaErrorShape) && isFourZeroThreeError(e as HttpErrorLike)) {
      yield* redirectToLogout()
      return
    }
  } finally {
    yield put(setWebhookModal(false))
    yield put(setTriggerWebhookResponse(''))
    if (!hadFailures) {
      yield put(setShowErrorModal(false))
      yield put(setWebhookTriggerErrors([]))
    }
  }
}

export function* watchGetWebhooksByFeatureId(): SagaIterator<void> {
  yield takeLatest(getWebhooksByFeatureIdAction.type, getWebhooksByFeatureIdSaga)
}

export function* watchGetTriggerWebhook(): SagaIterator<void> {
  yield takeLatest(triggerWebhookAction.type, triggerWebhookSaga)
}

export default function* rootSaga(): SagaIterator<void> {
  yield all([fork(watchGetWebhooksByFeatureId), fork(watchGetTriggerWebhook)])
}
