import {
  DEFAULT_ATTRIBUTE_VALIDATION,
  transformToFormValues,
  toJansAttribute,
} from 'Plugins/user-claims/helper/utils'
import type { TestAttribute } from '../types/testTypes'

describe('DEFAULT_ATTRIBUTE_VALIDATION', () => {
  it('has maxLength as undefined', () => {
    expect(DEFAULT_ATTRIBUTE_VALIDATION.maxLength).toBeUndefined()
  })

  it('has regexp as undefined', () => {
    expect(DEFAULT_ATTRIBUTE_VALIDATION.regexp).toBeUndefined()
  })

  it('has minLength as undefined', () => {
    expect(DEFAULT_ATTRIBUTE_VALIDATION.minLength).toBeUndefined()
  })
})

describe('transformToFormValues', () => {
  it('returns defaults for null input', () => {
    const result = transformToFormValues(null)
    expect(result.jansHideOnDiscovery).toBe(false)
    expect(result.scimCustomAttr).toBe(false)
    expect(result.oxMultiValuedAttribute).toBe(false)
    expect(result.custom).toBe(false)
    expect(result.required).toBe(false)
    expect(result.attributeValidation).toEqual(DEFAULT_ATTRIBUTE_VALIDATION)
  })

  it('maps attribute fields correctly', () => {
    const attribute = {
      name: 'testAttr',
      displayName: 'Test Attribute',
      description: 'A test attribute',
      status: 'ACTIVE',
      dataType: 'STRING',
      editType: ['ADMIN'],
      viewType: ['ADMIN'],
      jansHideOnDiscovery: true,
      scimCustomAttr: true,
      oxMultiValuedAttribute: false,
      custom: true,
      required: true,
      attributeValidation: { maxLength: 100, regexp: null, minLength: 1 },
    } as unknown as Parameters<typeof transformToFormValues>[0]

    const result = transformToFormValues(attribute)
    expect(result.name).toBe('testAttr')
    expect(result.displayName).toBe('Test Attribute')
    expect(result.jansHideOnDiscovery).toBe(true)
    expect(result.attributeValidation).toEqual({ maxLength: 100, regexp: null, minLength: 1 })
  })

  it('uses default validation when attribute has no attributeValidation', () => {
    const attribute = {
      name: 'noValidation',
      displayName: 'No Validation',
      description: 'desc',
      status: 'ACTIVE',
      dataType: 'STRING',
      editType: ['ADMIN'],
      viewType: ['ADMIN'],
    } as unknown as Parameters<typeof transformToFormValues>[0]

    const result = transformToFormValues(attribute)
    expect(result.attributeValidation).toEqual(DEFAULT_ATTRIBUTE_VALIDATION)
  })
})

describe('toJansAttribute', () => {
  const makeValues = (overrides?: Partial<TestAttribute>): TestAttribute => ({
    name: 'attr1',
    displayName: 'Attribute 1',
    description: 'desc',
    status: 'ACTIVE',
    dataType: 'STRING',
    editType: ['ADMIN'],
    viewType: ['ADMIN'],
    jansHideOnDiscovery: false,
    scimCustomAttr: false,
    oxMultiValuedAttribute: false,
    custom: false,
    required: false,
    attributeValidation: { maxLength: 50, regexp: '^[a-z]+$', minLength: 2 },
    ...overrides,
  })

  it('preserves values when validation is enabled', () => {
    const values = makeValues()
    const result = toJansAttribute(values as unknown as Parameters<typeof toJansAttribute>[0], true)
    expect(result.name).toBe('attr1')
    expect(result.displayName).toBe('Attribute 1')
    expect(result.attributeValidation).toEqual({ maxLength: 50, regexp: '^[a-z]+$', minLength: 2 })
  })

  it('clears validation when disabled', () => {
    const values = makeValues()
    const result = toJansAttribute(
      values as unknown as Parameters<typeof toJansAttribute>[0],
      false,
    )
    expect(result.name).toBe('attr1')
    expect(result.attributeValidation).toBeUndefined()
  })
})
