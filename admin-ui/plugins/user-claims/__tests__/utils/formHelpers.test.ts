import {
  getInitialAttributeValues,
  getDefaultFormValues,
  getDefaultAttributeItem,
  computeModifiedFields,
  transformFormValuesToAttribute,
  hasFormChanged,
  isFormValid,
  getInitialValidationState,
} from 'Plugins/user-claims/utils/formHelpers'
import type { TestAttributeItem, TestFormValues } from '../types/testTypes'

const makeItem = (overrides?: Partial<TestAttributeItem>): TestAttributeItem => ({
  name: '',
  displayName: '',
  description: '',
  status: '',
  dataType: '',
  editType: [],
  viewType: [],
  jansHideOnDiscovery: false,
  oxMultiValuedAttribute: false,
  attributeValidation: { maxLength: null, regexp: null, minLength: null },
  scimCustomAttr: false,
  claimName: '',
  saml1Uri: '',
  saml2Uri: '',
  custom: false,
  required: false,
  ...overrides,
})

const makeFormValues = (overrides?: Partial<TestFormValues>): TestFormValues => ({
  name: 'test',
  displayName: 'Test',
  description: 'desc',
  status: 'ACTIVE',
  dataType: 'STRING',
  editType: ['ADMIN'],
  viewType: ['ADMIN'],
  usageType: ['OPENID'],
  jansHideOnDiscovery: false,
  oxMultiValuedAttribute: false,
  attributeValidation: { maxLength: null, regexp: null, minLength: null },
  scimCustomAttr: false,
  claimName: '',
  saml1Uri: '',
  saml2Uri: '',
  maxLength: null,
  minLength: null,
  regexp: null,
  ...overrides,
})

describe('getInitialAttributeValues', () => {
  it('returns correct defaults for empty attribute', () => {
    const item = makeItem()
    const result = getInitialAttributeValues(
      item as Parameters<typeof getInitialAttributeValues>[0],
    )
    expect(result.name).toBe('')
    expect(result.displayName).toBe('')
    expect(result.jansHideOnDiscovery).toBe(false)
    expect(result.oxMultiValuedAttribute).toBe(false)
    expect(result.scimCustomAttr).toBe(false)
    expect(result.maxLength).toBeNull()
    expect(result.minLength).toBeNull()
    expect(result.regexp).toBeNull()
  })
})

describe('getDefaultFormValues', () => {
  it('returns object with all expected keys', () => {
    const result = getDefaultFormValues()
    expect(result).toHaveProperty('name')
    expect(result).toHaveProperty('displayName')
    expect(result).toHaveProperty('description')
    expect(result).toHaveProperty('status')
    expect(result).toHaveProperty('dataType')
    expect(result).toHaveProperty('editType')
    expect(result).toHaveProperty('viewType')
    expect(result).toHaveProperty('usageType')
    expect(result).toHaveProperty('jansHideOnDiscovery')
    expect(result).toHaveProperty('oxMultiValuedAttribute')
    expect(result).toHaveProperty('attributeValidation')
    expect(result).toHaveProperty('scimCustomAttr')
    expect(result).toHaveProperty('maxLength')
    expect(result).toHaveProperty('minLength')
    expect(result).toHaveProperty('regexp')
    expect(result.editType).toHaveLength(0)
    expect(result.viewType).toHaveLength(0)
  })
})

describe('getDefaultAttributeItem', () => {
  it('returns object with expected defaults', () => {
    const result = getDefaultAttributeItem()
    expect(result.name).toBe('')
    expect(result.displayName).toBe('')
    expect(result.custom).toBe(false)
    expect(result.required).toBe(false)
    expect(result.editType).toHaveLength(0)
    expect(result.viewType).toHaveLength(0)
    expect(result.attributeValidation).toEqual({ maxLength: null, regexp: null, minLength: null })
  })
})

describe('computeModifiedFields', () => {
  it('returns empty for identical values', () => {
    const values = makeFormValues()
    const result = computeModifiedFields(
      values as Parameters<typeof computeModifiedFields>[0],
      values as Parameters<typeof computeModifiedFields>[1],
    )
    expect(Object.keys(result)).toHaveLength(0)
  })

  it('detects changed string fields', () => {
    const initial = makeFormValues()
    const updated = makeFormValues({ name: 'changed' })
    const result = computeModifiedFields(
      initial as Parameters<typeof computeModifiedFields>[0],
      updated as Parameters<typeof computeModifiedFields>[1],
    )
    expect(result.name).toBe('changed')
  })

  it('detects changed arrays', () => {
    const initial = makeFormValues({ editType: ['ADMIN'] })
    const updated = makeFormValues({ editType: ['ADMIN', 'USER'] })
    const result = computeModifiedFields(
      initial as Parameters<typeof computeModifiedFields>[0],
      updated as Parameters<typeof computeModifiedFields>[1],
    )
    expect(result.editType).toEqual(['ADMIN', 'USER'])
  })

  it('detects changed booleans', () => {
    const initial = makeFormValues({ jansHideOnDiscovery: false })
    const updated = makeFormValues({ jansHideOnDiscovery: true })
    const result = computeModifiedFields(
      initial as Parameters<typeof computeModifiedFields>[0],
      updated as Parameters<typeof computeModifiedFields>[1],
    )
    expect(result.jansHideOnDiscovery).toBe(true)
  })
})

