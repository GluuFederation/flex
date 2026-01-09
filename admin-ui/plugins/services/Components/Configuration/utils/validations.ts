import * as Yup from 'yup'
import type { SqlConfiguration } from '../sqlApiMocks'

// Regex patterns for connection URI validation (supports IPv4, IPv6 bracketed, and hostnames)
const JDBC_URI_PATTERN =
  /^jdbc:[A-Za-z0-9]+(?:[:][A-Za-z0-9]+)*(?::\/\/)?(?:\[[^\]]+\]|[^\s/:]+)(?::\d+)?(?:\/[^\s]*)?$/
const HTTP_URI_PATTERN =
  /^https?:\/\/(?:\[[^\]]+\]|[^\s/:]+)(?::\d+)?(?:\/[^\s]*)?(?:\?[^\s]*)?(?:#[^\s]*)?$/

const sqlConfigurationSchemaShape: Record<keyof SqlConfiguration, Yup.AnySchema> = {
  configId: Yup.string()
    .trim()
    .max(255, 'Configuration name must not exceed 255 characters')
    .transform((value) => (value === '' ? null : value))
    .nullable(),
  userName: Yup.string()
    .trim()
    .max(255, 'Username must not exceed 255 characters')
    .transform((value) => (value === '' ? null : value))
    .nullable(),
  userPassword: Yup.string()
    .trim()
    .max(255, 'Password must not exceed 255 characters')
    .transform((value) => (value === '' ? null : value))
    .nullable(),
  connectionUri: Yup.array()
    .of(
      Yup.string()
        .max(2048, 'Connection URI must not exceed 2048 characters')
        .transform((value) => (value === '' ? null : value))
        .test('valid-uri', 'Invalid JDBC or HTTP(S) connection URI format', (value) => {
          if (!value || typeof value !== 'string') return true
          const trimmed = value.trim()
          if (trimmed === '') return true
          return JDBC_URI_PATTERN.test(trimmed) || HTTP_URI_PATTERN.test(trimmed)
        }),
    )
    .compact((value) => value == null)
    .nullable(),
  schemaName: Yup.string()
    .trim()
    .max(255, 'Schema name must not exceed 255 characters')
    .transform((value) => (value === '' ? null : value))
    .nullable(),
  passwordEncryptionMethod: Yup.string()
    .trim()
    .max(100, 'Password encryption method must not exceed 100 characters')
    .transform((value) => (value === '' ? null : value))
    .nullable(),
  serverTimezone: Yup.string()
    .trim()
    .max(100, 'Server timezone must not exceed 100 characters')
    .transform((value) => (value === '' ? null : value))
    .nullable(),
  binaryAttributes: Yup.array()
    .of(
      Yup.string()
        .max(255, 'Binary attribute must not exceed 255 characters')
        .transform((value) => (value === '' ? null : value)),
    )
    .compact((value) => value == null)
    .nullable(),
  certificateAttributes: Yup.array()
    .of(
      Yup.string()
        .max(255, 'Certificate attribute must not exceed 255 characters')
        .transform((value) => (value === '' ? null : value)),
    )
    .compact((value) => value == null)
    .nullable(),
  enabled: Yup.boolean().nullable(),
}

export const sqlConfigurationSchema = Yup.object<SqlConfiguration>().shape(
  sqlConfigurationSchemaShape,
)
