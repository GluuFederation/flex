export interface SamlConfigurationFormValues {
  enabled: boolean
  selectedIdp: string
  ignoreValidation: boolean
  applicationName: string
}

export interface LocationState<T> {
  rowData?: T
  viewOnly?: boolean
}

// Form utility types
export type FormValue = string | number | boolean | File | null | string[]
export type FormValues = Record<string, FormValue>
export type ConfigFields = Record<string, FormValue>
export type RootFields = Record<string, FormValue>

export type NestedRecord = Record<string, string | number | boolean | null | undefined | string[]>
export type CleanableValue =
  | string
  | number
  | boolean
  | File
  | null
  | undefined
  | string[]
  | NestedRecord

// Form value types
export type WebsiteSsoIdentityProviderFormValues = {
  name: string
  nameIDPolicyFormat: string
  singleSignOnServiceUrl: string
  idpEntityId: string
  displayName: string
  description: string
  metaDataFileImportedFlag?: boolean
  metaDataFile?: File | null
  enabled: boolean
  principalAttribute: string
  principalType: string
  singleLogoutServiceUrl?: string
  signingCertificate?: string
  encryptionPublicKey?: string
  idpMetaDataFN?: string
  manualMetadata?: string
  // Additional CURL fields
  spMetaDataLocation?: string
  validateSignature?: string
  firstBrokerLoginFlowAlias?: string
  spMetaDataURL?: string
  trustEmail?: boolean
  linkOnly?: boolean
  creatorId?: string
  dn?: string
  validationLog?: string[]
  idpMetaDataURL?: string
  validationStatus?: string
  providerId?: string
  realm?: string
  postBrokerLoginFlowAlias?: string
  status?: string
  addReadTokenRoleOnCreate?: boolean
  authenticateByDefault?: boolean
  storeToken?: boolean
  idpMetaDataLocation?: string
  baseDn?: string
}

export type FileLikeObject = {
  path?: string
  relativePath?: string
  name?: string
}

export type WebsiteSsoServiceProviderFormValues = {
  enabled: boolean
  name: string
  displayName: string
  description: string
  spMetaDataSourceType: string
  releasedAttributes: string[]
  spLogoutURL: string
  samlMetadata: {
    nameIDPolicyFormat: string
    entityId: string
    singleLogoutServiceUrl: string
    jansAssertionConsumerServiceGetURL: string
    jansAssertionConsumerServicePostURL: string
  }
  metaDataFileImportedFlag?: boolean
  metaDataFile?: File | null
  spMetaDataFN?: string
  // Additional CURL fields
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
