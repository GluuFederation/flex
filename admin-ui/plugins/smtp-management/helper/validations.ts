import * as Yup from 'yup'
import type { TFunction } from 'i18next'

export const getSmtpValidationSchema = (t: TFunction) =>
  Yup.object({
    host: Yup.string().required(t('messages.smtp_host_required')),
    port: Yup.number()
      .required(t('messages.smtp_port_required'))
      .min(1, t('messages.smtp_port_range'))
      .max(65535, t('messages.smtp_port_range'))
      .integer(t('messages.smtp_port_integer')),
    connect_protection: Yup.string()
      .min(2, t('messages.smtp_connect_protection_required'))
      .required(t('messages.smtp_connect_protection_required')),
    from_name: Yup.string().required(t('messages.smtp_from_name_required')),
    from_email_address: Yup.string()
      .email(t('messages.smtp_email_invalid'))
      .required(t('messages.smtp_from_email_required')),
    requires_authentication: Yup.boolean(),
    smtp_authentication_account_username: Yup.string().when(
      'requires_authentication',
      (values, schema) =>
        values[0] ? schema.required(t('messages.smtp_username_required')) : schema.nullable(),
    ),
    smtp_authentication_account_password: Yup.string().when(
      'requires_authentication',
      (values, schema) =>
        values[0] ? schema.required(t('messages.smtp_password_required')) : schema.nullable(),
    ),
  })
