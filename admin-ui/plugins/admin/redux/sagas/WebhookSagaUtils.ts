import { call, select } from 'redux-saga/effects'
import { JansConfigApi, Configuration, ConfigurationParameters } from 'JansConfigApi'
import type { ShortCodeRequest } from 'JansConfigApi'

function* getApiInstance() {
  const state = yield select((state: any) => state)
  const token = state.authReducer.token.access_token
  const issuer = state.authReducer.issuer

  const config: ConfigurationParameters = {
    basePath: issuer,
    accessToken: token,
  }

  return new JansConfigApi(new Configuration(config))
}

export function* triggerWebhook({
  payload,
  featureId,
}: {
  payload: { createdFeatureValue?: any }
  featureId: string
}): Generator<any, void, any> {
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
    console.error('Failed to trigger webhook:', error)
  }
}

export function* triggerOidcClientWebhook({
  payload,
  isDelete = false,
}: {
  payload: { createdFeatureValue?: any }
  isDelete?: boolean
}): Generator<any, void, any> {
  const featureId = isDelete ? 'oidc_clients_delete' : 'oidc_clients_write'
  yield* triggerWebhook({ payload, featureId })
}

export function* triggerScopeWebhook({
  payload,
  isDelete = false,
}: {
  payload: { createdFeatureValue?: any }
  isDelete?: boolean
}): Generator<any, void, any> {
  const featureId = isDelete ? 'scopes_delete' : 'scopes_write'
  yield* triggerWebhook({ payload, featureId })
}

export function* triggerScriptWebhook({
  payload,
  isDelete = false,
}: {
  payload: { createdFeatureValue?: any }
  isDelete?: boolean
}): Generator<any, void, any> {
  const featureId = isDelete ? 'custom_script_delete' : 'custom_script_write'
  yield* triggerWebhook({ payload, featureId })
}

export function* triggerSamlWebhook({
  payload,
  featureId,
}: {
  payload: { createdFeatureValue?: any }
  featureId: 'saml_configuration_write' | 'saml_idp_write'
}): Generator<any, void, any> {
  yield* triggerWebhook({ payload, featureId })
}
