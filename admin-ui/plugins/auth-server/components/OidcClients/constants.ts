import type { ClientFormInitialData, ClientScriptField } from './types'
import type { MultiSelectOption } from 'Routes/Apps/Gluu/types/GluuMultiSelectRow.types'
import { createClientFieldSection } from 'Plugins/auth-server/utils'

export const DOC_CATEGORY = 'openid_client'

export const CLIENT_ATTRIBUTES_KEY = 'attributes'
export const SPONTANEOUS_SCOPE_TYPE = 'spontaneous'
export const TOKEN_DETAIL_DOC_SECTION = 'user'

export const EM_DASH_PLACEHOLDER = '—'
export const TWO_DASH_PLACEHOLDER = '--'

export const SCOPE_INUM_PARAM = 'scopeInum'
export const CLIENT_VIEW_QUERY_PARAM = 'view'
export const CLIENT_VIEW_QUERY_VALUE = '1'

export const FETCH_LIMITS = {
  CLIENT_LIST: 100,
  SCOPES: 200,
  SCRIPTS: 200,
} as const

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

export const AUDIENCE_INPUT_ID = 'audience_id'
export const CLAIM_URI_INPUT_ID = 'claim_uri_id'
export const POST_URI_ID = 'post_uri_id'
export const BACKCHANNEL_URI_ID = 'backchannel_uri_id'
export const REQUEST_URI_INPUT_ID = 'request_uri_id'
export const ORIGIN_INPUT_ID = 'origin_uri_id'
export const CONTACT_INPUT_ID = 'contact_uri_id'

export const CLIENT_DYNAMIC_LIST_I18N = {
  REDIRECT_URIS: {
    fieldKey: 'fields.redirect_uris',
    placeholderKey: 'placeholders.redirect_uris',
  },
  ADDITIONAL_AUDIENCE: {
    fieldKey: 'fields.additionalAudience',
  },
  REQUEST_URIS: {
    fieldKey: 'fields.requestUris',
    placeholderKey: 'placeholders.valid_request_uri',
  },
  AUTHORIZED_ACR_VALUES: {
    fieldKey: 'fields.authorizedAcrValues',
  },
  BACKCHANNEL_LOGOUT_URI: {
    fieldKey: 'fields.backchannelLogoutUri',
    placeholderKey: 'placeholders.valid_uri_pattern',
  },
  POST_LOGOUT_REDIRECT_URIS: {
    fieldKey: 'fields.post_logout_redirect_uris',
    placeholderKey: 'placeholders.post_logout_redirect_uris',
  },
  AUTHORIZED_ORIGINS: {
    fieldKey: 'fields.authorizedOrigins',
    placeholderKey: 'placeholders.valid_origin_uri',
  },
  CONTACTS: {
    fieldKey: 'fields.contacts',
    placeholderKey: 'placeholders.email_example',
  },
  CLAIM_REDIRECT_URIS: {
    fieldKey: 'fields.claimRedirectURIs',
    placeholderKey: 'placeholders.valid_claim_uri',
  },
} as const

export const CLIENT_SCRIPT_TYPES = {
  SPONTANEOUS_SCOPE: 'spontaneous_scope',
  UPDATE_TOKEN: 'update_token',
  POST_AUTHN: 'post_authn',
  INTROSPECTION: 'introspection',
  ROPC: 'resource_owner_password_credentials',
  CONSENT_GATHERING: 'consent_gathering',
  PERSON_AUTHENTICATION: 'person_authentication',
  UMA_RPT_CLAIMS: 'uma_rpt_claims',
} as const

export const CLIENT_ADVANCED_MODIFIED_FIELDS = {
  PERSIST_CLIENT_AUTHORIZATIONS: 'Persist Client Authorizations',
  DEFAULT_PROMPT_LOGIN: 'Default Prompt Login',
  ALLOW_SPONTANEOUS_SCOPES: 'Allow Spontaneous Scopes',
  SPONTANEOUS_SCOPES: 'Spontaneous Scopes',
  INITIATE_LOGIN_URI: 'Initiate Login Uri',
  REQUEST_URIS: 'Request Uris',
  DEFAULT_ACR_VALUES: 'Default Acr Values',
  AUTHORIZED_ACR_VALUES: 'Authorized Acr Values',
  TLS_CLIENT_AUTH_SUBJECT_DN: 'TLS Client Auth Subject Dn',
  IS_EXPIRABLE_CLIENT: 'Is Expirable Client',
  EXPIRATION_DATE: 'Expiration Date',
} as const

