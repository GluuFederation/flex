import { SmtpConfiguration } from 'JansConfigApi'
import { SmtpFormValues } from '../types'

/**
 * Transforms SmtpConfiguration from API to form values
 */
export const transformToFormValues = (config: SmtpConfiguration | undefined): SmtpFormValues => {
  return {
    host: config?.host || '',
    port: typeof config?.port === 'number' ? config.port : '',
    connect_protection:
      (config?.connect_protection as SmtpFormValues['connect_protection']) || 'None',
    from_name: config?.from_name || '',
    from_email_address: config?.from_email_address || '',
    requires_authentication: config?.requires_authentication || false,
    smtp_authentication_account_username: config?.smtp_authentication_account_username || '',
    smtp_authentication_account_password: config?.smtp_authentication_account_password || '',
    trust_host: config?.trust_host || false,
    key_store: config?.key_store || '',
    key_store_password: config?.key_store_password || '',
    key_store_alias: config?.key_store_alias || '',
    signing_algorithm: config?.signing_algorithm || '',
  }
}

/**
 * Transforms form values to SmtpConfiguration for API submission
 */
export const toSmtpConfiguration = (values: SmtpFormValues): SmtpConfiguration => {
  return {
    host: values.host,
    port: typeof values.port === 'string' ? parseInt(values.port, 10) : values.port,
    connect_protection: values.connect_protection || undefined,
    from_name: values.from_name,
    from_email_address: values.from_email_address,
    requires_authentication: values.requires_authentication,
    smtp_authentication_account_username: values.smtp_authentication_account_username,
    smtp_authentication_account_password: values.smtp_authentication_account_password,
    trust_host: values.trust_host,
    key_store: values.key_store || undefined,
    key_store_password: values.key_store_password || undefined,
    key_store_alias: values.key_store_alias || undefined,
    signing_algorithm: values.signing_algorithm || undefined,
  }
}
