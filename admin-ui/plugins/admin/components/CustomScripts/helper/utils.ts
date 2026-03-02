import { CustomScriptItem, ModuleProperty, ConfigurationProperty } from '../types/customScript'

import { FormValues } from '../types/forms'
import { filterEmptyObjects } from 'Utils/Util'
import { LOCATION_TYPE_DB } from '../constants'
import type { CustomScript, SimpleCustomProperty } from 'JansConfigApi'

export const getApiErrorDetail = (error: unknown): string => {
  if (error && typeof error === 'object' && 'response' in error) {
    const err = error as { response?: { data?: string | { message?: string } }; message?: string }
    const data = err.response?.data
    if (typeof data === 'string' && data.trim()) return data
    if (data && typeof data === 'object' && typeof data.message === 'string') return data.message
  }
  if (error && typeof error === 'object' && 'message' in error) {
    return (error as { message: string }).message
  }
  return String(error ?? '')
}

export const getModuleProperty = (
  key: string,
  properties?: ModuleProperty[] | SimpleCustomProperty[],
): string | undefined =>
  properties
    ? (properties as Array<{ value1?: string; value2?: string }>).find((p) => p.value1 === key)
        ?.value2
    : undefined

type PropertyInput =
  | ConfigurationProperty
  | ModuleProperty
  | SimpleCustomProperty
  | Record<string, unknown>

type PropertyLike = { key?: string; value?: string; value1?: string; value2?: string }

export const normalizeProperty = (p: PropertyInput): ConfigurationProperty | ModuleProperty => {
  const q = p as PropertyLike
  const key = (q.key ?? q.value1 ?? '').toString().trim()
  const value = (q.value ?? q.value2 ?? '').toString().trim()
  const base = { value1: key, value2: value, key, value }
  if ('description' in p && p.description != null) {
    return { ...base, description: String(p.description) }
  }
  if ('hide' in p && p.hide != null) {
    return { ...base, hide: Boolean(p.hide) }
  }
  return base as ConfigurationProperty
}

export const transformToFormValues = (
  item: CustomScriptItem | CustomScript | Partial<CustomScriptItem>,
): FormValues => {
  const rawConfig = filterEmptyObjects(item.configurationProperties) ?? []
  const rawModule = filterEmptyObjects(item.moduleProperties) ?? []
  return {
    name: item.name ?? '',
    description: item.description ?? '',
    scriptType: item.scriptType ?? '',
    programmingLanguage: item.programmingLanguage ?? 'python',
    level: item.level ?? 1,
    script: item.script ?? '',
    aliases: item.aliases ?? [],
    moduleProperties: rawModule.map(normalizeProperty) as ModuleProperty[],
    configurationProperties: rawConfig.map(normalizeProperty) as ConfigurationProperty[],
    script_path: '',
    locationPath: undefined,
    location_type: LOCATION_TYPE_DB,
    enabled: item.enabled !== undefined ? item.enabled : true,
    action_message: '',
  }
}
