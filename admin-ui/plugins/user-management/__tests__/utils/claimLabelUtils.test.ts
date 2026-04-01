import i18next from 'i18next'
import { getClaimLabel, getClaimLabelKey } from 'Plugins/user-management/utils/claimLabelUtils'

const t = i18next.t.bind(i18next)

describe('getClaimLabel', () => {
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
  it('should fall back to displayName when no translation exists', () => {
    const result = getClaimLabelKey(t, 'nonExistentClaimXyz123', 'Fallback Display')
    expect(result).toBe('Fallback Display')
  })

  it('should fall back to name when no translation and no displayName', () => {
    const result = getClaimLabelKey(t, 'nonExistentClaimXyz123')
    expect(result).toBe('nonExistentClaimXyz123')
  })
})
