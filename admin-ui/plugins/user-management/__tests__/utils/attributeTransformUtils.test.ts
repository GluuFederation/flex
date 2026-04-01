import {
  extractValueFromEntry,
  normalizeSingleValue,
  normalizeBooleanValue,
  isBooleanAttribute,
  isMultiValuedAttribute,
  createCustomAttribute,
  processMultiValuedField,
  processSingleValuedField,
} from 'Plugins/user-management/utils/attributeTransformUtils'
import type { PersonAttribute } from 'Plugins/user-management/types/UserApiTypes'

describe('extractValueFromEntry', () => {
  it('should return trimmed string for string input', () => {
    expect(extractValueFromEntry('  hello  ', 'someAttr')).toBe('hello')
  })

  it('should return role from object with role property for role attributes', () => {
    const entry = { role: 'admin' }
    expect(extractValueFromEntry(entry as never, 'jansAdminUIRole')).toBe('admin')
  })

  it('should return value from object with value property', () => {
    const entry = { value: 'testValue' }
    expect(extractValueFromEntry(entry as never, 'someAttr')).toBe('testValue')
  })
})

describe('normalizeSingleValue', () => {
  it('should trim string values', () => {
    expect(normalizeSingleValue('  hello  ', 'someAttr')).toBe('hello')
  })

  it('should return string representation for boolean values', () => {
    expect(normalizeSingleValue(true as never, 'someAttr')).toBe('true')
  })
})

describe('normalizeBooleanValue', () => {
  it('should return true for boolean true', () => {
    expect(normalizeBooleanValue(true)).toBe(true)
  })

  it('should return false for boolean false', () => {
    expect(normalizeBooleanValue(false)).toBe(false)
  })

  it('should return true for string "true"', () => {
    expect(normalizeBooleanValue('true')).toBe(true)
  })

  it('should return false for string "false"', () => {
    expect(normalizeBooleanValue('false')).toBe(false)
  })
})

describe('isBooleanAttribute', () => {
  it('should return true when dataType is boolean', () => {
    const attr = { dataType: 'boolean', name: 'test' } as PersonAttribute
    expect(isBooleanAttribute(attr)).toBe(true)
  })

  it('should return false when dataType is string', () => {
    const attr = { dataType: 'string', name: 'test' } as PersonAttribute
    expect(isBooleanAttribute(attr)).toBe(false)
  })

  it('should return false when attribute is undefined', () => {
    expect(isBooleanAttribute(undefined)).toBe(false)
  })
})

describe('isMultiValuedAttribute', () => {
  it('should return true when oxMultiValuedAttribute is true', () => {
    const attr = { oxMultiValuedAttribute: true, name: 'test' } as PersonAttribute
    expect(isMultiValuedAttribute(attr)).toBe(true)
  })

  it('should return false when oxMultiValuedAttribute is false', () => {
    const attr = { oxMultiValuedAttribute: false, name: 'test' } as PersonAttribute
    expect(isMultiValuedAttribute(attr)).toBe(false)
  })

  it('should return false when attribute is undefined', () => {
    expect(isMultiValuedAttribute(undefined)).toBe(false)
  })
})

describe('createCustomAttribute', () => {
  it('should create correct structure for single-valued attribute', () => {
    const result = createCustomAttribute('testAttr', ['value1'], false)

    expect(result.name).toBe('testAttr')
    expect(result.multiValued).toBe(false)
    expect(result.values).toHaveLength(1)
  })

  it('should create correct structure for multi-valued attribute', () => {
    const result = createCustomAttribute('testAttr', ['value1', 'value2'], true)

    expect(result.name).toBe('testAttr')
    expect(result.multiValued).toBe(true)
    expect(result.values).toHaveLength(2)
  })
})

describe('processMultiValuedField', () => {
  it('should keep array as array', () => {
    const result = processMultiValuedField(['a', 'b', 'c'])

    expect(result).toHaveLength(3)
    expect(result[0]).toBe('a')
    expect(result[1]).toBe('b')
    expect(result[2]).toBe('c')
  })

  it('should wrap single value in array', () => {
    const result = processMultiValuedField('single')

    expect(result).toHaveLength(1)
    expect(result[0]).toBe('single')
  })
})

describe('processSingleValuedField', () => {
  it('should return boolean for boolean attribute', () => {
    const result = processSingleValuedField(true, true)

    expect(result).toBe(true)
  })

  it('should return string for non-boolean attribute', () => {
    const result = processSingleValuedField('hello', false)

    expect(result).toBe('hello')
  })

  it('should return string from array for non-boolean attribute', () => {
    const result = processSingleValuedField(['first', 'second'], false)

    expect(result).toBe('first')
  })
})
