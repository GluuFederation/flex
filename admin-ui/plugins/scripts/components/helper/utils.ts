import { CustomScriptItem, ModuleProperty, ConfigurationProperty } from '../types/customScript'
import { REGEX_CONSECUTIVE_WHITESPACE } from '@/utils/regex'

import { FormValues } from '../types/forms'
import { filterEmptyObjects } from 'Utils/Util'
import type { CustomScript, SimpleCustomProperty } from 'JansConfigApi'
import type { GluuCommitDialogOperation } from 'Routes/Apps/Gluu/types/index'
import type { JsonValue } from 'Routes/Apps/Gluu/types/common'
import type { TFunction } from 'i18next'

interface ApiError {
  response?: { data?: string | { message?: string } }
  message?: string
}

export const getApiErrorDetail = (error: Error | ApiError | string | null | undefined): string => {
  if (!error) return ''
  if (typeof error === 'string') return error

  if ('response' in error) {
    const data = (error as ApiError).response?.data
    if (typeof data === 'string' && data.trim()) return data
    if (data && typeof data === 'object' && typeof data.message === 'string') return data.message
  }
  if ('message' in error && typeof error.message === 'string') {
    return error.message
  }
  return String(error)
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
  | Record<string, string | boolean | undefined>

type PropertyLike = { key?: string; value?: string; value1?: string; value2?: string }

export const normalizeProperty = (p: PropertyInput): ConfigurationProperty | ModuleProperty => {
  const q = p as PropertyLike
  const base: Record<string, string | boolean> = {
    value1: (q.key ?? q.value1 ?? '').toString().trim(),
    value2: (q.value ?? q.value2 ?? '').toString().trim(),
  }
  if ('description' in p && p.description != null) {
    base.description = String(p.description)
  }
  if ('hide' in p && p.hide != null) {
    base.hide = Boolean(p.hide)
  }
  return base as ConfigurationProperty | ModuleProperty
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
    enabled: item.enabled !== undefined ? item.enabled : true,
    action_message: '',
  }
}

const getPropertyKey = (prop: ModuleProperty | ConfigurationProperty): string => prop.value1 || ''

const getPropertyValue = (prop: ModuleProperty | ConfigurationProperty): string => prop.value2 || ''

const addPropertyChanges = (
  operations: GluuCommitDialogOperation[],
  label: string,
  initialProps: Array<ModuleProperty | ConfigurationProperty>,
  currentProps: Array<ModuleProperty | ConfigurationProperty>,
): void => {
  const initialMap = new Map<string, string>()
  for (const prop of initialProps || []) {
    const key = getPropertyKey(prop)
    if (key) initialMap.set(key, getPropertyValue(prop))
  }

  const currentMap = new Map<string, string>()
  for (const prop of currentProps || []) {
    const key = getPropertyKey(prop)
    if (key) currentMap.set(key, getPropertyValue(prop))
  }

  // Added or changed
  for (const [key, value] of currentMap) {
    const oldValue = initialMap.get(key)
    if (oldValue === undefined) {
      operations.push({ path: `${label} [${key}]`, value: value || '""' })
    } else if (oldValue !== value) {
      operations.push({ path: `${label} [${key}]`, value: value || '""' })
    }
  }

  // Removed
  for (const [key] of initialMap) {
    if (!currentMap.has(key)) {
      operations.push({ path: `${label} [${key}]`, value: '(removed)' })
    }
  }
}

export const buildChangedFieldOperations = (
  initial: FormValues,
  current: FormValues,
  t: TFunction,
): GluuCommitDialogOperation[] => {
  const operations: GluuCommitDialogOperation[] = []

  const addIfChanged = (
    path: string,
    oldValue: JsonValue | undefined,
    newValue: JsonValue | undefined,
  ) => {
    if (oldValue !== newValue) {
      operations.push({ path, value: newValue ?? null })
    }
  }

  addIfChanged(t('fields.name'), initial.name ?? null, current.name ?? null)
  addIfChanged(t('fields.description'), initial.description ?? null, current.description ?? null)
  addIfChanged(t('fields.script_type'), initial.scriptType ?? null, current.scriptType ?? null)
  addIfChanged(
    t('fields.programming_language'),
    initial.programmingLanguage ?? null,
    current.programmingLanguage ?? null,
  )
  addIfChanged(t('fields.level'), initial.level ?? null, current.level ?? null)
  addIfChanged(
    t('fields.enabled'),
    (initial.enabled as JsonValue) ?? null,
    (current.enabled as JsonValue) ?? null,
  )
  if ((initial.script ?? '') !== (current.script ?? '')) {
    const scriptPreview = (current.script ?? '').replace(REGEX_CONSECUTIVE_WHITESPACE, ' ').trim()
    const maxLen = 40
    operations.push({
      path: t('fields.script'),
      value:
        scriptPreview.length > maxLen
          ? `${scriptPreview.slice(0, maxLen)}...`
          : scriptPreview || '(cleared)',
    })
  }
  if (JSON.stringify(initial.aliases) !== JSON.stringify(current.aliases)) {
    operations.push({ path: t('fields.saml_acrs'), value: (current.aliases ?? null) as JsonValue })
  }
  addPropertyChanges(
    operations,
    t('fields.module_properties'),
    initial.moduleProperties,
    current.moduleProperties,
  )
  addPropertyChanges(
    operations,
    t('fields.custom_properties'),
    initial.configurationProperties,
    current.configurationProperties,
  )

  return operations
}
