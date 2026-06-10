import type { CedarlingLogType } from '@/cedarling/types'
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
