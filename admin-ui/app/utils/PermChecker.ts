export const BASE_URL = 'https://jans.io/oauth'

export const PROPERTIES_READ = BASE_URL + '/jans-auth-server/config/properties.readonly'
export const PROPERTIES_WRITE = BASE_URL + '/jans-auth-server/config/properties.write'
export const PROPERTIES_DELETE = BASE_URL + '/jans-auth-server/config/properties.delete'

export const ATTRIBUTE_READ = BASE_URL + '/config/attributes.readonly'
export const ATTRIBUTE_WRITE = BASE_URL + '/config/attributes.write'
export const ATTRIBUTE_DELETE = BASE_URL + '/config/attributes.delete'

export const CLIENT_READ = BASE_URL + '/config/openid/clients.readonly'
export const CLIENT_WRITE = BASE_URL + '/config/openid/clients.write'
export const CLIENT_DELETE = BASE_URL + '/config/openid/clients.delete'

export const ROLE_READ = 'https://jans.io/oauth/jans-auth-server/config/adminui/user/role.readonly'
export const ROLE_WRITE = 'https://jans.io/oauth/jans-auth-server/config/adminui/user/role.write'
export const ROLE_DELETE = 'https://jans.io/oauth/jans-auth-server/config/adminui/user/role.delete'

export const PERMISSION_READ =
  'https://jans.io/oauth/jans-auth-server/config/adminui/user/permission.readonly'
export const PERMISSION_WRITE =
  'https://jans.io/oauth/jans-auth-server/config/adminui/user/permission.write'
export const PERMISSION_DELETE =
  'https://jans.io/oauth/jans-auth-server/config/adminui/user/permission.delete'

export const MAPPING_READ =
  'https://jans.io/oauth/jans-auth-server/config/adminui/user/rolePermissionMapping.readonly'
export const MAPPING_WRITE =
  'https://jans.io/oauth/jans-auth-server/config/adminui/user/rolePermissionMapping.write'
export const MAPPING_DELETE =
  'https://jans.io/oauth/jans-auth-server/config/adminui/user/rolePermissionMapping.delete'

export const LICENSE_DETAILS_READ = BASE_URL + '/jans-auth-server/config/adminui/license.readonly'

export const LICENSE_DETAILS_WRITE = BASE_URL + '/jans-auth-server/config/adminui/license.write'

export const SCOPE_READ = BASE_URL + '/config/scopes.readonly'
export const SCOPE_WRITE = BASE_URL + '/config/scopes.write'
export const SCOPE_DELETE = BASE_URL + '/config/scopes.delete'

export const SSA_PORTAL = 'https://jans.io/auth/ssa.portal'
export const SSA_ADMIN = 'https://jans.io/auth/ssa.admin'
export const SSA_DELETE = 'https://jans.io/oauth/config/ssa.delete'
export const SSA_DEVELOPER = 'https://jans.io/auth/ssa.developer'

export const REVOKE_SESSION = 'revoke_session'
export const OPENID = 'openid'

export const SCIM_BULK = 'https://jans.io/scim/bulk'

export const SAML_READ = 'https://jans.io/idp/saml.readonly'
export const SAML_WRITE = 'https://jans.io/idp/saml.write'
export const SAML_DELETE = 'https://jans.io/idp/saml.delete'

export const SAML_TR_READ = BASE_URL + '/config/saml.readonly'
export const SAML_TR_WRITE = BASE_URL + '/config/saml.write'

export const SAML_CONFIG_READ = BASE_URL + '/config/saml-config.readonly'
export const SAML_CONFIG_WRITE = BASE_URL + '/config/saml-config.write'

export const SCRIPT_READ = BASE_URL + '/config/scripts.readonly'
export const SCRIPT_WRITE = BASE_URL + '/config/scripts.write'
export const SCRIPT_DELETE = BASE_URL + '/config/scripts.delete'

export const SMTP_READ = BASE_URL + '/config/smtp.readonly'
export const SMTP_WRITE = BASE_URL + '/config/smtp.write'
export const SMTP_DELETE = BASE_URL + '/config/smtp.delete'