export const CLIENT_TOKEN_MODIFIED_FIELDS = {
  ACCESS_TOKEN_AS_JWT: 'Access Token as jwt',
  ACCESS_TOKEN_LIFETIME: 'Access token lifetime',
  REFRESH_TOKEN_LIFETIME: 'Refresh token lifetime',
  DEFAULT_MAX_AGE: 'Default max age',
  ID_TOKEN_TOKEN_BINDING_CNF: 'Id token token binding cnf',
  INCLUDE_CLAIMS_IN_ID_TOKEN: 'Include claims in id token',
  RUN_INTROSPECTION_SCRIPT_BEFORE_JWT_CREATION: 'Run introspection script before jwt creation',
  ADDITIONAL_AUDIENCE: 'Additional audience',
} as const

export const CLIENT_LOGOUT_MODIFIED_FIELDS = {
  BACKCHANNEL_LOGOUT_URI: 'Backchannel Logout Uri',
  POST_LOGOUT_REDIRECT_URIS: 'Post Logout Redirect Uris',
  LOGOUT_SESSION_REQUIRED: 'Logout Session Required',
  FRONT_CHANNEL_LOGOUT_SESSION_REQUIRED: 'Front Channel Logout Session Required',
  FRONT_CHANNEL_LOGOUT_URI: 'Front Channel Logout Uri',
} as const

export const CLIENT_BASIC_MODIFIED_FIELDS = {
  SCOPES: 'Scopes',
  REDIRECT_URIS: 'Redirect URIs',
  CLIENT_NAME: 'Client Name',
  CLIENT_SECRET: 'Client Secret',
  DESCRIPTION: 'Description',
  SECTOR_IDENTIFIER_URI: 'Sector Identifier URI',
  APPLICATION_TYPE: 'Application Type',
  SUBJECT_TYPE: 'Subject Type',
  TOKEN_ENDPOINT_AUTH_METHOD: 'Token Endpoint AuthMethod',
  IS_ACTIVE: 'Is Active',
  TRUST_CLIENT: 'Trust Client',
  REDIRECT_URIS_REGEX: 'Redirect URIs Regex',
} as const

export const CLIENT_CIBA_PAR_UMA_MODIFIED_FIELDS = {
  CLAIM_REDIRECT_URIS: 'Claim Redirect URIs',
  TOKEN_DELIVERY_MODE: 'Token Delivery Mode',
  REQUIRE_PAR: 'Require Par',
  RPT_AS_JWT: 'RPT as JWT',
  USER_CODE_PARAMETER: 'User Code Parameter',
  PAR_LIFETIME: 'PAR Lifetime',
  CLIENT_NOTIFICATION_ENDPOINT: 'Client Notification Endpoint',
  RPT_CLAIMS_SCRIPTS: 'RPT Claims Scripts',
} as const

export const CLIENT_SOFTWARE_MODIFIED_FIELDS = {
  CONTACTS: 'Contacts',
  AUTHORIZED_ORIGINS: 'Authorized Origins',
  CLIENT_URI: 'Client Uri',
  POLICY_URI: 'Policy Uri',
  LOGO_URI: 'logo Uri',
  TOS_URI: 'Tos Uri',
  SOFTWARE_ID: 'Software Id',
  SOFTWARE_VERSION: 'Software Version',
  SOFTWARE_STATEMENT: 'Software Statement',
} as const

