export interface SamlConfiguration {
  enabled: boolean
  selectedIdp: string
  ignoreValidation: boolean
  applicationName: string
}

export interface SamlIdentityConfig {
  singleSignOnServiceUrl?: string
  nameIDPolicyFormat?: string
  idpEntityId?: string
  singleLogoutServiceUrl?: string
  signingCertificate?: string
  encryptionPublicKey?: string
  principalAttribute?: string
  principalType?: string
  validateSignature?: string
  postBindingLogout?: string
  postBindingResponse?: string
  loginHint?: string
  enabledFromMetadata?: string
  postBindingAuthnRequest?: string
  wantAuthnRequestsSigned?: string
  addExtensionsElementWithKeyInfo?: string
  [key: string]: unknown
}

export interface SamlIdentity {
  inum?: string
  name: string
  displayName: string
  description?: string
  enabled: boolean
  providerId?: string
  trustEmail?: boolean
  storeToken?: boolean
  addReadTokenRoleOnCreate?: boolean
  authenticateByDefault?: boolean
  linkOnly?: boolean
  idpMetaDataFN?: string
  dn?: string
  creatorId?: string
  realm?: string
  baseDn?: string
  config?: SamlIdentityConfig
  singleSignOnServiceUrl?: string
  idpEntityId?: string
  nameIDPolicyFormat?: string
  principalAttribute?: string
  principalType?: string
  singleLogoutServiceUrl?: string
  signingCertificate?: string
  encryptionPublicKey?: string
}

export interface WebsiteSsoServiceProvider {
  inum: string
  displayName: string
  name: string
  enabled?: boolean
  description?: string
  spMetaDataSourceType: string
  releasedAttributes?: string[]
  spLogoutURL?: string
  spMetaDataFN?: string
  samlMetadata: {
    entityId: string
    singleLogoutServiceUrl: string
    nameIDPolicyFormat: string
    jansAssertionConsumerServiceGetURL: string
    jansAssertionConsumerServicePostURL: string
  }
  clientAuthenticatorType?: string
  spMetaDataURL?: string
  redirectUris?: string[]
  profileConfigurations?: Record<string, { name: string; signResponses: string }>
  dn?: string
  validationLog?: string[]
  validationStatus?: string
  secret?: string
  status?: string
  owner?: string
  consentRequired?: boolean
  metaLocation?: string
  baseDn?: string
  registrationAccessToken?: string
  baseUrl?: string
  alwaysDisplayInConsole?: boolean
}

export interface GetSamlIdentityProviderPayload {
  inum?: string
  limit?: number
  pattern?: string
  startIndex?: number
}

export interface IdentityProviderPayload {
  spMetaDataLocation: string
  enabled: boolean
  validateSignature: string
  firstBrokerLoginFlowAlias: string
  spMetaDataURL: string
  trustEmail: boolean
  linkOnly: boolean
  creatorId: string
  principalType: string
  dn: string
  validationLog: string[]
  idpMetaDataURL: string
  validationStatus: string
  name: string
  singleLogoutServiceUrl: string
  providerId: string
  displayName: string
  principalAttribute: string
  realm: string
  nameIDPolicyFormat: string
  postBrokerLoginFlowAlias: string
  signingCertificate: string
  status: string
  addReadTokenRoleOnCreate: boolean
  idpEntityId: string
  encryptionPublicKey: string
  authenticateByDefault: boolean
  storeToken: boolean
  idpMetaDataLocation: string
  baseDn: string
  description: string
  inum?: string
  singleSignOnServiceUrl: string
}

export interface WebsiteSsoServiceProviderPayload {
  enabled: boolean
  spMetaDataSourceType: string
  clientAuthenticatorType: string
  spMetaDataURL: string
  redirectUris: string[]
  profileConfigurations: Record<string, { name: string; signResponses: string }>
  spLogoutURL: string
  dn: string
  validationLog: string[]
  validationStatus: string
  name: string
  displayName: string
  secret: string
  status: string
  owner: string
  releasedAttributes: string[]
  consentRequired: boolean
  metaLocation: string
  baseDn: string
  registrationAccessToken: string
  samlMetadata: {
    nameIDPolicyFormat: string
    entityId: string
    singleLogoutServiceUrl: string
    jansAssertionConsumerServiceGetURL: string
    jansAssertionConsumerServicePostURL: string
  }
  description: string
  inum?: string
  baseUrl: string
  alwaysDisplayInConsole: boolean
}
