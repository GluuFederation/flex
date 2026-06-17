import {
  isEmptyValue,
  buildFormOperations,
  diffFormValues,
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

describe('buildFormOperations', () => {
  it('should convert modified fields to patch operations', () => {
    const modifiedFields = {
      displayName: 'New Name',
      mail: 'new@example.com',
    }

    const result = buildFormOperations(modifiedFields)

    expect(result).toHaveLength(2)
    expect(result).toEqual(
      expect.arrayContaining([
        { path: 'displayName', value: 'New Name', op: 'replace' },
        { path: 'mail', value: 'new@example.com', op: 'replace' },
      ]),
    )
  })

  it('should return empty array for empty modified fields', () => {
    const result = buildFormOperations({})

    expect(result).toHaveLength(0)
  })
})

describe('diffFormValues', () => {
  it('returns only changed scalar fields', () => {
    const result = diffFormValues(
      { displayName: 'New', mail: 'a@b.com' },
      { displayName: 'Old', mail: 'a@b.com' },
    )
    expect(result).toEqual({ displayName: 'New' })
  })

  it('ignores a field reverted to its original value', () => {
    const result = diffFormValues({ locale: 'en' }, { locale: 'en' })
    expect(result).toEqual({})
  })

  it('treats empty string and undefined as equal (no change)', () => {
    const result = diffFormValues({ middleName: '' }, { middleName: undefined })
    expect(result).toEqual({})
  })

  it('tracks a cleared field that originally had a value', () => {
    const result = diffFormValues({ o: '' }, { o: 'Acme' })
    expect(result).toEqual({ o: '' })
  })

  it('tracks a newly set field with no original value', () => {
    const result = diffFormValues({ nickname: 'qa' }, {})
    expect(result).toEqual({ nickname: 'qa' })
  })

  it('compares array values element-wise', () => {
    expect(diffFormValues({ role: ['a', 'b'] }, { role: ['a', 'b'] })).toEqual({})
    expect(diffFormValues({ role: ['a', 'c'] }, { role: ['a', 'b'] })).toEqual({ role: ['a', 'c'] })
  })

  it('tracks a cleared multi-valued field', () => {
    expect(diffFormValues({ role: [] }, { role: ['a'] })).toEqual({ role: [] })
  })

  it('tracks boolean toggles but not unchanged booleans', () => {
    expect(diffFormValues({ emailVerified: false }, { emailVerified: true })).toEqual({
      emailVerified: false,
    })
    expect(diffFormValues({ emailVerified: true }, { emailVerified: true })).toEqual({})
  })

  it('skips ignored keys', () => {
    const result = diffFormValues({ userPassword: 'x', userConfirmPassword: 'x' }, {}, [
      'userConfirmPassword',
    ])
    expect(result).toEqual({ userPassword: 'x' })
  })
})
