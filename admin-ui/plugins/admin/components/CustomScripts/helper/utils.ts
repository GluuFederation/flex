import type { CustomScript, SimpleCustomProperty } from 'JansConfigApi'
import type { FormValues } from '../types/forms'
import { filterEmptyObjects } from 'Utils/Util'

export const getModuleProperty = (
  key: string,
  properties?: SimpleCustomProperty[],
): string | undefined => {
  const moduleProps = properties || []
  return moduleProps.find((p) => p.value1 === key)?.value2
}

export const transformToFormValues = (item: CustomScript): FormValues => {
  const defaultScriptPathValue = getModuleProperty('location_path', item.moduleProperties)

  return {
    name: item.name || '',
    description: item.description || '',
    scriptType: item.scriptType || '',
    programmingLanguage: item.programmingLanguage || '',
    level: item.level || 0,
    script: item.script,
    aliases: item.aliases || [],
    moduleProperties: filterEmptyObjects(item.moduleProperties),
    configurationProperties: filterEmptyObjects(item.configurationProperties),
    script_path: defaultScriptPathValue || '',
    locationPath: item.locationPath,
    location_type: item.locationType || '',
    enabled: item.enabled,
    action_message: '',
  }
}
