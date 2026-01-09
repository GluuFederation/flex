import * as Yup from 'yup'
import type { SqlConfiguration } from '../sqlApiMocks'

const sqlConfigurationSchemaShape: Record<keyof SqlConfiguration, Yup.AnySchema> = {
  configId: Yup.string()
    .trim()
    .transform((value) => (value === '' ? null : value))
    .min(2, 'Minimum 2 characters required')
    .nullable(),
  userName: Yup.string()
    .trim()
    .transform((value) => (value === '' ? null : value))
    .min(2, 'Minimum 2 characters required')
    .nullable(),
  userPassword: Yup.string()
    .trim()
    .transform((value) => (value === '' ? null : value))
    .min(2, 'Minimum 2 characters required')
    .nullable(),
  connectionUri: Yup.array()
    .of(
      Yup.string().matches(
        /^(jdbc:[a-zA-Z0-9]+:\/\/|https?:\/\/).*/,
        'Invalid connection URI format',
      ),
    )
    .min(1, 'At least one connection URI is required')
    .nullable(),
  schemaName: Yup.string()
    .trim()
    .transform((value) => (value === '' ? null : value))
    .min(2, 'Minimum 2 characters required')
    .nullable(),
  passwordEncryptionMethod: Yup.string()
    .transform((value) => (value === '' ? null : value))
    .nullable(),
  serverTimezone: Yup.string()
    .transform((value) => (value === '' ? null : value))
    .nullable(),
  binaryAttributes: Yup.array().of(Yup.string()).nullable(),
  certificateAttributes: Yup.array().of(Yup.string()).nullable(),
  enabled: Yup.boolean().nullable(),
}

export const sqlConfigurationSchema = Yup.object().shape(
  sqlConfigurationSchemaShape,
) as Yup.ObjectSchema<SqlConfiguration>
