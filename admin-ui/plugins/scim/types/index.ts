import { AppConfiguration3, AppConfiguration3ProtectionMode } from 'JansConfigApi'
import type { FormikProps } from 'formik'

export type ScimFormValues = {
  baseDN: string
  applicationUrl: string
  baseEndpoint: string
  personCustomObjectClass: string
  oxAuthIssuer: string
  protectionMode: AppConfiguration3ProtectionMode | string
  maxCount: number | string
  bulkMaxOperations: number | string
  bulkMaxPayloadSize: number | string
  userExtensionSchemaURI: string
  loggingLevel: string
  loggingLayout: string
  externalLoggerConfiguration: string
  disableExternalLoggerConfiguration: boolean
  metricReporterInterval: number | string
  metricReporterKeepDataDays: number | string
  metricReporterEnabled: boolean
  disableJdkLogger: boolean
  disableLoggerTimer: boolean
  useLocalCache: boolean
  skipDefinedPasswordValidation: boolean
  action_message?: string
}

export type ScimFormClasses = {
  formSection: string
  fieldsGrid: string
  formLabels: string
  formWithInputs: string
  fieldItem: string
  fieldItemFullWidth: string
}

export type ApiErrorResponse = {
  response?: {
    data?: {
      message?: string
    }
  }
}

export type MutationContext = {
  previousConfig: AppConfiguration3 | undefined
}

export type ScimConfigurationProps = {
  scimConfiguration: AppConfiguration3 | undefined
  handleSubmit: (formValues: ScimFormValues) => void | Promise<AppConfiguration3>
  isSubmitting: boolean
  canWriteScim?: boolean
  classes: ScimFormClasses
}

export type { AppConfiguration3 }

export type FieldType = 'text' | 'number' | 'select' | 'toggle'

export type FieldConfig = {
  name: keyof ScimFormValues
  label: string
  type: FieldType
  disabled?: boolean
  selectOptions?: readonly string[] | string[]
  colSize?: number
}

export type ScimFieldRendererProps = {
  config: FieldConfig
  formik: FormikProps<ScimFormValues>
  fieldItemClass: string
  fieldItemFullWidthClass: string
}
