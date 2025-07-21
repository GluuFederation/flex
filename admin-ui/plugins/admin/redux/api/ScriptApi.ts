import { handleResponse } from 'Utils/ApiUtils'
import { ScriptApiClient } from './types/ScriptApiTypes'

export default class ScriptApi {
  private readonly api: ScriptApiClient

  constructor(api: ScriptApiClient) {
    this.api = api
  }

  getAllCustomScript = (options: Record<string, unknown>): Promise<unknown> => {
    return new Promise((resolve, reject) => {
      this.api.getConfigScripts(options, (error: Error | null, data: unknown) => {
        handleResponse(error, reject, resolve, data, null)
      })
    })
  }

  getCustomScriptTypes = (): Promise<unknown> => {
    return new Promise((resolve, reject) => {
      this.api.getCustomScriptType((error: Error | null, data: unknown) => {
        handleResponse(error, reject, resolve, data, null)
      })
    })
  }

  getScriptsByType = (options: Record<string, unknown>): Promise<unknown> => {
    return new Promise((resolve, reject) => {
      this.api.getConfigScriptsByType(
        options['type'] as string,
        options,
        (error: Error | null, data: unknown) => {
          handleResponse(error, reject, resolve, data, null)
        },
      )
    })
  }

  addCustomScript = (data: Record<string, unknown>): Promise<unknown> => {
    return new Promise((resolve, reject) => {
      this.api.postConfigScripts(data, (error: Error | null, data: unknown) => {
        handleResponse(error, reject, resolve, data, null)
      })
    })
  }

  editCustomScript = (data: Record<string, unknown>): Promise<unknown> => {
    return new Promise((resolve, reject) => {
      this.api.putConfigScripts(data, (error: Error | null, data: unknown) => {
        handleResponse(error, reject, resolve, data, null)
      })
    })
  }

  getCustomScript = (inum: string): Promise<unknown> => {
    return new Promise((resolve, reject) => {
      this.api.getConfigScriptsByInum(inum, (error: Error | null, data: unknown) => {
        handleResponse(error, reject, resolve, data, null)
      })
    })
  }

  getCustomScriptByType = (type: string): Promise<unknown> => {
    return new Promise((resolve, reject) => {
      this.api.getConfigScriptsByType(type, {}, (error: Error | null, data: unknown) => {
        handleResponse(error, reject, resolve, data, null)
      })
    })
  }

  deleteCustomScript = (inum: string): Promise<unknown> => {
    return new Promise((resolve, reject) => {
      this.api.deleteConfigScriptsByInum(inum, (error: Error | null, data: unknown) => {
        handleResponse(error, reject, resolve, data, null)
      })
    })
  }
}
