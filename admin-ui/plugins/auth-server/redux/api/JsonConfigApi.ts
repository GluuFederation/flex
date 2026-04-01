import { handleResponse } from 'Utils/ApiUtils'
import type { AppConfiguration } from '../../components/AuthServerProperties/types'
import type { JsonPatch } from 'JansConfigApi'

type PropertiesCallback = (error: Error | null, data: AppConfiguration) => void

export interface ConfigurationPropertiesApiShape {
  getProperties(callback: PropertiesCallback): void
  patchProperties(options: JsonPatch[], callback: PropertiesCallback): void
}

export default class JsonConfigApi {
  private readonly api: ConfigurationPropertiesApiShape

  constructor(api: ConfigurationPropertiesApiShape) {
    this.api = api
  }

  fetchJsonConfig = async (): Promise<AppConfiguration> => {
    const result = await new Promise((resolve, reject) => {
      this.api.getProperties((error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
    return result as AppConfiguration
  }

  patchJsonConfig = async (options: JsonPatch[]): Promise<AppConfiguration> => {
    const result = await new Promise((resolve, reject) => {
      this.api.patchProperties(options, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
    return result as AppConfiguration
  }
}
