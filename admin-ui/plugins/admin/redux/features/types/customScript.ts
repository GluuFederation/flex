// Type definitions for Custom Script functionality

export interface ModuleProperty {
  value1: string
  value2: string
  description?: string
  hide?: boolean
}

export interface ConfigurationProperty {
  key?: string
  value?: string
  value1?: string
  value2?: string
  hide?: boolean
}

export interface ScriptError {
  type?: string
  message?: string
  stackTrace?: string
}

export interface ScriptType {
  value: string
  name: string
}

export interface CustomScriptItem {
  inum?: string
  name?: string
  description?: string
  scriptType?: string
  programmingLanguage?: string
  level?: number
  script?: string
  aliases?: string[]
  moduleProperties?: ModuleProperty[]
  configurationProperties?: ConfigurationProperty[]
  locationPath?: string
  locationType?: string
  enabled?: boolean
  scriptError?: ScriptError
  internal?: boolean
  revision?: number
}

export interface CustomScriptResponse {
  data?: CustomScriptListResponse | null
}

export interface CustomScriptItemResponse {
  data?: CustomScriptItem | null
}

export interface CustomScriptListResponse {
  entries?: CustomScriptItem[]
  totalEntriesCount?: number
  entriesCount?: number
}

export interface CustomScriptState {
  items: CustomScriptItem[]
  item?: CustomScriptItem
  loading: boolean
  view: boolean
  saveOperationFlag: boolean
  errorInSaveOperationFlag: boolean
  totalItems: number
  entriesCount: number
  scriptTypes: ScriptType[]
  hasFetchedScriptTypes: boolean
  loadingScriptTypes: boolean
}
