import { SmtpConfiguration } from 'JansConfigApi'
import type { TFunction } from 'i18next'
import type { JsonValue } from 'Routes/Apps/Gluu/types/common'
import type { GluuCommitDialogOperation } from 'Routes/Apps/Gluu/types/GluuCommitDialog'
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

/** Field keys mapped to their translation label keys */
const SMTP_FIELD_LABELS: { key: keyof SmtpFormValues; label: string }[] = [
  { key: 'host', label: 'fields.smtp_host' },
  { key: 'port', label: 'fields.smtp_port' },
  { key: 'connect_protection', label: 'fields.connect_protection' },
  { key: 'from_name', label: 'fields.from_name' },
  { key: 'from_email_address', label: 'fields.from_email_address' },
  { key: 'requires_authentication', label: 'fields.requires_authentication' },
  { key: 'smtp_authentication_account_username', label: 'fields.smtp_user_name' },
  { key: 'smtp_authentication_account_password', label: 'fields.smtp_user_password' },
  { key: 'trust_host', label: 'fields.trust_host' },
  { key: 'key_store', label: 'fields.key_store' },
  { key: 'key_store_password', label: 'fields.key_store_password' },
  { key: 'key_store_alias', label: 'fields.key_store_alias' },
  { key: 'signing_algorithm', label: 'fields.signing_algorithm' },
]

/**
 * Builds a list of changed field operations by comparing initial and current form values.
 */
export const buildSmtpChangedFieldOperations = (
  initial: SmtpFormValues,
  current: SmtpFormValues,
  t: TFunction,
): GluuCommitDialogOperation[] => {
  const operations: GluuCommitDialogOperation[] = []

  for (const { key, label } of SMTP_FIELD_LABELS) {
    const oldVal = initial[key]
    const newVal = current[key]
    if (key === 'smtp_authentication_account_password' || key === 'key_store_password') continue
    if (String(oldVal ?? '') !== String(newVal ?? '')) {
      operations.push({ path: t(label), value: (newVal as JsonValue) ?? null })
    }
  }

  return operations
}
