export interface ModuleProperty {
  value1: string
  value2: string
  description?: string
  hide?: boolean
  key?: string
  value?: string
}

export interface ConfigurationProperty {
  key?: string
  value?: string
  value1?: string
  value2?: string
  hide?: boolean
}

export interface ScriptError {
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
  internal?: boolean
  revision?: number
  scriptError?: ScriptError
  action_message?: string
  script_path?: string
  location_type?: string
}
