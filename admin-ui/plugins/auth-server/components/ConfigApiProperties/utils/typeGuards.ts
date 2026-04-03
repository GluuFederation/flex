import type {
  SchemaProperty,
  PropertyValue,
  AppConfiguration,
} from '../../AuthServerProperties/types'
import { generateLabel } from 'Plugins/auth-server/common/propertiesUtils'
export { generateLabel }

export const isNumber = (item: PropertyValue, _schema?: SchemaProperty): item is number => {
  return typeof item === 'number' || typeof item === 'bigint'
}

export const isBoolean = (item: PropertyValue): item is boolean => {
  return typeof item === 'boolean'
}

export const isString = (item: PropertyValue): item is string => {
  return typeof item === 'string'
}

export const isStringArray = (item: PropertyValue): item is string[] => {
  return Array.isArray(item) && item.every((el) => typeof el === 'string')
}

export const shouldRenderAsBoolean = (schema?: SchemaProperty): boolean => {
  return schema?.type === 'boolean'
}

export const shouldRenderAsString = (schema?: SchemaProperty): boolean => {
  return schema?.type === 'string'
}

export const shouldRenderAsStringArray = (schema?: SchemaProperty): boolean => {
  return schema?.type === 'array' && schema?.items?.type === 'string'
}

export const shouldRenderAsNumber = (schema?: SchemaProperty): boolean => {
  return schema?.type === 'number'
}

export const getBooleanValue = (
  item: PropertyValue,
  schema?: SchemaProperty,
): boolean | undefined => {
  if (isBoolean(item)) {
    return item
  }
  if (shouldRenderAsBoolean(schema)) {
    return undefined
  }
  return undefined
}

export const getStringValue = (
  item: PropertyValue,
  schema?: SchemaProperty,
): string | undefined => {
  if (isString(item)) {
    return item
  }
  if (shouldRenderAsString(schema)) {
    return undefined
  }
  return undefined
}

export const getNumberValue = (
  item: PropertyValue,
  schema?: SchemaProperty,
): number | undefined => {
  if (isNumber(item)) {
    return item
  }
  if (shouldRenderAsNumber(schema)) {
    return undefined
  }
  return undefined
}

export const getStringArrayValue = (item: PropertyValue, schema?: SchemaProperty): string[] => {
  if (isStringArray(item)) {
    return item
  }
  if (shouldRenderAsStringArray(schema)) {
    return []
  }
  return []
}

export const isEmptyArray = (item: PropertyValue): boolean => {
  return Array.isArray(item) && item.length === 0
}

export const isObjectArray = (item: PropertyValue): boolean => {
  return Array.isArray(item) && item.length >= 1 && typeof item[0] === 'object' && item[0] !== null
}

export const isObject = (item: PropertyValue): item is AppConfiguration => {
  if (item != null) {
    return typeof item === 'object' && !Array.isArray(item)
  }
  return false
}

export const sortKeysByFieldType = (
  keys: string[],
  obj: Record<string, PropertyValue>,
): string[] => {
  const inputKeys = keys.filter((k) => {
    const v = obj[k]
    return (typeof v === 'string' || typeof v === 'number') && !isObject(v) && !isObjectArray(v)
  })
  const booleanKeys = keys.filter((k) => typeof obj[k] === 'boolean')
  const arrayKeys = keys.filter((k) => {
    const v = obj[k]
    return (Array.isArray(v) && !isObjectArray(v)) || isEmptyArray(v)
  })
  const complexKeys = keys.filter((k) => isObject(obj[k]) || isObjectArray(obj[k]))
  return [...inputKeys, ...booleanKeys, ...arrayKeys, ...complexKeys]
}

export const migratingTextIfRenamed = (isRenamedKey: boolean, text: string): string => {
  if (isRenamedKey) {
    return text
  }
  return generateLabel(text)
}
