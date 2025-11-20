import type {
  CustomScript,
  SimpleCustomProperty,
  SimpleExtendedCustomProperty,
} from '../types/domain'
import type { ScriptFormValues } from '../types/form'
import { filterEmptyObjects } from 'Utils/Util'
import { MODULE_PROPERTY_KEYS } from '../constants'

/**
 * Get a module property value by key
 * @param key - Property key to search for
 * @param properties - Array of module properties
 * @returns Property value if found, undefined otherwise
 */
export function getModuleProperty(
  key: string,
  properties?: SimpleCustomProperty[],
): string | undefined {
  if (!properties || properties.length === 0) {
    return undefined
  }
  return properties.find((p) => p.value1 === key)?.value2
}

/**
 * Get a configuration property value by key
 * @param key - Property key to search for
 * @param properties - Array of configuration properties
 * @returns Property value if found, undefined otherwise
 */
export function getConfigurationProperty(
  key: string,
  properties?: SimpleExtendedCustomProperty[],
): string | undefined {
  if (!properties || properties.length === 0) {
    return undefined
  }
  return properties.find((p) => p.value1 === key)?.value2
}

/**
 * Transform API CustomScript model to form values
 * @param script - CustomScript from API
 * @returns Form values for Formik
 */
export function transformToFormValues(script: CustomScript): ScriptFormValues {
  const locationPath = getModuleProperty(
    MODULE_PROPERTY_KEYS.LOCATION_PATH,
    script.moduleProperties,
  )

  return {
    inum: script.inum,
    name: script.name ?? '',
    description: script.description ?? '',
    scriptType: script.scriptType ?? '',
    programmingLanguage: script.programmingLanguage ?? '',
    level: script.level ?? 1,
    revision: script.revision,
    enabled: script.enabled ?? false,

    // Script Content
    script: script.script,
    script_path: locationPath ?? '',
    locationPath: script.locationPath,
    location_type: script.locationType ?? 'db',

    // Type-specific Fields
    aliases: script.aliases ?? [],

    // Properties
    moduleProperties: filterEmptyObjects(script.moduleProperties) ?? [],
    configurationProperties: filterEmptyObjects(script.configurationProperties) ?? [],

    // UI-only
    action_message: '',
  }
}

/**
 * Transform form values to API CustomScript model
 * @param values - Form values from Formik
 * @returns CustomScript for API
 */
export function transformToApiPayload(values: ScriptFormValues): CustomScript {
  return {
    inum: values.inum,
    name: values.name,
    description: values.description,
    scriptType: values.scriptType as any,
    programmingLanguage: values.programmingLanguage as any,
    level: values.level,
    revision: values.revision,
    enabled: values.enabled,
    script: values.location_type === 'db' ? values.script : undefined,
    aliases: values.aliases.length > 0 ? values.aliases : undefined,
    moduleProperties: values.moduleProperties.length > 0 ? values.moduleProperties : undefined,
    configurationProperties:
      values.configurationProperties.length > 0 ? values.configurationProperties : undefined,
    locationType: values.location_type as any,
    locationPath: values.location_type === 'file' ? values.locationPath : undefined,
  }
}

/**
 * Transform property from API format (value1/value2) to UI format (key/value)
 * @param property - Property in API format
 * @returns Property in UI format
 */
export function transformPropertyToKeyValue(
  property: SimpleCustomProperty | SimpleExtendedCustomProperty,
): { key: string; value: string; description?: string; hide?: boolean } {
  const result: any = {
    key: property.value1 ?? '',
    value: property.value2 ?? '',
  }

  if ('description' in property && property.description) {
    result.description = property.description
  }

  if ('hide' in property && property.hide !== undefined) {
    result.hide = property.hide
  }

  return result
}

/**
 * Transform property from UI format (key/value) to API format (value1/value2)
 * @param property - Property in UI format
 * @returns Property in API format
 */
export function transformPropertyToApiFormat(property: {
  key?: string
  value?: string
  description?: string
  hide?: boolean
  value1?: string
  value2?: string
}): SimpleCustomProperty | SimpleExtendedCustomProperty {
  const result: any = {
    value1: property.key ?? property.value1 ?? '',
    value2: property.value ?? property.value2 ?? '',
  }

  if (property.description) {
    result.description = property.description
  }

  if (property.hide !== undefined) {
    result.hide = property.hide
  }

  return result
}

/**
 * Get default/empty CustomScript object
 * @returns Empty CustomScript
 */
export function getEmptyScript(): CustomScript {
  return {
    name: '',
    description: '',
    scriptType: undefined,
    programmingLanguage: undefined,
    level: 1,
    enabled: false,
    aliases: [],
    moduleProperties: [],
    configurationProperties: [],
    locationType: 'db',
  }
}

/**
 * Check if a script has errors
 * @param script - CustomScript to check
 * @returns True if script has errors
 */
export function hasScriptError(script: CustomScript): boolean {
  return Boolean(script.enabled && script.scriptError?.stackTrace)
}

/**
 * Check if a script is enabled
 * @param script - CustomScript to check
 * @returns True if script is enabled
 */
export function isScriptEnabled(script: CustomScript): boolean {
  return script.enabled === true
}

/**
 * Get script display status
 * @param script - CustomScript to check
 * @returns Status string for display
 */
export function getScriptStatus(script: CustomScript): 'error' | 'enabled' | 'disabled' {
  if (hasScriptError(script)) {
    return 'error'
  }
  if (isScriptEnabled(script)) {
    return 'enabled'
  }
  return 'disabled'
}
