import type { ClientFormInitialData } from './types'

export const DOC_CATEGORY = 'openid_client'

export const CLIENT_SCOPES_FETCH_LIMIT = 100

export const CLIENT_SCRIPTS_FETCH_LIMIT = 100000

export const INITIAL_NEW_CLIENT: ClientFormInitialData = {
  frontChannelLogoutSessionRequired: false,
  includeClaimsInIdToken: false,
  redirectUris: [],
  claimRedirectUris: [],
  responseTypes: [],
  grantTypes: [],
  postLogoutRedirectUris: [],
  trustedClient: false,
  persistClientAuthorizations: false,
  customAttributes: [],
  customObjectClasses: [],
  rptAsJwt: false,
  accessTokenAsJwt: false,
  backchannelUserCodeParameter: false,
  disabled: false,
  attributes: {
    tlsClientAuthSubjectDn: null,
    runIntrospectionScriptBeforeJwtCreation: false,
    keepClientAuthorizationAfterExpiration: false,
    allowSpontaneousScopes: false,
    backchannelLogoutSessionRequired: false,
    backchannelLogoutUri: [],
    rptClaimsScripts: [],
    consentGatheringScripts: [],
    spontaneousScopeScriptDns: [],
    introspectionScripts: [],
    postAuthnScripts: [],
    additionalAudience: [],
  },
}

export const EM_DASH_PLACEHOLDER = '—'
export const SCOPE_INUM_PARAM = 'scopeInum'
export const CLIENT_VIEW_QUERY_PARAM = 'view'
export const CLIENT_VIEW_QUERY_VALUE = '1'

export const SPONTANEOUS_SCOPE_TYPE = 'spontaneous'

export const TOKEN_DETAIL_DOC_SECTION = 'user'

export const TOKEN_DEFAULT_PAGE_SIZE = 10
export const TOKEN_FILTER_EXPIRATION_DATE = 'expirationDate'
export const TOKEN_FILTER_CREATION_DATE = 'creationDate'
export const TOKEN_DATE_QUERY_FORMAT = 'YYYY-MM-DD'
export const TOKEN_DATE_DISPLAY_FORMAT = 'YYYY/DD/MM HH:mm:ss'
export const TOKEN_CSV_FILENAME = 'client-tokens.csv'
export const TOKEN_CSV_MIME_TYPE = 'text/csv'

export const CLIENT_ACTION_IDS = {
  EDIT: 'editClient',
  VIEW: 'viewClient',
  DELETE: 'deleteClient',
} as const

export const ORG_ATTR_NAME = 'o'
export const ORG_ATTR_NAME_FULL = 'organization'

export const LABELS = {
  CLIENT_ID: 'fields.client_id',
  CLIENT_SECRET: 'fields.client_secret',
  NAME: 'fields.name',
  DESCRIPTION: 'fields.description',
  SUBJECT_TYPE: 'fields.subject_type',
  APPLICATION_TYPE: 'fields.application_type',
  IS_TRUSTED_CLIENT: 'fields.is_trusted_client',
  STATUS: 'fields.status',
  SCOPES: 'fields.scopes',
  GRANT_TYPES: 'fields.grant_types',
  LOGIN_URIS: 'fields.login_uris',
  AUTHENTICATION_METHOD: 'fields.authentication_method',
  RESPONSE_TYPES: 'fields.response_types',
  LOGOUT_REDIRECT_URIS: 'fields.logout_redirect_uris',
} as const

export const DOC_ENTRIES = {
  CLIENT_ID: 'clientId',
  CLIENT_SECRET: 'clientSecret',
  DISPLAY_NAME: 'displayName',
  DESCRIPTION: 'description',
  SUBJECT_TYPE: 'subjectType',
  APPLICATION_TYPE: 'applicationType',
  TRUSTED_CLIENT: 'trustedClient',
  DISABLED: 'disabled',
  SCOPES: 'scopes',
  GRANT_TYPES: 'grantTypes',
  REDIRECT_URIS: 'redirectUris',
  TOKEN_ENDPOINT_AUTH_METHOD: 'tokenEndpointAuthMethod',
  RESPONSE_TYPES: 'responseTypes',
  POST_LOGOUT_REDIRECT_URIS: 'postLogoutRedirectUris',
} as const