export const CLIENT_ENCRYPTION_SIGNING_MODIFIED_FIELDS = {
  JWKS_URI: 'JWTs URI',
  JWKS: 'JWTs',
  ID_TOKEN_SIGNED_RESPONSE: 'Id Token Signed Response',
  ID_TOKEN_ENCRYPTED_RESPONSE_ALG: 'Id Token Encrypted Response Alg',
  ID_TOKEN_ENCRYPTED_RESPONSE_ENC: 'Id Token Encrypted Response Enc',
  ACCESS_TOKEN_SIGNING_ALG: 'Access Token Signing Alg',
  USER_INFO_SIGNED_RESPONSE_ALG: 'User Info Signed Response Alg',
  USER_INFO_ENCRYPTED_RESPONSE_ALG: 'User Info Encrypted Response Alg',
  USER_INFO_ENCRYPTED_RESPONSE_ENC: 'User Info Encrypted Response Enc',
  AUTHORIZATION_SIGNED_RESPONSE_ALG: 'Authorization Signed Response Alg',
  AUTHORIZATION_ENCRYPTED_RESPONSE_ALG: 'Authorization Encrypted Response Alg',
  AUTHORIZATION_ENCRYPTED_RESPONSE_ENC: 'Authorization Encrypted Response Enc',
  REQUEST_OBJECT_SIGNING_ALG: 'Request Object Signing Alg',
  REQUEST_OBJECT_ENCRYPTION_ALG: 'Request Object Encryption Alg',
  REQUEST_OBJECT_ENCRYPTION_ENC: 'Request Object Encryption Enc',
  INTROSPECTION_ENCRYPTED_RESPONSE_ALG: 'Introspection Encrypted Response Alg',
  INTROSPECTION_ENCRYPTED_RESPONSE_ENC: 'Introspection Encrypted Response Enc',
} as const

export const ACCESS_TOKEN_TYPE_OPTIONS = [
  { value: 'true', labelKey: 'options.jwt' },
  { value: 'false', labelKey: 'options.reference' },
] as const

export const BOOLEAN_SELECT_OPTIONS = [
  { value: 'true', labelKey: 'options.true' },
  { value: 'false', labelKey: 'options.false' },
] as const

export const RPT_TOKEN_TYPE_OPTIONS = [
  { value: 'true', labelKey: 'options.jwt' },
  { value: 'false', labelKey: 'options.reference' },
] as const

export const CIBA_DELIVERY_MODES = ['poll', 'push', 'ping']
export const APPLICATION_TYPE_OPTIONS = ['web', 'native']
export const SUBJECT_TYPE_OPTIONS = ['pairwise', 'public']

export const GRANT_TYPE_OPTIONS: MultiSelectOption[] = [
  { value: 'authorization_code', label: 'authorization_code' },
  { value: 'implicit', label: 'implicit' },
  { value: 'refresh_token', label: 'refresh_token' },
  { value: 'client_credentials', label: 'client_credentials' },
  { value: 'password', label: 'password' },
  { value: 'urn:ietf:params:oauth:grant-type:uma-ticket', label: 'uma-ticket' },
]

export const RESPONSE_TYPE_OPTIONS: MultiSelectOption[] = [
  { value: 'code', label: 'code' },
  { value: 'token', label: 'token' },
  { value: 'id_token', label: 'id_token' },
]

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

export const WIZARD_STEP_IDS = {
  BASIC: 'Basic',
  TOKENS: 'Tokens',
  LOGOUT: 'Logout',
  SOFTWARE_INFO: 'SoftwareInfo',
  CIBA_PAR_UMA: 'CIBA/PAR/UMA',
  ENCRYPTION_SIGNING: 'Encryption/Signing',
  ADVANCED_CLIENT_PROPERTIES: 'AdvancedClientProperties',
  CLIENT_SCRIPTS: 'ClientScripts',
  CLIENT_ACTIVE_TOKENS: 'ClientActiveTokens',
} as const

export const CLIENT_WIZARD_STEPS = [
  { id: 'Basic', labelKey: 'titles.client_basic', tooltipKey: 'tooltips.step_basic' },
  { id: 'Tokens', labelKey: 'titles.token', tooltipKey: 'tooltips.step_tokens' },
  { id: 'Logout', labelKey: 'titles.log_out', tooltipKey: 'tooltips.step_logout' },
  {
    id: 'SoftwareInfo',
    labelKey: 'titles.software_info',
    tooltipKey: 'tooltips.step_software_info',
  },
  {
    id: 'CIBA/PAR/UMA',
    labelKey: 'titles.CIBA_PAR_UMA',
    tooltipKey: 'tooltips.step_ciba_par_uma',
  },
  {
    id: 'Encryption/Signing',
    labelKey: 'titles.encryption_signing',
    tooltipKey: 'tooltips.step_encryption_signing',
  },
  {
    id: 'AdvancedClientProperties',
    labelKey: 'titles.client_advanced',
    tooltipKey: 'tooltips.step_advanced',
  },
  {
    id: 'ClientScripts',
    labelKey: 'titles.client_scripts',
    tooltipKey: 'tooltips.step_client_scripts',
  },
  {
    id: 'ClientActiveTokens',
    labelKey: 'titles.activeTokens',
    tooltipKey: 'tooltips.step_active_tokens',
  },
]

