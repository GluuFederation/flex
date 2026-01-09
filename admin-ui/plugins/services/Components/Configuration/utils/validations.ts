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
        /^(jdbc:[A-Za-z0-9]+(?:[:][A-Za-z0-9]+)*(?:(?::\/\/)|:)?(?:@\/\/)?.*|https?:\/\/.*)/,
        'Invalid connection URI format',
      ),
    )
    .nullable(),
  schemaName: Yup.string()
    .trim()
    .transform((value) => (value === '' ? null : value))
    .min(2, 'Minimum 2 characters required')
    .nullable(),
  passwordEncryptionMethod: Yup.string()
    .trim()
    .transform((value) => (value === '' ? null : value))
    .nullable(),
  serverTimezone: Yup.string()
    .trim()
    .transform((value) => (value === '' ? null : value))
    .nullable(),
  binaryAttributes: Yup.array().of(Yup.string()).nullable(),
  certificateAttributes: Yup.array().of(Yup.string()).nullable(),
  enabled: Yup.boolean().nullable(),
}

export const sqlConfigurationSchema = Yup.object().shape(
  sqlConfigurationSchemaShape,
) as Yup.ObjectSchema<SqlConfiguration>
