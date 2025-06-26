import { handleResponse } from 'Utils/ApiUtils'

interface ScriptApiInterface {
  getConfigScripts: (
    options: Record<string, unknown>,
    callback: (error: Error | null, data: unknown) => void,
  ) => void
  getCustomScriptType: (callback: (error: Error | null, data: unknown) => void) => void
  getConfigScriptsByType: (
    type: string,
    options: Record<string, unknown>,
    callback: (error: Error | null, data: unknown) => void,
  ) => void
  postConfigScripts: (
    data: Record<string, unknown>,
    callback: (error: Error | null, data: unknown) => void,
  ) => void
  putConfigScripts: (
    data: Record<string, unknown>,
    callback: (error: Error | null, data: unknown) => void,
  ) => void
  getConfigScriptsByInum: (
    inum: string,
    callback: (error: Error | null, data: unknown) => void,
  ) => void
  deleteConfigScriptsByInum: (
    inum: string,
    callback: (error: Error | null, data: unknown) => void,
  ) => void
}

interface ScriptOptions {
  type?: string
  [key: string]: unknown
}

interface ScriptData {
  [key: string]: unknown
}

export default class ScriptApi {
  private readonly api: ScriptApiInterface

  constructor(api: ScriptApiInterface) {
    this.api = api
  }

  getAllCustomScript = (options: ScriptOptions): Promise<unknown> => {
    return new Promise((resolve, reject) => {
      this.api.getConfigScripts(options, (error: Error | null, data: unknown) => {
        handleResponse(error, reject, resolve, data, undefined)
      })
    })
  }

  getCustomScriptTypes = (): Promise<unknown> => {
    return new Promise((resolve, reject) => {
      this.api.getCustomScriptType((error: Error | null, data: unknown) => {
        handleResponse(error, reject, resolve, data, undefined)
      })
    })
  }

  getScriptsByType = (options: ScriptOptions): Promise<unknown> => {
    return new Promise((resolve, reject) => {
      this.api.getConfigScriptsByType(
        options.type || '',
        options,
        (error: Error | null, data: unknown) => {
          handleResponse(error, reject, resolve, data, undefined)
        },
      )
    })
  }

  addCustomScript = (data: ScriptData): Promise<unknown> => {
    return new Promise((resolve, reject) => {
      this.api.postConfigScripts(data, (error: Error | null, data: unknown) => {
        handleResponse(error, reject, resolve, data, undefined)
      })
    })
  }

  editCustomScript = (data: ScriptData): Promise<unknown> => {
    return new Promise((resolve, reject) => {
      this.api.putConfigScripts(data, (error: Error | null, data: unknown) => {
        handleResponse(error, reject, resolve, data, undefined)
      })
    })
  }

  getCustomScript = (inum: string): Promise<unknown> => {
    return new Promise((resolve, reject) => {
      this.api.getConfigScriptsByInum(inum, (error: Error | null, data: unknown) => {
        handleResponse(error, reject, resolve, data, undefined)
      })
    })
  }

  getCustomScriptByType = (type: string): Promise<unknown> => {
    return new Promise((resolve, reject) => {
      this.api.getConfigScriptsByType(type, {}, (error: Error | null, data: unknown) => {
        handleResponse(error, reject, resolve, data, undefined)
      })
    })
  }

  deleteCustomScript = (inum: string): Promise<unknown> => {
    return new Promise((resolve, reject) => {
      this.api.deleteConfigScriptsByInum(inum, (error: Error | null, data: unknown) => {
        handleResponse(error, reject, resolve, data, undefined)
      })
    })
  }
}
