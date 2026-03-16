import { AppConfiguration3, AppConfiguration3ProtectionMode } from 'JansConfigApi'

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

// Re-export AppConfiguration3 for convenience
export type { AppConfiguration3 }
