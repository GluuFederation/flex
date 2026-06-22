import i18next from 'i18next'
import {
  getClaimLabel,
  getClaimLabelKey,
  getCountryName,
} from 'Plugins/user-management/utils/claimLabelUtils'
import { countries } from 'Plugins/user-management/common/countries'

beforeAll(async () => {
  await i18next.init({
    lng: 'en',
    resources: {
      en: {
        translation: {
          'claims.testClaim': 'Translated Label',
        },
      },
    },
  })
})

const t = i18next.t.bind(i18next)

describe('getClaimLabel', () => {
  it('should return translation when it exists', () => {
    const result = getClaimLabel(t, 'testClaim', 'Fallback Display')
    expect(result).toBe('Translated Label')
  })

  it('should fall back to displayName when no translation exists', () => {
    const result = getClaimLabel(t, 'nonExistentClaimXyz123', 'Fallback Display')
    expect(result).toBe('Fallback Display')
  })

  it('should fall back to name when no translation and no displayName', () => {
    const result = getClaimLabel(t, 'nonExistentClaimXyz123')
    expect(result).toBe('nonExistentClaimXyz123')
  })
})

describe('getClaimLabelKey', () => {
  it('should return i18n key when translation exists', () => {
    const result = getClaimLabelKey(t, 'testClaim', 'Fallback Display')
    expect(result).toBe('claims.testClaim')
  })

  it('should fall back to displayName when no translation exists', () => {
    const result = getClaimLabelKey(t, 'nonExistentClaimXyz123', 'Fallback Display')
    expect(result).toBe('Fallback Display')
  })

  it('should fall back to name when no translation and no displayName', () => {
    const result = getClaimLabelKey(t, 'nonExistentClaimXyz123')
    expect(result).toBe('nonExistentClaimXyz123')
  })
})

describe('getCountryName', () => {
  it('should return the country name for a known cca2 code', () => {
    const sample = countries[0]
    expect(getCountryName(sample.cca2)).toBe(sample.name)
  })

  it('should fall back to the code itself when the code is unknown', () => {
    expect(getCountryName('ZZ')).toBe('ZZ')
  })

  it('should fall back to an empty string input unchanged', () => {
    expect(getCountryName('')).toBe('')
  })
})
