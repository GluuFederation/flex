export const GRANT_TYPES = [
  { value: 'authorization_code', label: 'Authorization Code' },
  { value: 'implicit', label: 'Implicit' },
  { value: 'refresh_token', label: 'Refresh Token' },
  { value: 'client_credentials', label: 'Client Credentials' },
  { value: 'password', label: 'Resource Owner Password Credentials' },
  { value: 'urn:ietf:params:oauth:grant-type:uma-ticket', label: 'UMA Ticket' },
  { value: 'urn:openid:params:grant-type:ciba', label: 'CIBA' },
  { value: 'urn:ietf:params:oauth:grant-type:device_code', label: 'Device Code' },
  { value: 'urn:ietf:params:oauth:grant-type:token-exchange', label: 'Token Exchange' },
  { value: 'urn:ietf:params:oauth:grant-type:jwt-bearer', label: 'JWT Bearer' },
] as const

export const RESPONSE_TYPES = [
  { value: 'code', label: 'Code' },
  { value: 'token', label: 'Token' },
  { value: 'id_token', label: 'ID Token' },
] as const

export const APPLICATION_TYPES = [
  { value: 'web', label: 'Web' },
  { value: 'native', label: 'Native' },
] as const

export const SUBJECT_TYPES = [
  { value: 'public', label: 'Public' },
  { value: 'pairwise', label: 'Pairwise' },
] as const

export const TOKEN_ENDPOINT_AUTH_METHODS = [
  { value: 'client_secret_basic', label: 'Client Secret Basic' },
  { value: 'client_secret_post', label: 'Client Secret Post' },
  { value: 'client_secret_jwt', label: 'Client Secret JWT' },
  { value: 'private_key_jwt', label: 'Private Key JWT' },
  { value: 'tls_client_auth', label: 'TLS Client Auth' },
  { value: 'self_signed_tls_client_auth', label: 'Self-Signed TLS Client Auth' },
  { value: 'access_token', label: 'Access Token' },
  { value: 'none', label: 'None' },
] as const

export const BACKCHANNEL_TOKEN_DELIVERY_MODES = [
  { value: 'poll', label: 'Poll' },
  { value: 'ping', label: 'Ping' },
  { value: 'push', label: 'Push' },
] as const

export const SIGNING_ALGORITHMS = [
  'none',
  'HS256',
  'HS384',
  'HS512',
  'RS256',
  'RS384',
  'RS512',
  'ES256',
  'ES256K',
  'ES384',
  'ES512',
  'PS256',
  'PS384',
  'PS512',
  'EdDSA',
] as const

export const ENCRYPTION_ALGORITHMS = [
  'RSA1_5',
  'RSA-OAEP',
  'RSA-OAEP-256',
  'A128KW',
  'A192KW',
  'A256KW',
  'dir',
  'ECDH-ES',
  'ECDH-ES+A128KW',
  'ECDH-ES+A192KW',
  'ECDH-ES+A256KW',
  'A128GCMKW',
  'A192GCMKW',
  'A256GCMKW',
  'PBES2-HS256+A128KW',
  'PBES2-HS384+A192KW',
  'PBES2-HS512+A256KW',
] as const

export const ENCRYPTION_ENCODING = [
  'A128CBC-HS256',
  'A192CBC-HS384',
  'A256CBC-HS512',
  'A128GCM',
  'A192GCM',
  'A256GCM',
] as const

export const SCRIPT_TYPES = {
  POST_AUTHN: 'post_authn',
  SPONTANEOUS_SCOPE: 'spontaneous_scope',
  CONSENT_GATHERING: 'consent_gathering',
  INTROSPECTION: 'introspection',
  RESOURCE_OWNER_PASSWORD_CREDENTIALS: 'resource_owner_password_credentials',
  UPDATE_TOKEN: 'update_token',
  CLIENT_REGISTRATION: 'client_registration',
  ID_GENERATOR: 'id_generator',
  CIBA_END_USER_NOTIFICATION: 'ciba_end_user_notification',
  REVOKE_TOKEN: 'revoke_token',
  PERSISTENCE_EXTENSION: 'persistence_extension',
  IDP: 'idp',
  APPLICATION_SESSION: 'application_session',
  END_SESSION: 'end_session',
  DYNAMIC_SCOPE: 'dynamic_scope',
  UMA_RPT_POLICY: 'uma_rpt_policy',
  UMA_RPT_CLAIMS: 'uma_rpt_claims',
  UMA_CLAIMS_GATHERING: 'uma_claims_gathering',
  TOKEN_EXCHANGE: 'token_exchange',
  PAR: 'par',
  LOGOUT_STATUS_JWT: 'logout_status_jwt',
} as const

export const TOKEN_TYPE_OPTIONS = [
  { value: 'true', label: 'JWT' },
  { value: 'false', label: 'Reference' },
] as const

export const BOOLEAN_OPTIONS = [
  { value: 'true', label: 'Yes' },
  { value: 'false', label: 'No' },
] as const

export const CLIENT_ROUTES = {
  LIST: '/auth-server/clients',
  ADD: '/auth-server/client/new',
  EDIT: '/auth-server/client/edit',
  VIEW: '/auth-server/client/view',
} as const

export const DEFAULT_PAGE_SIZE = 10
export const DEFAULT_SCOPE_SEARCH_LIMIT = 100

export const TAB_LABELS = {
  basic: 'titles.basic_info',
  authentication: 'titles.authentication',
  scopes: 'titles.scopes_and_grants',
  advanced: 'titles.advanced',
  uris: 'titles.uris',
} as const

export const SECTIONS = [
  { id: 'basic', labelKey: 'sections.basic_info', icon: 'InfoOutlined' },
  { id: 'authentication', labelKey: 'sections.authentication', icon: 'LockOutlined' },
  { id: 'scopes', labelKey: 'sections.scopes_and_grants', icon: 'VpnKeyOutlined' },
  { id: 'uris', labelKey: 'sections.uris', icon: 'LinkOutlined' },
  { id: 'tokens', labelKey: 'sections.tokens', icon: 'TokenOutlined' },
  { id: 'ciba', labelKey: 'sections.ciba', icon: 'PhoneCallbackOutlined' },
  { id: 'scripts', labelKey: 'sections.scripts', icon: 'CodeOutlined' },
  { id: 'localization', labelKey: 'sections.localization', icon: 'LanguageOutlined' },
  { id: 'system', labelKey: 'sections.system_info', icon: 'SettingsOutlined' },
  { id: 'activeTokens', labelKey: 'sections.active_tokens', icon: 'CreditCardOutlined' },
] as const

export type GrantType = (typeof GRANT_TYPES)[number]['value']
export type ResponseType = (typeof RESPONSE_TYPES)[number]['value']
export type ApplicationType = (typeof APPLICATION_TYPES)[number]['value']
export type SubjectType = (typeof SUBJECT_TYPES)[number]['value']
export type TokenEndpointAuthMethod = (typeof TOKEN_ENDPOINT_AUTH_METHODS)[number]['value']
export type BackchannelTokenDeliveryMode =
  (typeof BACKCHANNEL_TOKEN_DELIVERY_MODES)[number]['value']

export const THEME_DEFAULTS = {
  BORDER_COLOR: '#e0e0e0',
  LIGHT_BG: '#fafafa',
  FONT_COLOR: '#333',
  DARK_FONT: '#000000',
  WHITE: '#fff',
  ICON_OPACITY: 0.7,
} as const

export const SECRET_GENERATION = {
  LENGTH: 32,
  CHARSET: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
} as const

export const DATE_FORMAT = 'YYYY/MM/DD HH:mm:ss' as const
