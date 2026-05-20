import type { CedarlingLogType } from '@/cedarling/enums/CedarlingLogType'
import type { KeyValuePair } from 'JansConfigApi'

export type AdditionalParameterFormItem = KeyValuePair & {
  id: string
}

export type SettingsFormValues = {
  sessionTimeoutInMins: number | ''
  acrValues: string
  cedarlingLogType: CedarlingLogType
  additionalParameters: AdditionalParameterFormItem[]
}
