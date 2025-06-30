import { handleResponse } from 'Utils/ApiUtils'

interface Api {
  getProperties: (callback: (error: Error | null, data: unknown) => void) => void
}

export default class OidcDiscoveryApi {
  private readonly api: Api

  constructor(api: Api) {
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
