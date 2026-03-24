import { handleResponse } from 'Utils/ApiUtils'

type PropertiesCallback = (error: Error | null, data: unknown) => void

export interface ConfigurationPropertiesApiShape {
  getProperties(callback: PropertiesCallback): void
  patchProperties(options: unknown, callback: PropertiesCallback): void
}

export default class JsonConfigApi {
  private readonly api: ConfigurationPropertiesApiShape

  constructor(api: ConfigurationPropertiesApiShape) {
    this.api = api
  }

  fetchJsonConfig = (): Promise<unknown> => {
    return new Promise((resolve, reject) => {
      this.api.getProperties((error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }

  patchJsonConfig = (options: unknown): Promise<unknown> => {
    return new Promise((resolve, reject) => {
      this.api.patchProperties(options, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }
}