describe('transformFormValuesToAttribute', () => {
  it('applies validation when enabled', () => {
    const item = makeItem()
    const values = makeFormValues({ maxLength: 100, minLength: 5, regexp: '^[a-z]+$' })
    const result = transformFormValuesToAttribute(
      item as Parameters<typeof transformFormValuesToAttribute>[0],
      values as Parameters<typeof transformFormValuesToAttribute>[1],
      true,
    )
    expect(result.attributeValidation.maxLength).toBe(100)
    expect(result.attributeValidation.minLength).toBe(5)
    expect(result.attributeValidation.regexp).toBe('^[a-z]+$')
  })

  it('clears validation when disabled', () => {
    const item = makeItem()
    const values = makeFormValues({ maxLength: 100, minLength: 5 })
    const result = transformFormValuesToAttribute(
      item as Parameters<typeof transformFormValuesToAttribute>[0],
      values as Parameters<typeof transformFormValuesToAttribute>[1],
      false,
    )
    expect(result.attributeValidation.maxLength).toBeNull()
    expect(result.attributeValidation.minLength).toBeNull()
    expect(result.attributeValidation.regexp).toBeNull()
  })
})

describe('hasFormChanged', () => {
  it('returns false for identical values', () => {
    const values = makeFormValues()
    const result = hasFormChanged(
      values as Parameters<typeof hasFormChanged>[0],
      values as Parameters<typeof hasFormChanged>[1],
    )
    expect(result).toBe(false)
  })

  it('returns true for different values', () => {
    const initial = makeFormValues()
    const changed = makeFormValues({ name: 'different' })
    const result = hasFormChanged(
      initial as Parameters<typeof hasFormChanged>[0],
      changed as Parameters<typeof hasFormChanged>[1],
    )
    expect(result).toBe(true)
  })
})

describe('isFormValid', () => {
  it('returns false when errors exist', () => {
    const values = makeFormValues()
    const errors = { name: 'required' }
    const result = isFormValid(values as Parameters<typeof isFormValid>[0], errors, true)
    expect(result).toBe(false)
  })

  it('returns false when required field is empty', () => {
    const values = makeFormValues({ name: '' })
    const result = isFormValid(values as Parameters<typeof isFormValid>[0], {}, true)
    expect(result).toBe(false)
  })

  it('returns true when valid', () => {
    const values = makeFormValues({
      name: 'test',
      displayName: 'Test',
      description: 'desc',
      status: 'ACTIVE',
      dataType: 'STRING',
      editType: ['ADMIN'],
      viewType: ['ADMIN'],
    })
    const result = isFormValid(values as Parameters<typeof isFormValid>[0], {}, true)
    expect(result).toBe(true)
  })
})

describe('getInitialValidationState', () => {
  it('returns false when no validation', () => {
    const item = makeItem({
      attributeValidation: { maxLength: null, minLength: null, regexp: null },
    })
    const result = getInitialValidationState(
      item as Parameters<typeof getInitialValidationState>[0],
    )
    expect(result).toBe(false)
  })

  it('returns true when has maxLength', () => {
    const item = makeItem({
      attributeValidation: { maxLength: 100, minLength: null, regexp: null },
    })
    const result = getInitialValidationState(
      item as Parameters<typeof getInitialValidationState>[0],
    )
    expect(result).toBe(true)
  })

  it('returns true when has minLength', () => {
    const item = makeItem({ attributeValidation: { maxLength: null, minLength: 5, regexp: null } })
    const result = getInitialValidationState(
      item as Parameters<typeof getInitialValidationState>[0],
    )
    expect(result).toBe(true)
  })

  it('returns true when has regexp', () => {
    const item = makeItem({
      attributeValidation: { maxLength: null, minLength: null, regexp: '^[a-z]+$' },
    })
    const result = getInitialValidationState(
      item as Parameters<typeof getInitialValidationState>[0],
    )
    expect(result).toBe(true)
  })
})
