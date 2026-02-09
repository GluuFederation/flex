import { CedarlingLogType } from '@/cedarling'
import type { AppConfigResponse, KeyValuePair } from 'JansConfigApi'

export type SettingsConfigData = Pick<
  AppConfigResponse,
  'sessionTimeoutInMins' | 'acrValues' | 'cedarlingLogType' | 'additionalParameters'
>

export interface AdditionalParameterFormItem extends KeyValuePair {
  id: string
}

export interface SettingsFormValues {
  sessionTimeoutInMins: number
  acrValues: string
  cedarlingLogType: CedarlingLogType
  additionalParameters: AdditionalParameterFormItem[]
}

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
  sessionTimeoutInMins: configData?.sessionTimeoutInMins ?? 30,
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
