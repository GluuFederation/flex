import type { SamlConfigurationFormValues } from './formValues'

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

export interface TrustRelationshipListResponse {
  body: TrustRelationship[]
}

export interface TrustRelationship {
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
}

export interface SamlReduxState {
  configuration: SamlConfiguration
  loading: boolean
  savedForm: boolean
  items: SamlIdentity[]
  loadingSamlIdp: boolean
  loadingSamlIdentity: boolean
  loadingTrustRelationship: boolean
  totalItems: number
  entriesCount: number
  trustRelationships: TrustRelationship[]
}

export interface PutSamlPropertiesPayload {
  action: {
    action_message: string
    action_data: SamlConfigurationFormValues
  }
}

export interface GetSamlIdentityProviderPayload {
  inum?: string
  limit?: number
  pattern?: string
  startIndex?: number
}

export interface CreateSamlIdentityPayload {
  formdata: FormData
  token: string
}

export interface CreateTrustRelationshipPayload {
  formdata: FormData
  token: string
}
