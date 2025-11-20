import { AppConfiguration3, AppConfiguration3ProtectionMode } from 'JansConfigApi'

export interface ScimFormValues {
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
  metricReporterInterval: number | string
  metricReporterKeepDataDays: number | string
  metricReporterEnabled: boolean
  disableJdkLogger: boolean
  disableLoggerTimer: boolean
  useLocalCache: boolean
  skipDefinedPasswordValidation: boolean
  action_message?: string
}

export interface ScimConfigurationProps {
  scimConfiguration: AppConfiguration3 | undefined
  handleSubmit: (formValues: ScimFormValues) => void
  isSubmitting: boolean
  canWriteScim?: boolean
}

// Re-export AppConfiguration3 for convenience
export type { AppConfiguration3 }
