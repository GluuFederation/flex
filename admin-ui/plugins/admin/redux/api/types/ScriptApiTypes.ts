export interface ScriptApiClient {
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
