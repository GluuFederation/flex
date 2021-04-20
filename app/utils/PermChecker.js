export const ATTRIBUTE_READ = '/config/attributes.readonly'
export const ATTRIBUTE_WRITE = '/config/attributes.write'
export const ATTRIBUTE_DELETE = '/config/attributes.delete'

export const CLIENT_READ = '/config/openid/clients.readonly'
export const CLIENT_WRITE = '/config/openid/clients.write'
export const CLIENT_DELETE = '/config/openid/clients.delete'

export const SCOPE_READ = '/config/scopes.readonly'
export const SCOPE_WRITE = '/config/scopes.write'
export const SCOPE_DELETE = '/config/scopes.delete'

export const SCRIPT_READ = '/config/scripts.readonly'
export const SCRIPT_WRITE = '/config/scripts.write'
export const SCRIPT_DELETE = '/config/scripts.delete'

export const SMTP_READ = '/config/smtp.readonly'
export const SMTP_WRITE = '/config/smtp.write'
export const SMTP_DELETE = '/config/smtp.delete'

export const ACR_READ = '/config/acrs.readonly'
export const ACR_WRITE = '/config/acrs.write'
export const ACR_DELETE = '/config/acrs.delete'

export const LOGGING_READ = '/config/logging.readonly'
export const LOGGING_WRITE = '/config/logging.write'
export const LOGGING_DELETE = '/config/logging.delete'

export const JWKS_READ = '/config/jwks.readonly'
export const JWKS_WRITE = '/config/jwks.write'
export const JWKS_DELETE = '/config/jwks.delete'

export const FIDO_READ = '/config/fido2.readonly'
export const FIDO_WRITE = '/config/fido2.write'
export const FIDO_DELETE = '/config/fido2.delete'

export const CACHE_READ = '/config/cache.readonly'
export const CACHE_WRITE = '/config/cache.write'
export const CACHE_DELETE = '/config/cache.delete'

export const LDAP_READ = '/config/database/ldap.readonly'
export const LDAP_WRITE = '/config/database/ldap.write'
export const LDAP_DELETE = '/config/database/ldap.delete'

export const COUCHBASE_READ = '/config/database/couchbase.readonly'
export const COUCHBASE_WRITE = '/config/database/couchbase.write'
export const COUCHBASE_DELETE = '/config/database/couchbase.delete'

const BASE_URL = 'https://jans.io/oauth'

export const hasPermission = (scopes, scope) => {
  const fullScope = BASE_URL + scope
  if (scopes) {
    return scopes.includes(fullScope, 0)
  }
  return false
}

export const hasAny = (scopes, scope1, scope2, scope3) => {
  const fullScope1 = BASE_URL + scope1
  const fullScope2 = BASE_URL + scope2
  const fullScope3 = BASE_URL + scope3
  if (scopes) {
    return (
      scopes.includes(fullScope1, 0) ||
      scopes.includes(fullScope2, 0) ||
      scopes.includes(fullScope3, 0)
    )
  }
  return false
}
