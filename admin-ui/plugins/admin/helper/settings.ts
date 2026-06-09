import { CEDARLING_LOG_TYPE } from '@/cedarling/constants'
import type { AppConfigResponse, KeyValuePair } from 'JansConfigApi'
import type { SettingsFormValues } from './types'

export type { AdditionalParameterFormItem, SettingsFormValues } from './types'

const sanitizeAdditionalParameters = (params?: KeyValuePair[] | null): KeyValuePair[] => {
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
): SettingsFormValues => {
  const cedarlingLogType = configData?.cedarlingLogType
  return {
    sessionTimeoutInMins: configData?.sessionTimeoutInMins ?? '',
    acrValues: configData?.acrValues ?? '',
    cedarlingLogType:
      cedarlingLogType === CEDARLING_LOG_TYPE.OFF || cedarlingLogType === CEDARLING_LOG_TYPE.STD_OUT
        ? cedarlingLogType
        : CEDARLING_LOG_TYPE.OFF,
    additionalParameters: sanitizeAdditionalParameters(configData?.additionalParameters).map(
      (param) => ({
        id: crypto.randomUUID(),
        key: param.key || '',
        value: param.value || '',
      }),
    ),
  }
}
