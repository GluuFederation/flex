import type { CedarlingLogType } from '@/cedarling/enums/CedarlingLogType'
import type { AppConfigResponse, KeyValuePair } from 'JansConfigApi'

export type SettingsConfigData = Pick<
  AppConfigResponse,
  'sessionTimeoutInMins' | 'acrValues' | 'cedarlingLogType' | 'additionalParameters'
>

export type AdditionalParameterFormItem = KeyValuePair & {
  id: string
}

export type SettingsFormValues = {
  sessionTimeoutInMins: number | ''
  acrValues: string
  cedarlingLogType: CedarlingLogType
  additionalParameters: AdditionalParameterFormItem[]
}
