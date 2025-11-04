import { CustomScriptItem, ModuleProperty } from '../types/customScript'
import { FormValues } from '../types/forms'
import { filterEmptyObjects } from 'Utils/Util'

export const getModuleProperty = (
  key: string,
  properties?: ModuleProperty[],
): string | undefined => {
  const moduleProps = properties || []
  return moduleProps.find((p) => p.value1 === key)?.value2
}

export const transformToFormValues = (item: CustomScriptItem): FormValues => {
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
  }
}
