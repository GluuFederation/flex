import type { FormikProps } from 'formik'
import { SmtpConfiguration, SmtpTest } from 'JansConfigApi'

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
