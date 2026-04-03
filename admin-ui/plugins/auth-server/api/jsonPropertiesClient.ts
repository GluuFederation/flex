import * as JansConfigApi from 'jans_config_api'
import { getClient } from 'Redux/api/base'
import JsonConfigApi from '../redux/api/JsonConfigApi'
import { getRootState } from '@/redux/hooks'
import type { AppConfiguration } from '../components/AuthServerProperties/types'
import type { JsonPatch } from 'JansConfigApi'

export const getJsonPropertiesApi = (): JsonConfigApi => {
  const state = getRootState()
  const issuer = state.authReducer.issuer
  const api = new JansConfigApi.ConfigurationPropertiesApi(getClient(JansConfigApi, null, issuer))
  return new JsonConfigApi(api)
}

export const callFetchJsonProperties = async (): Promise<AppConfiguration> => {
  return getJsonPropertiesApi().fetchJsonConfig()
}

export const callPatchJsonProperties = async (
  actionData: JsonPatch[],
): Promise<AppConfiguration> => {
  return getJsonPropertiesApi().patchJsonConfig(actionData)
}
