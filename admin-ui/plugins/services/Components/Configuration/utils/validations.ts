import * as Yup from 'yup'
import type { SqlConfiguration } from '../sqlApiMocks'

// Pre-compiled regex patterns for connection URI validation
// Stricter JDBC pattern: jdbc:driver[:subprotocol]://host[:port][/path]
// Rejects whitespace and requires valid host structure
const JDBC_URI_PATTERN = new RegExp(
  '^jdbc:[A-Za-z0-9]+(?:[:][A-Za-z0-9]+)*(?:://)?[^\\s/:]+(?::\\d+)?(?:/[^\\s]*)?$',
)
// Stricter HTTP(S) pattern: http(s)://host[:port][/path][?query][#fragment]
// Rejects whitespace and requires valid host structure
const HTTP_URI_PATTERN = new RegExp(
  '^https?://[^\\s/:]+(?::\\d+)?(?:/[^\\s]*)?(?:\\?[^\\s]*)?(?:#[^\\s]*)?$',
)

const sqlConfigurationSchemaShape: Record<keyof SqlConfiguration, Yup.AnySchema> = {
  configId: Yup.string()
    .trim()
    .max(255, 'Configuration name must not exceed 255 characters')
    .transform((value) => (value === '' ? null : value))
    .min(2, 'Minimum 2 characters required')
    .nullable(),
  userName: Yup.string()
    .trim()
    .max(255, 'Username must not exceed 255 characters')
    .transform((value) => (value === '' ? null : value))
    .min(2, 'Minimum 2 characters required')
    .nullable(),
  userPassword: Yup.string()
    .trim()
    .max(255, 'Password must not exceed 255 characters')
    .transform((value) => (value === '' ? null : value))
    .min(2, 'Minimum 2 characters required')
    .nullable(),
  connectionUri: Yup.array()
    .of(
      Yup.string()
        .max(2048, 'Connection URI must not exceed 2048 characters')
        .test(
          'valid-uri',
          'Invalid connection URI format. Must be a valid JDBC URI (e.g., jdbc:mysql://host:port/database) or HTTP(S) URL (e.g., https://host:port/path)',
          (value) => {
            if (!value || typeof value !== 'string') {
              return true // Let nullable/required handle empty values
            }
            const trimmed = value.trim()
            if (trimmed === '') {
              return true
            }
            return JDBC_URI_PATTERN.test(trimmed) || HTTP_URI_PATTERN.test(trimmed)
          },
        ),
    )
    .nullable(),
  schemaName: Yup.string()
    .trim()
    .max(255, 'Schema name must not exceed 255 characters')
    .transform((value) => (value === '' ? null : value))
    .min(2, 'Minimum 2 characters required')
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
    .of(Yup.string().max(255, 'Binary attribute must not exceed 255 characters'))
    .nullable(),
  certificateAttributes: Yup.array()
    .of(Yup.string().max(255, 'Certificate attribute must not exceed 255 characters'))
    .nullable(),
  enabled: Yup.boolean().nullable(),
}

export const sqlConfigurationSchema = Yup.object().shape(
  sqlConfigurationSchemaShape,
) as Yup.ObjectSchema<SqlConfiguration>
