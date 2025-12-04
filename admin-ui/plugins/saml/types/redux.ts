import type { SamlConfigurationFormValues } from './formValues'

export interface SamlConfiguration {
  enabled: boolean
  selectedIdp: string
  ignoreValidation: boolean
  applicationName: string
}

export interface SamlIdentity {
  inum: string
  name: string
  displayName: string
  description: string
  enabled: boolean
  singleSignOnServiceUrl: string
  idpEntityId: string
  nameIDPolicyFormat: string
  principalAttribute: string
  principalType: string
  singleLogoutServiceUrl?: string
  signingCertificate?: string
  encryptionPublicKey?: string
  idpMetaDataFN?: string
}

export interface SamlIdentityListResponse {
  entries: SamlIdentity[]
  totalEntriesCount: number
  entriesCount: number
}

export interface SamlIdentityProviderResponse {
  entries: SamlIdentity[]
  totalEntriesCount: number
  entriesCount: number
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

export interface UpdateSamlIdentityPayload {
  formdata: FormData
  token: string
  inum: string
}

export interface DeleteSamlIdentityPayload {
  inum: string
}

export interface CreateTrustRelationshipPayload {
  formdata: FormData
  token: string
}

export interface UpdateTrustRelationshipPayload {
  formdata: FormData
  token: string
  inum: string
}

export interface DeleteTrustRelationshipPayload {
  inum: string
}
