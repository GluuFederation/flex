import { handleTypedResponse } from 'Utils/ApiUtils'
import type { OidcDiscoveryConfig } from 'Redux/types'
import type { OidcDiscoveryApiClient } from './types/OidcDiscoveryApi'

export default class OidcDiscoveryApi {
  private readonly api: OidcDiscoveryApiClient

  constructor(api: OidcDiscoveryApiClient) {
    this.api = api
  }

  getOidcDiscovery = (): Promise<OidcDiscoveryConfig> => {
    return new Promise((resolve, reject) => {
      this.api.getProperties((error, data) => {
        handleTypedResponse(error, reject, resolve, data, null)
      })
    })
  }
}
