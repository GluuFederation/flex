import { CustomScriptItem, ModuleProperty, ConfigurationProperty } from './customScript'
import type { CustomScript } from 'JansConfigApi'

export type CustomScriptFormProps = {
  item: CustomScriptItem | CustomScript
  handleSubmit: (data: { customScript: CustomScriptItem }) => void | Promise<void>
  viewOnly?: boolean
}

export type FormValues = {
  name: string
  description: string
  scriptType: string
  programmingLanguage: string
  level: number
  script?: string
  aliases: string[]
  moduleProperties: ModuleProperty[]
  configurationProperties: ConfigurationProperty[]
  enabled?: boolean | string[]
  action_message?: string
}
