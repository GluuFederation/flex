import type { OidcDiscoveryConfig } from 'Redux/types'

export type OidcDiscoveryApiClient = {
  getProperties: (callback: (error: Error | null, data: OidcDiscoveryConfig) => void) => void
}
