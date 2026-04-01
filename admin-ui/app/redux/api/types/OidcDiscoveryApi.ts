import type { OidcDiscoveryConfig } from 'Redux/types'

export interface OidcDiscoveryApiClient {
  getProperties: (callback: (error: Error | null, data: OidcDiscoveryConfig) => void) => void
}
