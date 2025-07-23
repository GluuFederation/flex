export interface OidcDiscoveryApiInterface {
  getProperties: (callback: (error: Error | null, data: unknown) => void) => void
}
