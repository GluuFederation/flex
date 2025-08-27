import { FormikProps } from 'formik'
import { AppConfiguration1, FormData } from '../../types'

export interface DynamicConfigFormValues {
  issuer: string
  baseEndpoint: string
  cleanServiceInterval: string | number
  cleanServiceBatchChunkSize: string | number
  useLocalCache: boolean
  disableJdkLogger: boolean
  loggingLevel: string
  loggingLayout: string
  externalLoggerConfiguration: string
  metricReporterEnabled: boolean
  metricReporterInterval: string | number
  metricReporterKeepDataDays: string | number
  personCustomObjectClassList: string[]
  hints: string[]
}

export interface DynamicConfigurationProps {
  fidoConfiguration: {
    fido: AppConfiguration1
  }
  handleSubmit: (values: FormData) => void
}

export interface DropdownOption {
  key: string
  value: string
}

export type DynamicConfigFormik = FormikProps<DynamicConfigFormValues>

// Export FormData type for local use
export type { FormData }
