import type { FormikProps } from 'formik'
import type { SmtpConfiguration, SmtpTest } from 'JansConfigApi'
import type { JsonValue } from 'Routes/Apps/Gluu/types/common'

export type ConnectProtection = 'None' | 'StartTls' | 'SslTls'

// Form values for SMTP Configuration
export interface SmtpFormValues {
  host: string
  port: number | string
  connect_protection: ConnectProtection
  from_name: string
  from_email_address: string
  requires_authentication: boolean
  smtp_authentication_account_username: string
  smtp_authentication_account_password: string
  trust_host: boolean
  key_store: string
  key_store_password: string
  key_store_alias: string
  signing_algorithm: string
}

export interface ApiError {
  response?: {
    data?: {
      message?: string
    }
  }
}

export type PatchOp = { op: 'add' | 'remove' | 'replace'; path: string; value?: JsonValue }

// Props for SmtpForm component
export interface SmtpFormProps {
  item: SmtpConfiguration | undefined
  handleSubmit: (data: SmtpConfiguration, userMessage: string) => void
  allowSmtpKeystoreEdit: boolean
  onTestSmtp: (testData: SmtpTest) => void
  formikRef?: React.MutableRefObject<FormikProps<SmtpFormValues> | null>
  readOnly: boolean
  testButtonEnabled: boolean
}
