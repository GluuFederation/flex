import type { GetConfigScriptsParams } from 'JansConfigApi'

export const SCOPE_TYPES = {
  OAUTH: 'oauth',
  OPENID: 'openid',
  DYNAMIC: 'dynamic',
  UMA: 'uma',
  SPONTANEOUS: 'spontaneous',
} as const

export const CONFIG_SCRIPTS_PARAMS: GetConfigScriptsParams = { limit: 200 }

export const GRANT_TYPES = {
  AUTHORIZATION_CODE: 'authorization_code',
  IMPLICIT: 'implicit',
  REFRESH_TOKEN: 'refresh_token',
  CLIENT_CREDENTIALS: 'client_credentials',
  PASSWORD: 'password',
  UMA_TICKET: 'urn:ietf:params:oauth:grant-type:uma-ticket',
} as const

export const RESPONSE_TYPES = {
  CODE: 'code',
  TOKEN: 'token',
  ID_TOKEN: 'id_token',
} as const
