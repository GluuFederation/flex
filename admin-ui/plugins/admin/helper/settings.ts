import { CedarlingLogType } from '@/cedarling'
import type { AppConfigResponse, KeyValuePair } from 'JansConfigApi'
import type { SettingsFormValues } from './types'

export type { SettingsConfigData, AdditionalParameterFormItem, SettingsFormValues } from './types'

export const sanitizeAdditionalParameters = (params?: KeyValuePair[] | null): KeyValuePair[] => {
  if (!params || !params.length) {
    return []
  }

  return params.filter((param) => {
    if (!param) {
      return false
    }
    const key = (param.key || '').trim()
    const value = (param.value || '').trim()
    return Boolean(key) || Boolean(value)
  })
}

export const buildSettingsInitialValues = (
  configData?: AppConfigResponse | null,
): SettingsFormValues => ({
  sessionTimeoutInMins: configData?.sessionTimeoutInMins ?? '',
  acrValues: configData?.acrValues ?? '',
  cedarlingLogType: (configData?.cedarlingLogType as CedarlingLogType) ?? CedarlingLogType.OFF,
  additionalParameters: sanitizeAdditionalParameters(configData?.additionalParameters).map(
    (param) => ({
      id: crypto.randomUUID(),
      key: param.key || '',
      value: param.value || '',
    }),
  ),
})
