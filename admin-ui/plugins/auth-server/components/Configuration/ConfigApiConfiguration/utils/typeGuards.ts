import type { SchemaProperty, PropertyValue, AppConfiguration } from '../../types'

export function isNumber(item: PropertyValue, _schema?: SchemaProperty): item is number {
  return typeof item === 'number' || typeof item === 'bigint'
}

export function isBoolean(item: PropertyValue): item is boolean {
  return typeof item === 'boolean'
}

export function isString(item: PropertyValue): item is string {
  return typeof item === 'string'
}

export function isStringArray(item: PropertyValue): item is string[] {
  return Array.isArray(item) && item.every((el) => typeof el === 'string')
}

export function shouldRenderAsBoolean(schema?: SchemaProperty): boolean {
  return schema?.type === 'boolean'
}

export function shouldRenderAsString(schema?: SchemaProperty): boolean {
  return schema?.type === 'string'
}

export function shouldRenderAsStringArray(schema?: SchemaProperty): boolean {
  return schema?.type === 'array' && schema?.items?.type === 'string'
}

export function shouldRenderAsNumber(schema?: SchemaProperty): boolean {
  return schema?.type === 'number'
}

export function getBooleanValue(item: PropertyValue, schema?: SchemaProperty): boolean | undefined {
  if (isBoolean(item)) {
    return item
  }
  if (shouldRenderAsBoolean(schema)) {
    return undefined
  }
  return undefined
}

export function getStringValue(item: PropertyValue, schema?: SchemaProperty): string | undefined {
  if (isString(item)) {
    return item
  }
  if (shouldRenderAsString(schema)) {
    return undefined
  }
  return undefined
}

export function getNumberValue(item: PropertyValue, schema?: SchemaProperty): number | undefined {
  if (isNumber(item)) {
    return item
  }
  if (shouldRenderAsNumber(schema)) {
    return undefined
  }
  return undefined
}

export function getStringArrayValue(item: PropertyValue, schema?: SchemaProperty): string[] {
  if (isStringArray(item)) {
    return item
  }
  if (shouldRenderAsStringArray(schema)) {
    return []
  }
  return []
}

export function isEmptyArray(item: PropertyValue): boolean {
  return Array.isArray(item) && item.length === 0
}

export function isObjectArray(item: PropertyValue): boolean {
  return Array.isArray(item) && item.length >= 1 && typeof item[0] === 'object' && item[0] !== null
}

export function isObject(item: PropertyValue): item is AppConfiguration {
  if (item != null) {
    return typeof item === 'object' && !Array.isArray(item)
  }
  return false
}

export function generateLabel(name: string): string {
  const result = name.replace(/([A-Z])/g, ' $1')
  return result.charAt(0).toUpperCase() + result.slice(1)
}

export function migratingTextIfRenamed(isRenamedKey: boolean, text: string): string {
  if (isRenamedKey) {
    return text
  }
  return generateLabel(text)
}
