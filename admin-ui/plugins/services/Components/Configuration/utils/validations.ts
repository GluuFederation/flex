import * as Yup from 'yup'
import type { SqlConfiguration } from '../sqlApiMocks'

/**
 * JDBC URI pattern supporting:
 * - Scheme: jdbc:vendor (e.g., jdbc:mysql, jdbc:postgresql, jdbc:oracle)
 * - Subprotocols: jdbc:vendor:subprotocol (e.g., jdbc:oracle:thin, jdbc:mysql:loadbalance)
 * - Host: IPv4, bracketed IPv6 [::1], or hostname
 * - Optional port: :3306
 * - Optional path: /database
 * Note: Embedded DB paths (e.g., jdbc:h2:~/test) are not supported
 */
const JDBC_URI_PATTERN =
  /^jdbc:[A-Za-z0-9]+(?:[:][A-Za-z0-9]+)*(?::\/\/)?(?:\[[^\]]+\]|[^\s/:]+)(?::\d+)?(?:\/[^\s]*)?$/

/**
 * HTTP(S) URI pattern supporting:
 * - Scheme: http:// or https://
 * - Host: IPv4, bracketed IPv6, or hostname
 * - Optional port: :8080
 * - Optional path: /api/v1
 * - Optional query: ?key=value
 * - Optional fragment: #section
 */
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
        .trim()
        .max(2048, 'Connection URI must not exceed 2048 characters')
        .transform((value) => (value === '' ? null : value))
        .test('valid-uri', 'Invalid JDBC or HTTP(S) connection URI format', (value) => {
          if (!value || typeof value !== 'string') return true
          if (value === '') return true
          return JDBC_URI_PATTERN.test(value) || HTTP_URI_PATTERN.test(value)
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
        .trim()
        .max(255, 'Binary attribute must not exceed 255 characters')
        .transform((value) => (value === '' ? null : value)),
    )
    .compact((value) => value == null)
    .nullable(),
  certificateAttributes: Yup.array()
    .of(
      Yup.string()
        .trim()
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
