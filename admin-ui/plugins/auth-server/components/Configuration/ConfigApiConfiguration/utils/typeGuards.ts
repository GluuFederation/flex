import type { SchemaProperty } from '../types'

export function isNumber(item: unknown, _schema?: SchemaProperty): item is number {
  return typeof item === 'number' || typeof item === 'bigint'
}

export function isBoolean(item: unknown): item is boolean {
  return typeof item === 'boolean'
}

export function isString(item: unknown): item is string {
  return typeof item === 'string'
}

export function isStringArray(item: unknown): item is string[] {
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

export function getBooleanValue(item: unknown, schema?: SchemaProperty): boolean | undefined {
  if (isBoolean(item)) {
    return item
  }
  if (shouldRenderAsBoolean(schema)) {
    return undefined
  }
  return undefined
}

export function getStringValue(item: unknown, schema?: SchemaProperty): string | undefined {
  if (isString(item)) {
    return item
  }
  if (shouldRenderAsString(schema)) {
    return undefined
  }
  return undefined
}

export function getNumberValue(item: unknown, schema?: SchemaProperty): number | undefined {
  if (isNumber(item)) {
    return item
  }
  if (shouldRenderAsNumber(schema)) {
    return undefined
  }
  return undefined
}

export function getStringArrayValue(item: unknown, schema?: SchemaProperty): string[] {
  if (isStringArray(item)) {
    return item
  }
  if (shouldRenderAsStringArray(schema)) {
    return []
  }
  return []
}
