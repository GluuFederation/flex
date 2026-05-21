export interface SamlConfiguration {
  enabled: boolean
  selectedIdp: string
  ignoreValidation: boolean
  applicationName: string
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
