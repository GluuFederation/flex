export const scopes = [
  {
    dn: "inum=F0C4,ou=scopes,o=jans",
    inum: "F0C4",
    id: "openid",
    description: "Authenticate using OpenID Connect.",
    scopeType: "openid",
    defaultScope: true,
    attributes: { showInConfigurationEndpoint: true },
    umaType: false
  },
  {
    dn: "inum=43F1,ou=scopes,o=jans",
    inum: "43F1",
    id: "profile",
    description: "View your basic profile info.",
    scopeType: "openid",
    claims: [
      "inum=2B29,ou=attributes,o=jans",
      "inum=0C85,ou=attributes,o=jans",
      "inum=B4B0,ou=attributes,o=jans",
      "inum=A0E8,ou=attributes,o=jans",
      "inum=5EC6,ou=attributes,o=jans",
      "inum=B52A,ou=attributes,o=jans",
      "inum=64A0,ou=attributes,o=jans",
      "inum=EC3A,ou=attributes,o=jans",
      "inum=3B47,ou=attributes,o=jans",
      "inum=3692,ou=attributes,o=jans",
      "inum=98FC,ou=attributes,o=jans",
      "inum=A901,ou=attributes,o=jans",
      "inum=36D9,ou=attributes,o=jans",
      "inum=BE64,ou=attributes,o=jans",
      "inum=6493,ou=attributes,o=jans"
    ],
    defaultScope: false,
    attributes: { showInConfigurationEndpoint: true },
    umaType: false
  },
  {
    dn: "inum=8CAD-B06D,ou=scopes,o=jans",
    inum: "8CAD-B06D",
    displayName: "SCIM Access",
    id: "https://gluu.gasmyr.com/jans-auth/restv1/uma/scopes/scim_access",
    scopeType: "uma",
    umaAuthorizationPolicies: ["inum=2DAF-F9A5,ou=scripts,o=jans"],
    attributes: { showInConfigurationEndpoint: true },
    umaType: true
  },
  {
    dn: "inum=C4F5,ou=scopes,o=jans",
    inum: "C4F5",
    id: "permission",
    description: "View your user permission and roles.",
    scopeType: "dynamic",
    defaultScope: true,
    dynamicScopeScripts: ["inum=CB5B-3211,ou=scripts,o=jans"],
    attributes: { showInConfigurationEndpoint: true },
    umaType: false
  },
  {
    dn: "inum=CACA-50EF,ou=scopes,o=jans",
    inum: "inum=CACA-50EF",
    displayName:
      "Config API scope https://jans.io/oauth/config/openid/clients.readonly",
    id: "https://jans.io/oauth/config/openid/clients.readonly",
    description: "View clients related information",
    scopeType: "uma",
    defaultScope: true,
    attributes: { showInConfigurationEndpoint: true },
    umaType: true
  },
  {
    dn: "inum=CACA-4746,ou=scopes,o=jans",
    inum: "inum=CACA-4746",
    displayName:
      "Config API scope https://jans.io/oauth/config/openid/sectoridentifiers.readonly",
    id: "https://jans.io/oauth/config/openid/sectoridentifiers.readonly",
    description: "View sector related information",
    scopeType: "uma",
    defaultScope: true,
    attributes: { showInConfigurationEndpoint: true },
    umaType: true
  },
  {
    dn: "inum=CACA-1E18,ou=scopes,o=jans",
    inum: "inum=CACA-1E18",
    displayName:
      "Config API scope https://jans.io/oauth/jans-auth-server/config/properties.readonly",
    id: "https://jans.io/oauth/jans-auth-server/config/properties.readonly",
    description: "View Auth Server properties related information",
    scopeType: "uma",
    defaultScope: true,
    attributes: { showInConfigurationEndpoint: true },
    umaType: true
  },
  {
    dn: "inum=CACA-E60E,ou=scopes,o=jans",
    inum: "inum=CACA-E60E",
    displayName: "Config API scope https://jans.io/oauth/config/fido2.write",
    id: "https://jans.io/oauth/config/fido2.write",
    description: "View and manage FIDO2 related information",
    scopeType: "uma",
    defaultScope: true,
    attributes: { showInConfigurationEndpoint: true },
    umaType: true
  },
  {
    dn: "inum=CACA-3B08,ou=scopes,o=jans",
    inum: "inum=CACA-3B08",
    displayName: "Config API scope https://jans.io/oauth/config/acrs.readonly",
    id: "https://jans.io/oauth/config/acrs.readonly",
    description: "View ACRS related information",
    scopeType: "uma",
    defaultScope: true,
    attributes: { showInConfigurationEndpoint: true },
    umaType: true
  },
  {
    dn: "inum=CACA-38ED,ou=scopes,o=jans",
    inum: "inum=CACA-38ED",
    displayName:
      "Config API scope https://jans.io/oauth/config/scopes.readonly",
    id: "https://jans.io/oauth/config/scopes.readonly",
    description: "View scope related information",
    scopeType: "uma",
    defaultScope: true,
    attributes: { showInConfigurationEndpoint: true },
    umaType: true
  },
  {
    dn: "inum=CACA-CEA3,ou=scopes,o=jans",
    inum: "inum=CACA-CEA3",
    displayName: "Config API scope https://jans.io/oauth/config/jwks.write",
    id: "https://jans.io/oauth/config/jwks.write",
    description: "View and manage JWKS related information",
    scopeType: "uma",
    defaultScope: true,
    attributes: { showInConfigurationEndpoint: true },
    umaType: true
  },
  {
    dn: "inum=CACA-FA19,ou=scopes,o=jans",
    inum: "inum=CACA-FA19",
    displayName: "Config API scope https://jans.io/oauth/config/cache.write",
    id: "https://jans.io/oauth/config/cache.write",
    description: "View and manage cache related information",
    scopeType: "uma",
    defaultScope: true,
    attributes: { showInConfigurationEndpoint: true },
    umaType: true
  },
  {
    dn: "inum=CACA-9FAD,ou=scopes,o=jans",
    inum: "inum=CACA-9FAD",
    displayName:
      "Config API scope https://jans.io/oauth/config/database/couchbase.readonly",
    id: "https://jans.io/oauth/config/database/couchbase.readonly",
    description: "View Couchbase database information",
    scopeType: "uma",
    defaultScope: true,
    attributes: { showInConfigurationEndpoint: true },
    umaType: true
  },
  {
    dn: "inum=CACA-9A9B,ou=scopes,o=jans",
    inum: "inum=CACA-9A9B",
    displayName: "Config API scope https://jans.io/oauth/config/cache.readonly",
    id: "https://jans.io/oauth/config/cache.readonly",
    description: "View cache related information",
    scopeType: "uma",
    defaultScope: true,
    attributes: { showInConfigurationEndpoint: true },
    umaType: true
  },
  {
    dn: "inum=CACA-4AC0,ou=scopes,o=jans",
    inum: "inum=CACA-4AC0",
    displayName:
      "Config API scope https://jans.io/oauth/config/database/ldap.write",
    id: "https://jans.io/oauth/config/database/ldap.write",
    description: "View and manage LDAP database related information",
    scopeType: "uma",
    defaultScope: true,
    attributes: { showInConfigurationEndpoint: true },
    umaType: true
  },
  {
    dn: "inum=6D99,ou=scopes,o=jans",
    inum: "6D99",
    displayName: "UMA Protection",
    id: "uma_protection",
    description: "Obtain UMA PAT.",
    scopeType: "openid",
    defaultScope: true,
    attributes: { showInConfigurationEndpoint: true },
    umaType: false
  },
  {
    dn: "inum=CACA-A80D,ou=scopes,o=jans",
    inum: "inum=CACA-A80D",
    displayName:
      "Config API scope https://jans.io/oauth/config/attributes.readonly",
    id: "https://jans.io/oauth/config/attributes.readonly",
    description: "View attribute related information",
    scopeType: "uma",
    defaultScope: true,
    attributes: { showInConfigurationEndpoint: true },
    umaType: true
  },
  {
    dn: "inum=D491,ou=scopes,o=jans",
    inum: "D491",
    id: "phone",
    description: "View your phone number.",
    scopeType: "openid",
    claims: [
      "inum=B17A,ou=attributes,o=jans",
      "inum=0C18,ou=attributes,o=jans"
    ],
    defaultScope: false,
    attributes: { showInConfigurationEndpoint: true },
    umaType: false
  },
  {
    dn: "inum=CACA-396C,ou=scopes,o=jans",
    inum: "inum=CACA-396C",
    displayName: "Config API scope https://jans.io/oauth/config/scopes.write",
    id: "https://jans.io/oauth/config/scopes.write",
    description: "View and manage scope related information",
    scopeType: "uma",
    defaultScope: true,
    attributes: { showInConfigurationEndpoint: true },
    umaType: true
  },
  {
    dn: "inum=C17A,ou=scopes,o=jans",
    inum: "C17A",
    id: "address",
    description: "View your address.",
    scopeType: "openid",
    claims: [
      "inum=27DB,ou=attributes,o=jans",
      "inum=2A3D,ou=attributes,o=jans",
      "inum=6609,ou=attributes,o=jans",
      "inum=6EEB,ou=attributes,o=jans",
      "inum=BCE8,ou=attributes,o=jans",
      "inum=D90B,ou=attributes,o=jans",
      "inum=E6B8,ou=attributes,o=jans",
      "inum=E999,ou=attributes,o=jans"
    ],
    defaultScope: false,
    groupClaims: true,
    attributes: { showInConfigurationEndpoint: true },
    oxAuthGroupClaims: true,
    umaType: false
  },
  {
    dn: "inum=CACA-2A20,ou=scopes,o=jans",
    inum: "inum=CACA-2A20",
    displayName:
      "Config API scope https://jans.io/oauth/config/openid/sectoridentifiers.write",
    id: "https://jans.io/oauth/config/openid/sectoridentifiers.write",
    description: "View and manage sector related information",
    scopeType: "uma",
    defaultScope: true,
    attributes: { showInConfigurationEndpoint: true },
    umaType: true
  },
  {
    dn: "inum=CACA-7228,ou=scopes,o=jans",
    inum: "inum=CACA-7228",
    displayName:
      "Config API scope https://jans.io/oauth/config/attributes.write",
    id: "https://jans.io/oauth/config/attributes.write",
    description: "View and manage attribute related information",
    scopeType: "uma",
    defaultScope: true,
    attributes: { showInConfigurationEndpoint: true },
    umaType: true
  },
  {
    dn: "inum=CACA-F7BA,ou=scopes,o=jans",
    inum: "inum=CACA-F7BA",
    displayName: "Config API scope https://jans.io/oauth/config/smtp.write",
    id: "https://jans.io/oauth/config/smtp.write",
    description: "View and manage SMTP related information",
    scopeType: "uma",
    defaultScope: true,
    attributes: { showInConfigurationEndpoint: true },
    umaType: true
  },
  {
    dn: "inum=8A01,ou=scopes,o=jans",
    inum: "8A01",
    id: "mobile_phone",
    description: "View your mobile phone number.",
    scopeType: "openid",
    claims: ["inum=6DA6,ou=attributes,o=jans"],
    defaultScope: false,
    attributes: { showInConfigurationEndpoint: true },
    umaType: false
  },
  {
    dn: "inum=CACA-6DF6,ou=scopes,o=jans",
    inum: "inum=CACA-6DF6",
    displayName:
      "Config API scope https://jans.io/oauth/config/scripts.readonly",
    id: "https://jans.io/oauth/config/scripts.readonly",
    description: "View cache scripts information",
    scopeType: "uma",
    defaultScope: true,
    attributes: { showInConfigurationEndpoint: true },
    umaType: true
  },
  {
    dn: "inum=7D90,ou=scopes,o=jans",
    inum: "7D90",
    displayName: "revoke_session",
    id: "revoke_session",
    description:
      "revoke_session scope which is required to be able call /revoke_session endpoint",
    scopeType: "openid",
    defaultScope: false,
    attributes: { showInConfigurationEndpoint: true },
    umaType: false
  },
  {
    dn: "inum=CACA-55B8,ou=scopes,o=jans",
    inum: "inum=CACA-55B8",
    displayName:
      "Config API scope https://jans.io/oauth/config/openid/clients.write",
    id: "https://jans.io/oauth/config/openid/clients.write",
    description: "View and manage clients related information",
    scopeType: "uma",
    defaultScope: true,
    attributes: { showInConfigurationEndpoint: true },
    umaType: true
  },
  {
    dn: "inum=10B2,ou=scopes,o=jans",
    inum: "10B2",
    id: "user_name",
    description: "View your local username in the Janssen Server.",
    scopeType: "openid",
    claims: ["inum=42E0,ou=attributes,o=jans"],
    defaultScope: false,
    attributes: { showInConfigurationEndpoint: true },
    umaType: false
  },
  {
    dn: "inum=764C,ou=scopes,o=jans",
    inum: "764C",
    id: "email",
    description: "View your email address.",
    scopeType: "openid",
    claims: [
      "inum=8F88,ou=attributes,o=jans",
      "inum=CAE3,ou=attributes,o=jans"
    ],
    defaultScope: false,
    attributes: { showInConfigurationEndpoint: true },
    umaType: false
  },
  {
    dn: "inum=CACA-3479,ou=scopes,o=jans",
    inum: "inum=CACA-3479",
    displayName:
      "Config API scope https://jans.io/oauth/config/database/ldap.readonly",
    id: "https://jans.io/oauth/config/database/ldap.readonly",
    description: "View LDAP database related information",
    scopeType: "uma",
    defaultScope: true,
    attributes: { showInConfigurationEndpoint: true },
    umaType: true
  },
  {
    dn: "inum=341A,ou=scopes,o=jans",
    inum: "341A",
    id: "clientinfo",
    description: "View the client info.",
    scopeType: "openid",
    claims: [
      "inum=2B29,ou=attributes,o=jans",
      "inum=29DA,ou=attributes,o=jans"
    ],
    defaultScope: false,
    attributes: { showInConfigurationEndpoint: true },
    umaType: false
  },
  {
    dn: "inum=CACA-0D5D,ou=scopes,o=jans",
    inum: "inum=CACA-0D5D",
    displayName: "Config API scope https://jans.io/oauth/config/logging.write",
    id: "https://jans.io/oauth/config/logging.write",
    description: "View and manage logging related information",
    scopeType: "uma",
    defaultScope: true,
    attributes: { showInConfigurationEndpoint: true },
    umaType: true
  },
  {
    dn: "inum=CACA-334C,ou=scopes,o=jans",
    inum: "inum=CACA-334C",
    displayName:
      "Config API scope https://jans.io/oauth/config/logging.readonly",
    id: "https://jans.io/oauth/config/logging.readonly",
    description: "View logging related information",
    scopeType: "uma",
    defaultScope: true,
    attributes: { showInConfigurationEndpoint: true },
    umaType: true
  },
  {
    dn: "inum=CACA-42DB,ou=scopes,o=jans",
    inum: "inum=CACA-42DB",
    displayName: "Config API scope https://jans.io/oauth/config/scripts.write",
    id: "https://jans.io/oauth/config/scripts.write",
    description: "View and manage scripts related information",
    scopeType: "uma",
    defaultScope: true,
    attributes: { showInConfigurationEndpoint: true },
    umaType: true
  },
  {
    dn: "inum=CACA-E30D,ou=scopes,o=jans",
    inum: "inum=CACA-E30D",
    displayName:
      "Config API scope https://jans.io/oauth/jans-auth-server/config/properties.write",
    id: "https://jans.io/oauth/jans-auth-server/config/properties.write",
    description: "View and manage Auth Server properties related information",
    scopeType: "uma",
    defaultScope: true,
    attributes: { showInConfigurationEndpoint: true },
    umaType: true
  },
  {
    dn: "inum=CACA-D583,ou=scopes,o=jans",
    inum: "inum=CACA-D583",
    displayName:
      "Config API scope https://jans.io/oauth/config/uma/resources.write",
    id: "https://jans.io/oauth/config/uma/resources.write",
    description: "View and manage UMA Resource related information",
    scopeType: "uma",
    defaultScope: true,
    attributes: { showInConfigurationEndpoint: true },
    umaType: true
  },
  {
    dn: "inum=6D90,ou=scopes,o=jans",
    inum: "6D90",
    displayName: "oxd",
    id: "oxd",
    description: "oxd scope which is required to call oxd API",
    scopeType: "openid",
    defaultScope: true,
    attributes: { showInConfigurationEndpoint: true },
    umaType: false
  },
  {
    dn: "inum=CACA-7905,ou=scopes,o=jans",
    inum: "inum=CACA-7905",
    displayName: "Config API scope https://jans.io/oauth/config/acrs.write",
    id: "https://jans.io/oauth/config/acrs.write",
    description: "View and manage ACRS related information",
    scopeType: "uma",
    defaultScope: true,
    attributes: { showInConfigurationEndpoint: true },
    umaType: true
  },
  {
    dn: "inum=CACA-8454,ou=scopes,o=jans",
    inum: "inum=CACA-8454",
    displayName: "Config API scope https://jans.io/oauth/config/fido2.readonly",
    id: "https://jans.io/oauth/config/fido2.readonly",
    description: "View FIDO2 related information",
    scopeType: "uma",
    defaultScope: true,
    attributes: { showInConfigurationEndpoint: true },
    umaType: true
  },
  {
    dn: "inum=CACA-4B33,ou=scopes,o=jans",
    inum: "inum=CACA-4B33",
    displayName:
      "Config API scope https://jans.io/oauth/config/database/couchbase.write",
    id: "https://jans.io/oauth/config/database/couchbase.write",
    description: "View and manage Couchbase database related information",
    scopeType: "uma",
    defaultScope: true,
    attributes: { showInConfigurationEndpoint: true },
    umaType: true
  },
  {
    dn: "inum=CACA-98A9,ou=scopes,o=jans",
    inum: "inum=CACA-98A9",
    displayName: "Config API scope https://jans.io/oauth/config/smtp.readonly",
    id: "https://jans.io/oauth/config/smtp.readonly",
    description: "View SMTP related information",
    scopeType: "uma",
    defaultScope: true,
    attributes: { showInConfigurationEndpoint: true },
    umaType: true
  },
  {
    dn: "inum=CACA-0C3E,ou=scopes,o=jans",
    inum: "inum=CACA-0C3E",
    displayName:
      "Config API scope https://jans.io/oauth/config/uma/resources.readonly",
    id: "https://jans.io/oauth/config/uma/resources.readonly",
    description: "View UMA Resource related information",
    scopeType: "uma",
    defaultScope: true,
    attributes: { showInConfigurationEndpoint: true },
    umaType: true
  },
  {
    dn: "inum=CACA-5A0A,ou=scopes,o=jans",
    inum: "inum=CACA-5A0A",
    displayName: "Config API scope https://jans.io/oauth/config/jwks.readonly",
    id: "https://jans.io/oauth/config/jwks.readonly",
    description: "View JWKS related information",
    scopeType: "uma",
    defaultScope: true,
    attributes: { showInConfigurationEndpoint: true },
    umaType: true
  },
  {
    dn: "inum=C4F6,ou=scopes,o=jans",
    inum: "C4F6",
    id: "offline_access",
    description:
      "This scope value requests that an OAuth 2.0 Refresh Token be issued.",
    scopeType: "openid",
    defaultScope: true,
    attributes: { showInConfigurationEndpoint: true },
    umaType: false
  }
];
