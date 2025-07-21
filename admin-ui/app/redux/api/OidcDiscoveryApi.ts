import { handleResponse } from 'Utils/ApiUtils'
import { OidcDiscoveryApiInterface } from './types/oidc'

export default class OidcDiscoveryApi {
  private readonly api: OidcDiscoveryApiInterface

  constructor(api: OidcDiscoveryApiInterface) {
    this.api = api
  }

  // Get OIDC Discovery
  getOidcDiscovery = (): Promise<unknown> => {
    return new Promise((resolve, reject) => {
      this.api.getProperties((error, data) => {
        handleResponse(error, reject, resolve, data, null)
      })
    })
  }
}
