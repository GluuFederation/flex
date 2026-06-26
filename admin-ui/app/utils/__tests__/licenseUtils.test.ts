import { formatLicenseFieldValue } from '@/utils/licenseUtils'

describe('formatLicenseFieldValue', () => {
  it('returns a dash for null', () => {
    expect(formatLicenseFieldValue(null)).toBe('-')
  })

  it('returns a dash for undefined', () => {
    expect(formatLicenseFieldValue(undefined)).toBe('-')
  })

  it('returns a dash for an empty string', () => {
    expect(formatLicenseFieldValue('')).toBe('-')
  })

  it('returns a dash for a whitespace-only string', () => {
    expect(formatLicenseFieldValue('   ')).toBe('-')
  })

  it('returns the string value unchanged when non-empty', () => {
    expect(formatLicenseFieldValue('ACME')).toBe('ACME')
  })

  it('stringifies a numeric value', () => {
    expect(formatLicenseFieldValue(42)).toBe('42')
  })

  it('stringifies zero rather than treating it as empty', () => {
    expect(formatLicenseFieldValue(0)).toBe('0')
  })
})
