import { call, select, put } from 'redux-saga/effects'
import type { CallEffect, SelectEffect, PutEffect } from 'redux-saga/effects'
import type { ShortCodeRequest } from 'JansConfigApi'
import type { RootState } from '../types/state'
import { updateToast } from 'Redux/features/toastSlice'
import { WEBHOOK_FEATURE_IDS } from '../../constants/webhookFeatures'
import { getClient } from 'Redux/api/base'

const JansConfigApi = require('jans_config_api')

interface WebhookPayload {
  createdFeatureValue?: Record<string, unknown>
}

function* getApiInstance(): Generator<SelectEffect, any, RootState> {
  const state = yield select((state: RootState) => state)
  const token = state.authReducer.token.access_token
  const issuer = state.authReducer.issuer

  return new JansConfigApi.WebhooksApi(getClient(JansConfigApi, token, issuer))
}

export function* triggerWebhook({
  payload,
  featureId,
}: {
  payload: WebhookPayload
  featureId: string
}): Generator<CallEffect | SelectEffect | PutEffect, void, any> {
  try {
    if (!payload.createdFeatureValue) {
      console.warn('No createdFeatureValue provided for webhook trigger')
      return
    }

    const api = yield* getApiInstance()
    const requestData: ShortCodeRequest = {
      webhookId: payload.createdFeatureValue.inum || payload.createdFeatureValue.dn || '',
      shortcodeValueMap: payload.createdFeatureValue as Record<string, { [key: string]: unknown }>,
    }

    yield call([api, api.triggerWebhook], featureId, requestData)
  } catch (error) {
    const errorMessage =
      (error as Error & { response?: { body?: { responseMessage?: string } } })?.response?.body
        ?.responseMessage ||
      (error as Error)?.message ||
      'Failed to trigger webhook'

    console.error(`Failed to trigger webhook for feature ${featureId}:`, error)

    yield put(updateToast(true, 'error', `Webhook trigger failed: ${errorMessage}`))

    throw error
  }
}

export function* triggerOidcClientWebhook({
  payload,
  isDelete = false,
}: {
  payload: WebhookPayload
  isDelete?: boolean
}): Generator<CallEffect | SelectEffect | PutEffect, void, any> {
  const featureId = isDelete
    ? WEBHOOK_FEATURE_IDS.OIDC_CLIENTS_DELETE
    : WEBHOOK_FEATURE_IDS.OIDC_CLIENTS_WRITE
  yield* triggerWebhook({ payload, featureId })
}

export function* triggerScopeWebhook({
  payload,
  isDelete = false,
}: {
  payload: WebhookPayload
  isDelete?: boolean
}): Generator<CallEffect | SelectEffect | PutEffect, void, any> {
  const featureId = isDelete ? WEBHOOK_FEATURE_IDS.SCOPES_DELETE : WEBHOOK_FEATURE_IDS.SCOPES_WRITE
  yield* triggerWebhook({ payload, featureId })
}

export function* triggerScriptWebhook({
  payload,
  isDelete = false,
}: {
  payload: WebhookPayload
  isDelete?: boolean
}): Generator<CallEffect | SelectEffect | PutEffect, void, any> {
  const featureId = isDelete
    ? WEBHOOK_FEATURE_IDS.CUSTOM_SCRIPT_DELETE
    : WEBHOOK_FEATURE_IDS.CUSTOM_SCRIPT_WRITE
  yield* triggerWebhook({ payload, featureId })
}

export function* triggerSamlWebhook({
  payload,
  featureId,
}: {
  payload: WebhookPayload
  featureId:
    | typeof WEBHOOK_FEATURE_IDS.SAML_CONFIGURATION_WRITE
    | typeof WEBHOOK_FEATURE_IDS.SAML_IDP_WRITE
}): Generator<CallEffect | SelectEffect | PutEffect, void, any> {
  yield* triggerWebhook({ payload, featureId })
}