export const ACR_READ = BASE_URL + '/config/acrs.readonly'
export const ACR_WRITE = BASE_URL + '/config/acrs.write'
export const ACR_DELETE = BASE_URL + '/config/acrs.delete'

export const LOGGING_READ = BASE_URL + '/config/logging.readonly'
export const LOGGING_WRITE = BASE_URL + '/config/logging.write'
export const LOGGING_DELETE = BASE_URL + '/config/logging.delete'

export const JWKS_READ = BASE_URL + '/config/jwks.readonly'
export const JWKS_WRITE = BASE_URL + '/config/jwks.write'
export const JWKS_DELETE = BASE_URL + '/config/jwks.delete'

export const FIDO_READ = BASE_URL + '/config/fido2.readonly'
export const FIDO_WRITE = BASE_URL + '/config/fido2.write'
export const FIDO_DELETE = BASE_URL + '/config/fido2.delete'

export const JANS_LOCK_READ = BASE_URL + '/lock-config.readonly'
export const JANS_LOCK_WRITE = BASE_URL + '/lock-config.write'

export const CACHE_READ = BASE_URL + '/config/cache.readonly'
export const CACHE_WRITE = BASE_URL + '/config/cache.write'
export const CACHE_DELETE = BASE_URL + '/config/cache.delete'

export const LDAP_READ = BASE_URL + '/config/database/ldap.readonly'
export const LDAP_WRITE = BASE_URL + '/config/database/ldap.write'
export const LDAP_DELETE = BASE_URL + '/config/database/ldap.delete'

export const PERSISTENCE_DETAIL = BASE_URL + '/jans-auth-server/config/properties.readonly'

export const STAT_READ = BASE_URL + '/config/stats.readonly'
export const STAT_JANS_READ = 'jans_stat'

export const USER_READ = BASE_URL + '/config/user.readonly'
export const USER_WRITE = BASE_URL + '/config/user.write'
export const USER_DELETE = BASE_URL + '/config/user.delete'

export const AGAMA_READ = BASE_URL + '/config/agama.readonly'
export const AGAMA_WRITE = BASE_URL + '/config/agama.write'
export const AGAMA_DELETE = BASE_URL + '/config/agama.delete'

export const SESSION_READ = BASE_URL + '/jans-auth-server/session.readonly'
export const SESSION_DELETE = BASE_URL + '/jans-auth-server/session.delete'

export const SCOPE_TAG = 'scopes'
export const ATTRIBUTES_TAG = 'attributes'

export const SCIM_CONFIG_READ = 'https://jans.io/scim/config.readonly'
export const SCIM_CONFIG_WRITE = 'https://jans.io/scim/config.write'

export const MESSAGE_READ = BASE_URL + '/config/message.readonly'
export const MESSAGE_WRITE = BASE_URL + '/config/message.write'
export const WEBHOOK_READ = BASE_URL + '/jans-auth-server/config/adminui/webhook.readonly'
export const WEBHOOK_WRITE = BASE_URL + '/jans-auth-server/config/adminui/webhook.write'
export const WEBHOOK_DELETE = BASE_URL + '/jans-auth-server/config/adminui/webhook.delete'
export const ASSETS_READ = BASE_URL + '/config/jans_asset-read'
export const ASSETS_WRITE = BASE_URL + '/config/jans_asset-write'
export const ASSETS_DELETE = BASE_URL + '/config/jans_asset-delete'

export const API_CONFIG_READ = BASE_URL + '/config/properties.readonly'
export const API_CONFIG_WRITE = BASE_URL + '/config/properties.write'

export interface UserAction {
  action_message: string
  action_data: ActionData | null
  [key: string]: string | number | boolean | ActionData | string[] | number[] | boolean[] | null
}

// Union type for the various payload types used across the codebase
export type ActionData =
  | Record<string, string | number | boolean | string[] | number[] | boolean[] | null> // Object payloads (most common)
  | string // ID strings (inum, jti, configId, etc.)
  | number // Numeric IDs
  | string[] // Array of strings
  | number[] // Array of numbers
  | boolean[] // Array of booleans
  | null

export const buildPayload = (
  userAction: UserAction,
  message: string,
  payload: ActionData,
): void => {
  userAction['action_message'] = message
  userAction['action_data'] = payload
}
