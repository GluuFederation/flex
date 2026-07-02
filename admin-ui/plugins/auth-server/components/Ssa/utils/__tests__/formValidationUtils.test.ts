import {
  getSsaInitialValues,
  hasFormChanges,
  shouldDisableApplyButton,
} from 'Plugins/auth-server/components/Ssa/utils/formValidationUtils'

describe('getSsaInitialValues', () => {
  it('returns the documented empty defaults', () => {
    expect(getSsaInitialValues()).toEqual({
      software_id: '',
      one_time_use: true,
      org_id: '',
      description: '',
      software_roles: [],
      rotate_ssa: true,
      grant_types: [],
      is_expirable: false,
      expirationDate: null,
    })
  })

  it('returns a fresh object on each call', () => {
    const first = getSsaInitialValues()
    const second = getSsaInitialValues()
    expect(first).not.toBe(second)
    expect(first.software_roles).not.toBe(second.software_roles)
  })
})

describe('hasFormChanges', () => {
  it('is true when the form is dirty', () => {
    expect(hasFormChanges(true, [], {})).toBe(true)
  })

  it('is true when attributes are selected', () => {
    expect(hasFormChanges(false, ['a'], {})).toBe(true)
  })

  it('is true when there are modified fields', () => {
    expect(hasFormChanges(false, [], { name: true })).toBe(true)
  })

  it('is false when nothing has changed', () => {
    expect(hasFormChanges(false, [], {})).toBe(false)
  })
})

describe('shouldDisableApplyButton', () => {
  it('disables while submitting', () => {
    expect(shouldDisableApplyButton(true, true, true, {}, [])).toBe(true)
  })

  it('disables when there are no changes', () => {
    expect(shouldDisableApplyButton(false, false, true, {}, [])).toBe(true)
  })

  it('disables when the form is invalid', () => {
    expect(shouldDisableApplyButton(false, true, false, {}, [])).toBe(true)
  })

  it('enables when there are valid changes and it is not submitting', () => {
    expect(shouldDisableApplyButton(false, true, true, {}, [])).toBe(false)
  })
})
