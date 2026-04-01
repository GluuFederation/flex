import {
  isEmptyValue,
  shouldDisableApplyButton,
  hasFormChanges,
  buildFormOperations,
} from 'Plugins/user-management/utils/formValidationUtils'

describe('isEmptyValue', () => {
  it('should return true for null', () => {
    expect(isEmptyValue(null)).toBe(true)
  })

  it('should return true for undefined', () => {
    expect(isEmptyValue(undefined)).toBe(true)
  })

  it('should return true for empty string', () => {
    expect(isEmptyValue('')).toBe(true)
  })

  it('should return true for whitespace-only string', () => {
    expect(isEmptyValue('   ')).toBe(true)
  })

  it('should return true for empty array', () => {
    expect(isEmptyValue([])).toBe(true)
  })

  it('should return false for non-empty string', () => {
    expect(isEmptyValue('hello')).toBe(false)
  })

  it('should return false for non-empty array', () => {
    expect(isEmptyValue(['item'])).toBe(false)
  })

  it('should return false for boolean false', () => {
    expect(isEmptyValue(false)).toBe(false)
  })
})

describe('shouldDisableApplyButton', () => {
  it('should return true when submitting', () => {
    expect(shouldDisableApplyButton(true, true, true, { field: 'value' })).toBe(true)
  })

  it('should return true when not dirty and no modified fields', () => {
    expect(shouldDisableApplyButton(false, false, true, {})).toBe(true)
  })

  it('should return false when dirty and valid', () => {
    expect(shouldDisableApplyButton(false, true, true, {})).toBe(false)
  })

  it('should return false when has modified fields and valid', () => {
    expect(shouldDisableApplyButton(false, false, true, { field: 'value' })).toBe(false)
  })

  it('should return true when not valid', () => {
    expect(shouldDisableApplyButton(false, true, false, {})).toBe(true)
  })
})

describe('hasFormChanges', () => {
  it('should return true when dirty', () => {
    expect(hasFormChanges(true, {})).toBe(true)
  })

  it('should return true when has modified fields', () => {
    expect(hasFormChanges(false, { field: 'value' })).toBe(true)
  })

  it('should return false when not dirty and no modified fields', () => {
    expect(hasFormChanges(false, {})).toBe(false)
  })
})

describe('buildFormOperations', () => {
  it('should convert modified fields to patch operations', () => {
    const modifiedFields = {
      displayName: 'New Name',
      mail: 'new@example.com',
    }

    const result = buildFormOperations(modifiedFields)

    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({ path: 'displayName', value: 'New Name', op: 'replace' })
    expect(result[1]).toEqual({ path: 'mail', value: 'new@example.com', op: 'replace' })
  })

  it('should return empty array for empty modified fields', () => {
    const result = buildFormOperations({})

    expect(result).toHaveLength(0)
  })
})
