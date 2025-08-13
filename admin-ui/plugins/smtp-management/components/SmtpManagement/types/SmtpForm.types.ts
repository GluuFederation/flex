import { SmtpConfiguration } from '../../../redux/types'

export type ConnectProtection = 'None' | 'StartTls' | 'SslTls' | ''

export interface SmtpFormValues {
  host: string
  port: number | ''
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

export interface SmtpFormProps {
  item: SmtpConfiguration
  handleSubmit: (values: SmtpConfiguration) => void
  allowSmtpKeystoreEdit: boolean
}
