import * as Yup from 'yup'
import type { TFunction } from 'i18next'
import type { AuthNItem } from '../../types'
import { AUTH_METHOD_NAMES } from '../../constants'

export const getAuthNValidationSchema = (
  item: AuthNItem | null,
  t: TFunction,
): Yup.AnyObjectSchema => {
  const required = (label: string) => t('validation_messages.field_required', { field: t(label) })
  const numeric = (label: string) =>
    t('validation_messages.field_must_be_number', { field: t(label) })
  const integer = (label: string) =>
    t('validation_messages.field_must_be_integer', { field: t(label) })
  const minValue = (label: string, min: number) =>
    t('validation_messages.field_min_value', { field: t(label), min })
  const minItems = (label: string) => t('validation_messages.field_min_items', { field: t(label) })
  const isBuiltIn = item?.name === AUTH_METHOD_NAMES.SIMPLE_PASSWORD
  const isLdap = item?.name === AUTH_METHOD_NAMES.DEFAULT_LDAP
  const isScript = !!item?.isCustomScript

  const baseSchema: Record<string, Yup.AnySchema> = {
    acr: Yup.string().required(required('fields.acr')),
    level: Yup.number()
      .typeError(numeric('fields.level'))
      .required(required('fields.level'))
      .integer(integer('fields.level'))
      .min(-1, minValue('fields.level', -1)),
    defaultAuthNMethod: Yup.mixed<boolean | string>().required(
      required('fields.default_authn_method'),
    ),
  }

  if (isBuiltIn) {
    baseSchema.samlACR = Yup.string().optional().nullable()
    baseSchema.description = Yup.string().optional().nullable()
    baseSchema.primaryKey = Yup.string().optional().nullable()
    baseSchema.passwordAttribute = Yup.string().optional().nullable()
    baseSchema.hashAlgorithm = Yup.string().optional().nullable()
  }

  if (isScript) {
    baseSchema.samlACR = Yup.string().optional().nullable()
    baseSchema.description = Yup.string().optional().nullable()
    baseSchema.level = Yup.number()
      .typeError(numeric('fields.level'))
      .required(required('fields.level'))
      .integer(integer('fields.level'))
      .min(0, minValue('fields.level', 0))
  }

  if (isLdap) {
    baseSchema.bindDN = Yup.string().required(required('fields.bind_dn'))
    baseSchema.maxConnections = Yup.number()
      .typeError(numeric('fields.max_connections'))
      .required(required('fields.max_connections'))
      .integer(integer('fields.max_connections'))
      .min(1, minValue('fields.max_connections', 1))
    baseSchema.remotePrimaryKey = Yup.string().optional().nullable()
    baseSchema.localPrimaryKey = Yup.string().optional().nullable()
    baseSchema.servers = Yup.array()
      .of(Yup.string().required(required('fields.remote_ldap_server_post')))
      .min(1, minItems('fields.remote_ldap_server_post'))
      .required(required('fields.remote_ldap_server_post'))
    baseSchema.baseDNs = Yup.array()
      .of(Yup.string().required(required('fields.base_dn')))
      .min(1, minItems('fields.base_dn'))
      .required(required('fields.base_dn'))
    baseSchema.bindPassword = Yup.string().optional().nullable()
    baseSchema.useSSL = Yup.boolean().optional().nullable()
    baseSchema.enabled = Yup.boolean().optional().nullable()
    baseSchema.level = Yup.number()
      .typeError(numeric('fields.level'))
      .required(required('fields.level'))
      .integer(integer('fields.level'))
      .min(0, minValue('fields.level', 0))
  }

  return Yup.object(baseSchema)
}
