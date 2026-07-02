// Messages come from i18n.t(); echo the key back so assertions match on identity
// without depending on the translation bundle.
jest.mock('@/i18n', () => ({
  __esModule: true,
  default: { t: (key: string) => key },
}))

import { getSsaValidationSchema } from 'Plugins/auth-server/components/Ssa/helper/validations'

const schema = getSsaValidationSchema()

const validValues = {
  software_id: 'abc',
  org_id: 'org',
  description: 'a valid description',
  software_roles: ['role-1'],
  grant_types: ['authorization_code'],
  one_time_use: true,
  rotate_ssa: true,
  is_expirable: false,
  expirationDate: null,
}

describe('getSsaValidationSchema', () => {
  it('accepts a fully valid, non-expirable SSA', async () => {
    await expect(schema.isValid(validValues)).resolves.toBe(true)
  })

  it('requires the software id', async () => {
    await expect(schema.validate({ ...validValues, software_id: '' })).rejects.toThrow(
      'validation_messages.software_id_required',
    )
  })

  it('enforces a minimum software id length', async () => {
    await expect(schema.validate({ ...validValues, software_id: 'ab' })).rejects.toThrow(
      'validation_messages.software_id_min_length',
    )
  })

  it('requires the org id', async () => {
    await expect(schema.validate({ ...validValues, org_id: '' })).rejects.toThrow(
      'validation_messages.org_id_required',
    )
  })

  it('enforces a minimum description length', async () => {
    await expect(schema.validate({ ...validValues, description: 'short' })).rejects.toThrow(
      'validation_messages.description_min_length',
    )
  })

  it('requires at least one software role', async () => {
    await expect(schema.validate({ ...validValues, software_roles: [] })).rejects.toThrow(
      'validation_messages.software_roles_min',
    )
  })

  it('requires at least one grant type', async () => {
    await expect(schema.validate({ ...validValues, grant_types: [] })).rejects.toThrow(
      'validation_messages.grant_types_min',
    )
  })

  describe('expiration date rules', () => {
    it('requires an expiration date when the SSA is expirable', async () => {
      await expect(
        schema.validate({ ...validValues, is_expirable: true, expirationDate: null }),
      ).rejects.toThrow('validation_messages.expiration_date_required')
    })

    it('rejects a past expiration date when expirable', async () => {
      await expect(
        schema.validate({
          ...validValues,
          is_expirable: true,
          expirationDate: '2000-01-01',
        }),
      ).rejects.toThrow('validation_messages.expiration_date_future')
    })

    it('accepts a future expiration date when expirable', async () => {
      await expect(
        schema.isValid({
          ...validValues,
          is_expirable: true,
          expirationDate: '2999-01-01',
        }),
      ).resolves.toBe(true)
    })
  })
})