export const CLIENT_WIZARD_SEQUENCE = CLIENT_WIZARD_STEPS.map((step) => step.id)

export const CLIENT_BASIC_SECTION_GROUPS = [
  createClientFieldSection('titles.client_details', [
    'clientName',
    'clientSecret',
    'description',
    'sectorIdentifierUri',
  ]),
  createClientFieldSection('titles.protocol_settings', [
    'applicationType',
    'subjectType',
    'tokenEndpointAuthMethod',
    'redirectUrisRegex',
    'responseTypes',
    'grantTypes',
  ]),
  createClientFieldSection('titles.access_and_redirects', [
    'isActive',
    'trustedClient',
    'scopes',
    'redirectUris',
  ]),
] as const

export const CLIENT_STEP_TWO_TOKEN_ROWS = [
  ['idTokenTokenBindingCnf', 'accessTokenLifetime'],
  ['refreshTokenLifetime', 'defaultMaxAge'],
  ['runIntrospectionScriptBeforeJwtCreation', 'includeClaimsInIdToken'],
  ['accessTokenAsJwt', 'additionalAudience'],
] as const

export const CLIENT_ADVANCED_SECTION_GROUPS = [
  createClientFieldSection('titles.authorization_controls', [
    'persistClientAuthorizations',
    'defaultPromptLogin',
    'allowSpontaneousScopes',
    'expirable',
    'defaultAcrValues',
  ]),
  createClientFieldSection('titles.login_and_acr', [
    'spontaneousScopes',
    'initiateLoginUri',
    'tlsClientAuthSubjectDn',
    'expirationDate',
  ]),
  createClientFieldSection('titles.scope_controls', ['requestUris', 'authorizedAcrValues']),
] as const

export const CLIENT_SCRIPT_FIELDS: ClientScriptField[] = [
  {
    name: 'attributes.spontaneousScopeScriptDns',
    labelKey: 'fields.spontaneous_scopes',
    scriptType: CLIENT_SCRIPT_TYPES.SPONTANEOUS_SCOPE,
    modifiedField: 'Spontaneous Scope Script Dns',
  },
  {
    name: 'attributes.updateTokenScriptDns',
    labelKey: 'fields.updateTokenScriptDns',
    scriptType: CLIENT_SCRIPT_TYPES.UPDATE_TOKEN,
    modifiedField: 'Update Token Script Dns',
  },
  {
    name: 'attributes.postAuthnScripts',
    labelKey: 'fields.post_authn_scripts',
    scriptType: CLIENT_SCRIPT_TYPES.POST_AUTHN,
    modifiedField: 'Post Authn Script',
  },
  {
    name: 'attributes.introspectionScripts',
    labelKey: 'fields.introspection_scripts',
    scriptType: CLIENT_SCRIPT_TYPES.INTROSPECTION,
    modifiedField: 'Introspection Scripts',
  },
  {
    name: 'attributes.ropcScripts',
    labelKey: 'fields.ropcScripts',
    scriptType: CLIENT_SCRIPT_TYPES.ROPC,
    modifiedField: 'ROPC Scripts',
  },
  {
    name: 'attributes.consentGatheringScripts',
    labelKey: 'fields.consent_gathering_scripts',
    scriptType: CLIENT_SCRIPT_TYPES.CONSENT_GATHERING,
    modifiedField: 'Consent Gathering Scripts',
  },
]

export const UMA_I18N_KEYS = {
  ERROR_UNAUTHORIZED: 'messages.error_uma_resources_unauthorized',
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
