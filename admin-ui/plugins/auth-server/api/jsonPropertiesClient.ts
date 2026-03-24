import * as JansConfigApi from 'jans_config_api'
import { getClient } from 'Redux/api/base'
import JsonConfigApi from '../redux/api/JsonConfigApi'
import store from '@/redux/store'
import type { RootState } from '@/redux/types'

export function getJsonPropertiesApi(): JsonConfigApi {
  const state = store.getState() as unknown as RootState
  const issuer = state.authReducer.issuer
  const api = new JansConfigApi.ConfigurationPropertiesApi(getClient(JansConfigApi, null, issuer))
  return new JsonConfigApi(api)
}

export async function callFetchJsonProperties(): Promise<unknown> {
  return getJsonPropertiesApi().fetchJsonConfig()
}

export async function callPatchJsonProperties(actionData: unknown): Promise<unknown> {
  return getJsonPropertiesApi().patchJsonConfig(actionData)
}
