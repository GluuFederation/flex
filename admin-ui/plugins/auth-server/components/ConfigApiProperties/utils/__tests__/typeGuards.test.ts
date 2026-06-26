import {
  isNumber,
  isBoolean,
  isString,
  isStringArray,
  shouldRenderAsBoolean,
  shouldRenderAsString,
  shouldRenderAsStringArray,
  shouldRenderAsNumber,
  getBooleanValue,
  getStringValue,
  getNumberValue,
  getStringArrayValue,
  isEmptyArray,
  isObjectArray,
  isObject,
  sortKeysByFieldType,
  migratingTextIfRenamed,
} from 'Plugins/auth-server/components/ConfigApiProperties/utils/typeGuards'
import type { PropertyValue } from 'Plugins/auth-server/components/AuthServerProperties/types'

describe('primitive type guards', () => {
  it('isNumber', () => {
    expect(isNumber(5)).toBe(true)
    expect(isNumber(0)).toBe(true)
    expect(isNumber('5')).toBe(false)
    expect(isNumber(true)).toBe(false)
  })

  it('isBoolean', () => {
    expect(isBoolean(true)).toBe(true)
    expect(isBoolean(false)).toBe(true)
    expect(isBoolean('true')).toBe(false)
    expect(isBoolean(1)).toBe(false)
  })

  it('isString', () => {
    expect(isString('abc')).toBe(true)
    expect(isString(1)).toBe(false)
  })

  it('isStringArray', () => {
    expect(isStringArray(['a', 'b'])).toBe(true)
    expect(isStringArray([])).toBe(true)
    expect(isStringArray('a')).toBe(false)
    expect(isStringArray(5)).toBe(false)
    expect(isStringArray({ a: 1 })).toBe(false)
  })
})

describe('shouldRenderAs* helpers', () => {
  it('shouldRenderAsBoolean', () => {
    expect(shouldRenderAsBoolean({ type: 'boolean' })).toBe(true)
    expect(shouldRenderAsBoolean({ type: 'string' })).toBe(false)
    expect(shouldRenderAsBoolean(undefined)).toBe(false)
  })

  it('shouldRenderAsString', () => {
    expect(shouldRenderAsString({ type: 'string' })).toBe(true)
    expect(shouldRenderAsString({ type: 'number' })).toBe(false)
  })

  it('shouldRenderAsStringArray', () => {
    expect(shouldRenderAsStringArray({ type: 'array', items: { type: 'string' } })).toBe(true)
    expect(shouldRenderAsStringArray({ type: 'array', items: { type: 'number' } })).toBe(false)
    expect(shouldRenderAsStringArray({ type: 'string' })).toBe(false)
  })

  it('shouldRenderAsNumber', () => {
    expect(shouldRenderAsNumber({ type: 'number' })).toBe(true)
    expect(shouldRenderAsNumber({ type: 'string' })).toBe(false)
  })
})

describe('getter helpers', () => {
  it('getBooleanValue returns boolean only for boolean values', () => {
    expect(getBooleanValue(true)).toBe(true)
    expect(getBooleanValue('true', { type: 'boolean' })).toBeUndefined()
    expect(getBooleanValue(5)).toBeUndefined()
  })

  it('getStringValue returns string only for string values', () => {
    expect(getStringValue('hi')).toBe('hi')
    expect(getStringValue(5, { type: 'string' })).toBeUndefined()
  })

  it('getNumberValue returns number only for numeric values', () => {
    expect(getNumberValue(42)).toBe(42)
    expect(getNumberValue('42', { type: 'number' })).toBeUndefined()
  })

  it('getStringArrayValue returns array only for string arrays', () => {
    expect(getStringArrayValue(['a'])).toEqual(['a'])
    expect(getStringArrayValue('a', { type: 'array', items: { type: 'string' } })).toEqual([])
    expect(getStringArrayValue(5)).toEqual([])
  })
})

describe('array/object guards', () => {
  it('isEmptyArray', () => {
    expect(isEmptyArray([])).toBe(true)
    expect(isEmptyArray(['a'])).toBe(false)
    expect(isEmptyArray('a')).toBe(false)
  })

  it('isObjectArray detects arrays whose first element is an object', () => {
    // PropertyValue's array member type is string[], so build the object-array at
    // runtime (the shape isObjectArray inspects) without a literal type mismatch.
    const objectArray: PropertyValue = Object.assign([], [{ a: 1 }])
    expect(isObjectArray(objectArray)).toBe(true)
  })

  it('isObjectArray returns false for empty and string arrays', () => {
    expect(isObjectArray([])).toBe(false)
    expect(isObjectArray(['a'])).toBe(false)
  })

  it('isObject', () => {
    expect(isObject({ a: 1 })).toBe(true)
    expect(isObject(['a'])).toBe(false)
    expect(isObject(null)).toBe(false)
    expect(isObject('a')).toBe(false)
  })
})

describe('sortKeysByFieldType', () => {
  it('orders keys input, boolean, array, complex', () => {
    const obj: Record<string, PropertyValue> = {
      arr: ['x'],
      bool: true,
      str: 'hello',
      num: 1,
      complex: { nested: 1 },
    }
    const sorted = sortKeysByFieldType(['arr', 'bool', 'str', 'num', 'complex'], obj)
    expect(sorted).toEqual(['str', 'num', 'bool', 'arr', 'complex'])
  })
})

describe('migratingTextIfRenamed', () => {
  it('returns raw text when renamed', () => {
    expect(migratingTextIfRenamed(true, 'someText')).toBe('someText')
  })

  it('generates a label when not renamed', () => {
    expect(typeof migratingTextIfRenamed(false, 'someText')).toBe('string')
  })
})
