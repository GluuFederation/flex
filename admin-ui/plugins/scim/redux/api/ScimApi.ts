import { handleResponse } from 'Utils/ApiUtils'

interface ScimApiClient {
  getScimConfig: (callback: (error: Error | null, data: unknown) => void) => void
  patchScimConfig: (
    options: { requestBody: unknown },
    callback: (error: Error | null, data: unknown) => void,
  ) => void
}

export default class ScimApi {
  private readonly api: ScimApiClient

  constructor(api: ScimApiClient) {
    this.api = api
  }

  // Get SCIM Config
  getScimConfig = (): Promise<unknown> => {
    return new Promise((resolve, reject) => {
      this.api.getScimConfig((error: Error | null, data: unknown) => {
        handleResponse(error, reject, resolve, data, null)
      })
    })
  }

  // update SCIM Config
  updateScimConfig = (input: unknown): Promise<unknown> => {
    return new Promise((resolve, reject) => {
      this.api.patchScimConfig({ requestBody: input }, (error: Error | null, data: unknown) => {
        handleResponse(error, reject, resolve, data, null)
      })
    })
  }
}
