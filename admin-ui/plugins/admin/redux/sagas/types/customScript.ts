export interface CustomScript {
  inum?: string
  name: string
  description?: string
  scriptType: string
  programmingLanguage: string
  level: number
  script?: string
  aliases?: string[]
  moduleProperties?: any[]
  configurationProperties?: any[]
  enabled: boolean
  locationType?: string
  locationPath?: string
  scriptError?: {
    stackTrace: string
  }
  revision?: number
  internal?: boolean
  [key: string]: any
}

export interface ScriptType {
  value: string
  name: string
}
