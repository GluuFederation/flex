import type {
  SamlIdentity,
  WebsiteSsoServiceProvider,
  SamlConfiguration,
  WebsiteSsoServiceProviderListResponse,
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
    options: {
      inum?: string
      limit?: number
      pattern?: string
      startIndex?: number
    },
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
      data?: WebsiteSsoServiceProviderListResponse,
      response?: { body?: WebsiteSsoServiceProvider[] },
    ) => void,
  ) => void
  deleteTrustRelationship: (
    inum: string,
    callback: (error: Error | null, data?: SamlApiResponse) => void,
  ) => void
}
