import { JsonPatch } from 'JansConfigApi'

export type JansLockConfigFormValues = {
  baseDN?: string
  tokenChannels: string
  disableJdkLogger: boolean
  loggingLevel: string
  loggingLayout?: string
  externalLoggerConfiguration?: string
  disableExternalLoggerConfiguration: boolean
  metricReporterEnabled: boolean
  metricReporterInterval: number | string
  metricReporterKeepDataDays: number | string
  cleanServiceInterval: number | string
  metricChannel?: string
  pdpType?: string
  policiesJsonUrisAuthorizationToken?: string
  policiesJsonUris?: string
  policiesZipUrisAuthorizationToken?: string
  policiesZipUris?: string
}

export type PatchOperation = JsonPatch

export type FieldType = 'text' | 'number' | 'select' | 'toggle'

export type FieldConfig = {
  name: keyof JansLockConfigFormValues
  label: string
  type: FieldType
  disabled?: boolean
  selectOptions?: readonly string[] | string[]
  colSize?: number
  placeholder?: string
}

export type JansLockFormClasses = {
  formSection: string
  fieldsGrid: string
  formLabels: string
  formWithInputs: string
  fieldItem: string
  fieldItemFullWidth: string
}

export type JansLockConfigurationProps = {
  lockConfig: Record<string, unknown>
  onUpdate: (patches: PatchOperation[]) => void
  isSubmitting?: boolean
  canWriteLock?: boolean
  classes: JansLockFormClasses
}
