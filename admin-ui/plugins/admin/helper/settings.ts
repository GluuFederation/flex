import { CedarlingLogType } from '@/cedarling'

export interface SettingsAdditionalParameter {
  key?: string | null
  value?: string | null
}

export interface SettingsConfigData {
  sessionTimeoutInMins?: number | null
  acrValues?: string | null
  cedarlingLogType?: CedarlingLogType | null
  additionalParameters?: SettingsAdditionalParameter[] | null
}

export interface SettingsFormValues {
  sessionTimeoutInMins: number
  acrValues: string
  cedarlingLogType: CedarlingLogType
  additionalParameters: SettingsAdditionalParameter[]
}

export const sanitizeAdditionalParameters = (
  params?: SettingsAdditionalParameter[] | null,
): SettingsAdditionalParameter[] => {
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
  configData?: SettingsConfigData | null,
): SettingsFormValues => ({
  sessionTimeoutInMins: configData?.sessionTimeoutInMins ?? 30,
  acrValues: configData?.acrValues ?? '',
  cedarlingLogType: configData?.cedarlingLogType ?? CedarlingLogType.OFF,
  additionalParameters: sanitizeAdditionalParameters(configData?.additionalParameters).map(
    (param) => ({
      key: param.key || '',
      value: param.value || '',
    }),
  ),
})
