import type {
  SamlIdentity,
  TrustRelationship,
  SamlConfiguration,
  TrustRelationshipListResponse,
} from './redux'

export interface SamlIdentityProviderResponse {
  entries: SamlIdentity[]
  totalEntriesCount: number
  entriesCount: number
}

export interface SamlIdentityCreateResponse {
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
}

export interface TrustRelationshipResponse {
  body: TrustRelationship[]
}

export interface SamlApiResponse {
  inum?: string
  data?: Record<string, string | number | boolean>
}

export interface JansConfigApiClient {
  getSamlProperties: (callback: (error: Error | null, data?: SamlConfiguration) => void) => void
  putSamlProperties: (
    options: { samlAppConfiguration: SamlConfiguration },
    callback: (error: Error | null, data?: SamlConfiguration) => void,
  ) => void
}

export interface JansIdentityBrokerApiClient {
  getSamlIdentityProvider: (
    options: { inum: string },
    callback: (
      error: Error | null,
      data?: SamlIdentityProviderResponse,
      response?: { body?: SamlIdentityProviderResponse },
    ) => void,
  ) => void
  deleteSamlIdentityProvider: (
    inum: string,
    callback: (error: Error | null, data?: SamlApiResponse) => void,
  ) => void
}

export interface JansTrustRelationshipApiClient {
  getTrustRelationships: (
    callback: (
      error: Error | null,
      data?: TrustRelationshipListResponse,
      response?: { body?: TrustRelationship[] },
    ) => void,
  ) => void
  deleteTrustRelationship: (
    inum: string,
    callback: (error: Error | null, data?: SamlApiResponse) => void,
  ) => void
}
