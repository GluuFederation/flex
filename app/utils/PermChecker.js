export const BASE_URL = 'https://jans.io/oauth'

export const PROPERTIES_READ = BASE_URL + '/config/properties.readonly'
export const PROPERTIES_WRITE = BASE_URL + '/config/properties.write'
export const PROPERTIES_DELETE = BASE_URL + '/config/properties.delete'

export const ATTRIBUTE_READ = BASE_URL + '/config/attributes.readonly'
export const ATTRIBUTE_WRITE = BASE_URL + '/config/attributes.write'
export const ATTRIBUTE_DELETE = BASE_URL + '/config/attributes.delete'

export const CLIENT_READ = BASE_URL + '/config/openid/clients.readonly'
export const CLIENT_WRITE = BASE_URL + '/config/openid/clients.write'
export const CLIENT_DELETE = BASE_URL + '/config/openid/clients.delete'

export const ROLE_READ = 'https://jans.io/adminui/user/role.read'
export const ROLE_WRITE = 'https://jans.io/adminui/user/role.write'
export const ROLE_DELETE = 'https://jans.io/adminui/user/role.delete'

export const PERMISSION_READ = 'https://jans.io/adminui/user/permission.read'
export const PERMISSION_WRITE = 'https://jans.io/adminui/user/permission.write'
export const PERMISSION_DELETE =
  'https://jans.io/adminui/user/permission.delete'

export const SCOPE_READ = BASE_URL + '/config/scopes.readonly'
export const SCOPE_WRITE = BASE_URL + '/config/scopes.write'
export const SCOPE_DELETE = BASE_URL + '/config/scopes.delete'

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

export const CACHE_READ = BASE_URL + '/config/cache.readonly'
export const CACHE_WRITE = BASE_URL + '/config/cache.write'
export const CACHE_DELETE = BASE_URL + '/config/cache.delete'

export const LDAP_READ = BASE_URL + '/config/database/ldap.readonly'
export const LDAP_WRITE = BASE_URL + '/config/database/ldap.write'
export const LDAP_DELETE = BASE_URL + '/config/database/ldap.delete'

export const COUCHBASE_READ = BASE_URL + '/config/database/couchbase.readonly'
export const COUCHBASE_WRITE = BASE_URL + '/config/database/couchbase.write'
export const COUCHBASE_DELETE = BASE_URL + '/config/database/couchbase.delete'

export const SQL_READ = BASE_URL + '/config/database/sql.readonly'
export const SQL_WRITE = BASE_URL + '/config/database/sql.write'
export const SQL_DELETE = BASE_URL + '/config/database/sql.delete'

export const STAT_READ = BASE_URL + '/config/stats.readonly'
export const STAT_JANS_READ = 'jans_stat'

export const hasPermission = (scopes, scope) => {
  console.log('============1 ' + JSON.stringify(scopes))
  console.log('============2 ' + JSON.stringify(scope))
  if (scopes) {
    return scopes.includes(scope, 0)
  }
  return false
}

export const buildPayload = (userAction, message, payload) => {
  userAction['action_message'] = message
  userAction['action_data'] = payload
}

export const hasAny = (scopes, scope1, scope2, scope3) => {
  if (scopes) {
    return (
      scopes.includes(scope1, 0) ||
      scopes.includes(scope2, 0) ||
      scopes.includes(scope3, 0)
    )
  }
  return false
}

export const hasBoth = (scopes, scope1, scope2) => {
  if (scopes) {
    return scopes.includes(scope1, 0) && scopes.includes(scope2, 0)
  }
  return false
}
