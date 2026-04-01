import type { Logging } from 'JansConfigApi'

export const mockLoggingConfig: Logging = {
  loggingLevel: 'TRACE',
  loggingLayout: 'text',
  httpLoggingEnabled: true,
  disableJdkLogger: false,
  enabledOAuthAuditLogging: false,
}

export const LOGGING_TEST_PERMISSIONS = [
  'https://jans.io/oauth/config/logging.readonly',
  'https://jans.io/oauth/config/logging.write',
  'https://jans.io/oauth/config/logging.delete',
]

export const AUTH_STATE_FOR_LOGGING = {
  permissions: LOGGING_TEST_PERMISSIONS,
  token: {
    access_token: 'test-token',
  },
  config: {
    clientId: 'test-client-id',
  },
  userinfo: {
    inum: 'test-inum',
    name: 'Test User',
  },
}
