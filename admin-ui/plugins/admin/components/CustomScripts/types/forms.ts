import { CustomScriptItem, ModuleProperty, ConfigurationProperty } from './customScript'
import type { CustomScript } from 'JansConfigApi'

export interface CustomScriptFormProps {
  item: CustomScriptItem | CustomScript
  handleSubmit: (data: { customScript: CustomScriptItem }) => void | Promise<void>
  viewOnly?: boolean
}

export interface CustomScriptDetailPageProps {
  row: CustomScriptItem | CustomScript
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
  action_message?: string
}

export type PropertyOptionMap = (
  properties: Array<ModuleProperty | ConfigurationProperty> | undefined,
) => Array<{ key: string; value: string }>
