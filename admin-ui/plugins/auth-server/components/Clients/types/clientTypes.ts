import type {
  Client,
  ClientAttributes,
  ClientGrantTypesItem,
  ClientResponseTypesItem,
  ClientApplicationType,
  ClientSubjectType,
  ClientTokenEndpointAuthMethod,
  ClientBackchannelTokenDeliveryMode,
  ClientBackchannelAuthenticationRequestSigningAlg,
  GetOauthOpenidClientsParams,
  PagedResult,
  Scope,
} from 'JansConfigApi'

export type {
  Client,
  ClientAttributes,
  ClientGrantTypesItem,
  ClientResponseTypesItem,
  ClientApplicationType,
  ClientSubjectType,
  ClientTokenEndpointAuthMethod,
  ClientBackchannelTokenDeliveryMode,
  ClientBackchannelAuthenticationRequestSigningAlg,
  GetOauthOpenidClientsParams,
  PagedResult,
  Scope,
}

export interface ExtendedClient extends Client {
  expirable?: boolean
  authenticationMethod?: string
  allAuthenticationMethods?: string[]
}

export interface ClientScope {
  dn: string
  inum?: string
  id?: string
  displayName?: string
  description?: string
}

export interface ClientScript {
  dn: string
  inum?: string
  name?: string
  scriptType?: string
  enabled?: boolean
}

export interface ClientListOptions extends GetOauthOpenidClientsParams {
  startIndex?: number
}

export interface ModifiedFields {
  [key: string]: unknown
}

export interface ClientTableRow extends Client {
  tableData?: {
    id: number
  }
}

export interface UmaResource {
  dn?: string
  inum?: string
  id?: string
  name?: string
  iconUri?: string
  scopes?: string[]
  scopeExpression?: string
  clients?: string[]
  resources?: string[]
  rev?: string
  creator?: string
  description?: string
  type?: string
  creationDate?: string
  expirationDate?: string
  deletable?: boolean
}

export interface TokenEntry {
  tknCde?: string
  tknTyp?: string
  usrId?: string
  clnId?: string
  creationDate?: string
  expirationDate?: string
  scope?: string
  authzCode?: string
  grtId?: string
  jwtReq?: string
  authMode?: string
  ssnId?: string
  dn?: string
}

export const EMPTY_CLIENT: Partial<ExtendedClient> = {
  dn: undefined,
  inum: undefined,
  clientSecret: undefined,
  clientName: undefined,
  displayName: undefined,
  description: undefined,
  applicationType: 'web',
  subjectType: 'public',
  registrationAccessToken: undefined,
  clientIdIssuedAt: undefined,
  initiateLoginUri: undefined,
  logoUri: undefined,
  clientUri: undefined,
  tosUri: undefined,
  policyUri: undefined,
  jwksUri: undefined,
  jwks: undefined,
  sectorIdentifierUri: undefined,
  softwareStatement: undefined,
  softwareVersion: undefined,
  softwareId: undefined,
  expirationDate: undefined,
  expirable: false,
  idTokenSignedResponseAlg: undefined,
  idTokenEncryptedResponseAlg: undefined,
  idTokenEncryptedResponseEnc: undefined,
  tokenEndpointAuthMethod: 'client_secret_basic',
  tokenEndpointAuthSigningAlg: undefined,
  accessTokenSigningAlg: undefined,
  requestObjectEncryptionAlg: undefined,
  requestObjectSigningAlg: undefined,
  requestObjectEncryptionEnc: undefined,
  userInfoEncryptedResponseAlg: undefined,
  userInfoSignedResponseAlg: undefined,
  userInfoEncryptedResponseEnc: undefined,
  idTokenTokenBindingCnf: undefined,
  backchannelUserCodeParameter: false,
  refreshTokenLifetime: undefined,
  defaultMaxAge: undefined,
  accessTokenLifetime: undefined,
  backchannelTokenDeliveryMode: undefined,
  backchannelClientNotificationEndpoint: undefined,
  backchannelAuthenticationRequestSigningAlg: undefined,
  frontChannelLogoutUri: undefined,
  frontChannelLogoutSessionRequired: false,
  redirectUris: [],
  claimRedirectUris: [],
  authorizedOrigins: [],
  requestUris: [],
  postLogoutRedirectUris: [],
  responseTypes: [],
  grantTypes: [],
  contacts: [],
  defaultAcrValues: [],
  scopes: [],
  claims: [],
  customObjectClasses: ['top'],
  trustedClient: false,
  persistClientAuthorizations: false,
  includeClaimsInIdToken: false,
  rptAsJwt: false,
  accessTokenAsJwt: false,
  disabled: false,
  deletable: true,
  attributes: {
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
    ropcScripts: [],
    updateTokenScriptDns: [],
    additionalAudience: [],
    spontaneousScopes: [],
    jansAuthorizedAcr: [],
    parLifetime: undefined,
    requirePar: false,
    dpopBoundAccessToken: false,
    jansDefaultPromptLogin: false,
    redirectUrisRegex: undefined,
    tlsClientAuthSubjectDn: undefined,
    minimumAcrLevel: undefined,
    minimumAcrLevelAutoresolve: false,
    requirePkce: false,
    jansAuthSignedRespAlg: undefined,
    jansAuthEncRespAlg: undefined,
    jansAuthEncRespEnc: undefined,
    introspectionSignedResponseAlg: undefined,
    introspectionEncryptedResponseAlg: undefined,
    introspectionEncryptedResponseEnc: undefined,
    txTokenLifetime: undefined,
    idTokenLifetime: undefined,
  },
}
