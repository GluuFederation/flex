import { handleResponse } from 'Utils/ApiUtils'
import type { AppConfiguration } from '../../components/AuthServerProperties/types'
import type { JsonPatch } from 'JansConfigApi'

type PropertiesCallback = (error: Error | null, data: AppConfiguration) => void

export interface ConfigurationPropertiesApiShape {
  getProperties(callback: PropertiesCallback): void
  patchProperties(options: { requestBody: JsonPatch[] }, callback: PropertiesCallback): void
}

export default class JsonConfigApi {
  private readonly api: ConfigurationPropertiesApiShape

  constructor(api: ConfigurationPropertiesApiShape) {
    this.api = api
  }

  fetchJsonConfig = (): Promise<AppConfiguration> =>
    new Promise<AppConfiguration>((resolve, reject) => {
      this.api.getProperties((error, data) => {
        handleResponse<AppConfiguration>(error, reject, resolve, data)
      })
    })

  patchJsonConfig = (patches: JsonPatch[]): Promise<AppConfiguration> =>
    new Promise<AppConfiguration>((resolve, reject) => {
      this.api.patchProperties({ requestBody: patches }, (error, data) => {
        handleResponse<AppConfiguration>(error, reject, resolve, data)
      })
    })
}
