import { CustomScriptItem, ModuleProperty, ConfigurationProperty } from '../types/customScript'
import { FormValues } from '../types/forms'
import { filterEmptyObjects } from 'Utils/Util'
import type { CustomScript, SimpleCustomProperty } from 'JansConfigApi'

export const getModuleProperty = (
  key: string,
  properties?: ModuleProperty[] | SimpleCustomProperty[],
): string | undefined => {
  if (!properties) return undefined
  const moduleProps = properties as Array<{ value1?: string; value2?: string }>
  return moduleProps.find((p) => p.value1 === key)?.value2
}

export const transformToFormValues = (
  item: CustomScriptItem | CustomScript | Record<string, never>,
): FormValues => {
  return {
    name: item.name || '',
    description: item.description || '',
    scriptType: item.scriptType || '',
    programmingLanguage: item.programmingLanguage || 'python',
    level: item.level ?? 1,
    script: item.script || '',
    aliases: item.aliases || [],
    moduleProperties: (filterEmptyObjects(item.moduleProperties) || []) as ModuleProperty[],
    configurationProperties: (filterEmptyObjects(item.configurationProperties) ||
      []) as ConfigurationProperty[],
    script_path: '',
    locationPath: undefined,
    location_type: 'db',
    enabled: item.enabled !== undefined ? item.enabled : true,
    action_message: '',
  }
}
