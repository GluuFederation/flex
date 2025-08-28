import { handleTypedResponse } from 'Utils/ApiUtils'
import { SCIMConfig, ScimConfigPatchRequestBody } from '../types/ScimConfig.type'

interface JansScimConfigApi {
  getScimConfig: (callback: (error: Error | null, data: SCIMConfig) => void) => void
  patchScimConfig: (
    options: { requestBody: ScimConfigPatchRequestBody },
    callback: (error: Error | null, data: SCIMConfig) => void,
  ) => void
}

export default class SCIMConfigApi {
  private readonly api: JansScimConfigApi

  constructor(api: JansScimConfigApi) {
    this.api = api
  }

  getScimConfig = (): Promise<SCIMConfig> => {
    return new Promise((resolve, reject) => {
      this.api.getScimConfig((error: Error | null, data: SCIMConfig) => {
        handleTypedResponse<SCIMConfig>(error, reject, resolve, data)
      })
    })
  }

  patchScimConfig = (input: ScimConfigPatchRequestBody): Promise<SCIMConfig> => {
    return new Promise((resolve, reject) => {
      this.api.patchScimConfig({ requestBody: input }, (error: Error | null, data: SCIMConfig) => {
        handleTypedResponse<SCIMConfig>(error, reject, resolve, data)
      })
    })
  }

  updateScimConfig = (input: ScimConfigPatchRequestBody): Promise<SCIMConfig> => {
    return this.patchScimConfig(input)
  }
}
