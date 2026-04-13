import { getAttributeValidationSchema } from 'Plugins/user-claims/utils/validation'
import type { TestFormData } from '../types/testTypes'

const makeValidData = (overrides?: Partial<TestFormData>): TestFormData => ({
  name: 'testAttr',
  displayName: 'Test Attribute',
  description: 'A test attribute',
  status: 'ACTIVE',
  dataType: 'STRING',
  editType: ['ADMIN'],
  viewType: ['ADMIN'],
  usageType: ['OPENID'],
  jansHideOnDiscovery: false,
  oxMultiValuedAttribute: false,
  scimCustomAttr: false,
  attributeValidation: { maxLength: null, regexp: null, minLength: null },
  maxLength: null,
  minLength: null,
  regexp: null,
  claimName: null,
  saml1Uri: null,
  saml2Uri: null,
  ...overrides,
})

describe('getAttributeValidationSchema', () => {
  it('passes with valid data', async () => {
    const schema = getAttributeValidationSchema(true)
    const data = makeValidData()
    const result = (await schema.validate(data)) as TestFormData
    expect(result.name).toBe('testAttr')
  })

  it('fails when name is empty', async () => {
    const schema = getAttributeValidationSchema(true)
    const data = makeValidData({ name: '' })
    await expect(schema.validate(data)).rejects.toThrow()
  })

  it('fails when displayName is empty', async () => {
    const schema = getAttributeValidationSchema(true)
    const data = makeValidData({ displayName: '' })
    await expect(schema.validate(data)).rejects.toThrow()
  })

  describe('when validation enabled', () => {
    it('fails when minLength is greater than maxLength', async () => {
      const schema = getAttributeValidationSchema(true)
      const data = makeValidData({ maxLength: 5, minLength: 10 })
      await expect(schema.validate(data)).rejects.toThrow()
    })

    it('fails when minLength is negative', async () => {
      const schema = getAttributeValidationSchema(true)
      const data = makeValidData({ minLength: -1 })
      await expect(schema.validate(data)).rejects.toThrow()
    })
  })

  describe('when validation disabled', () => {
    it('does not check minLength and maxLength constraints', async () => {
      const schema = getAttributeValidationSchema(false)
      const data = makeValidData({ maxLength: 5, minLength: 10 })
      const result = (await schema.validate(data)) as TestFormData
      expect(result.maxLength).toBe(5)
      expect(result.minLength).toBe(10)
    })
  })
})
