import type { GluuDetailGridField } from '@/components/GluuDetailGrid'

export type ModuleProperty = {
  value1: string
  value2: string
  description?: string
  hide?: boolean
  key?: string
  value?: string
}

export type ConfigurationProperty = {
  key?: string
  value?: string
  value1?: string
  value2?: string
  hide?: boolean
}

export type ScriptError = {
  stackTrace?: string
}

export type DisplayValue = GluuDetailGridField['value']

export type ScriptType = {
  value: string
  name: string
}

export type CustomScriptItem = {
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
}
