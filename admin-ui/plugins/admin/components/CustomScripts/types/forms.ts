// Form Types

import { CustomScriptItem, ModuleProperty, ConfigurationProperty } from './customScript'

export interface CustomScriptFormProps {
  item: CustomScriptItem
  handleSubmit: (data: { customScript: CustomScriptItem }) => void
  viewOnly?: boolean
}

export interface CustomScriptDetailPageProps {
  row: CustomScriptItem
}

export interface FormValues {
  name: string
  description: string
  scriptType: string
  programmingLanguage: string
  level: number
  script?: string
  aliases: string[]
  moduleProperties: ModuleProperty[]
  configurationProperties: ConfigurationProperty[]
  script_path: string
  locationPath?: string
  location_type: string
  enabled?: boolean | string[]
}

// Utility type for property option mapping
export type PropertyOptionMap = (
  properties: Array<ModuleProperty | ConfigurationProperty> | undefined,
) => Array<{ key: string; value: string }>
