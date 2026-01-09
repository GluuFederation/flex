import * as Yup from 'yup'
import type { SqlConfiguration } from '../sqlApiMocks'

const sqlConfigurationSchemaShape: Record<keyof SqlConfiguration, Yup.AnySchema> = {
  configId: Yup.string()
    .trim()
    .transform((value) => (value === '' ? null : value))
    .min(2, 'Minimum 2 characters required')
    .required('Configuration name is required')
    .nullable(),
  userName: Yup.string()
    .trim()
    .transform((value) => (value === '' ? null : value))
    .min(2, 'Minimum 2 characters required')
    .required('Username is required')
    .nullable(),
  userPassword: Yup.string()
    .trim()
    .transform((value) => (value === '' ? null : value))
    .min(2, 'Minimum 2 characters required')
    .required('Password is required')
    .nullable(),
  connectionUri: Yup.array()
    .of(Yup.string().url('Invalid connection URI format'))
    .min(1, 'At least one connection URI is required')
    .required('Connection URI is required')
    .nullable(),
  schemaName: Yup.string()
    .trim()
    .transform((value) => (value === '' ? null : value))
    .min(2, 'Minimum 2 characters required')
    .required('Schema name is required')
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

