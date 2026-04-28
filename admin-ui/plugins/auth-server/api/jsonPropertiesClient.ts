import type { AppConfiguration } from '../components/AuthServerProperties/types'
import { getProperties, patchProperties } from 'JansConfigApi'
import type { JsonPatch } from 'JansConfigApi'

export const callFetchJsonProperties = async (): Promise<AppConfiguration> => {
  return getProperties() as Promise<AppConfiguration>
}

export const callPatchJsonProperties = async (
  actionData: JsonPatch[],
): Promise<AppConfiguration> => {
  return patchProperties(actionData) as Promise<AppConfiguration>
}
