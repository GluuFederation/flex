import type { SchemaProperty } from '../types'

export function isNumber(item: unknown): item is number {
  return typeof item === 'number' || typeof item === 'bigint'
}

export function isBoolean(item: unknown, schema?: SchemaProperty): item is boolean {
  return typeof item === 'boolean' || schema?.type === 'boolean'
}

export function isString(item: unknown, schema?: SchemaProperty): item is string {
  return typeof item === 'string' || schema?.type === 'string'
}

export function isStringArray(item: unknown, schema?: SchemaProperty): item is string[] {
  return (
    (Array.isArray(item) && item.length >= 1 && typeof item[0] === 'string') ||
    (schema?.type === 'array' && schema?.items?.type === 'string')
  )
}
