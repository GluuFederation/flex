import { validatePassword, getStringValue } from 'Plugins/user-management/utils/userFormUtils'

describe('validatePassword', () => {
  it('should pass for a valid password', () => {
    expect(validatePassword('Password1!')).toBe(true)
  })

  it('should fail for a password that is too short', () => {
    expect(validatePassword('Pa1!')).toBe(false)
  })

  it('should fail for a password missing uppercase', () => {
    expect(validatePassword('password1!')).toBe(false)
  })

  it('should fail for a password missing a digit', () => {
    expect(validatePassword('Password!')).toBe(false)
  })

  it('should fail for a password missing a special character', () => {
    expect(validatePassword('Password1')).toBe(false)
  })

  it('should fail for an empty password', () => {
    expect(validatePassword('')).toBe(false)
  })
})

describe('getStringValue', () => {
  it('should return the string as-is for string input', () => {
    expect(getStringValue('hello')).toBe('hello')
  })

  it('should return the first element for array input', () => {
    expect(getStringValue(['first', 'second'])).toBe('first')
  })

  it('should return empty string for boolean input', () => {
    expect(getStringValue(true)).toBe('')
  })

  it('should return empty string for null', () => {
    expect(getStringValue(null)).toBe('')
  })

  it('should return empty string for undefined', () => {
    expect(getStringValue(undefined)).toBe('')
  })

  it('should return empty string for empty array', () => {
    expect(getStringValue([])).toBe('')
  })
})
