import { createElement, isValidElement } from 'react'
import type { ReactNode } from 'react'
import type { TFunction } from 'i18next'
import {
  createClientFieldSection,
  getClientSectionFields,
  uriValidator,
  emailValidator,
  getGrantTypeLabel,
  buildGrantTypeOptions,
  getDynamicListValidationMessage,
  toStringArray,
  mapTranslatedOptions,
  createPassiveSelectFormik,
  toBooleanSelectValue,
  fromBooleanSelectValue,
  mapDynamicListValues,
  appendDynamicListItem,
  extractDnInum,
} from 'Plugins/auth-server/utils/clientUtils'
import type { GluuDynamicListItem } from '@/components/GluuDynamicList'

const t = ((key: string) => key) as TFunction

describe('createClientFieldSection', () => {
  it('wraps the provided field keys', () => {
    expect(createClientFieldSection(['a', 'b'])).toEqual({ fieldKeys: ['a', 'b'] })
  })
})

describe('getClientSectionFields', () => {
  it('returns non-null mapped fields and clones valid elements with a key', () => {
    const element = createElement('span', null, 'hi')
    const fieldMap: Partial<Record<'a' | 'b' | 'c', ReactNode>> = {
      a: element,
      b: 'plain-text',
      c: null,
    }
    const section = createClientFieldSection<'a' | 'b' | 'c'>(['a', 'b', 'c'])
    const result = getClientSectionFields(fieldMap, section)
    expect(result).toHaveLength(2)
    expect(isValidElement(result[0])).toBe(true)
    expect(result[1]).toBe('plain-text')
  })
})

describe('uriValidator', () => {
  it('accepts http and https urls', () => {
    expect(uriValidator('https://example.com')).toBe(true)
    expect(uriValidator('http://localhost:8080/path')).toBe(true)
  })

  it('rejects empty, non-http(s) and malformed urls', () => {
    expect(uriValidator('')).toBe(false)
    expect(uriValidator('   ')).toBe(false)
    expect(uriValidator('ftp://example.com')).toBe(false)
    expect(uriValidator('not a url')).toBe(false)
  })
})

describe('emailValidator', () => {
  it('validates well-formed emails', () => {
    expect(emailValidator('user@example.com')).toBe(true)
    expect(emailValidator('bad-email')).toBe(false)
  })
})

describe('getGrantTypeLabel', () => {
  it('strips the urn grant-type prefix', () => {
    expect(getGrantTypeLabel('urn:ietf:params:oauth:grant-type:uma-ticket')).toBe('uma-ticket')
    expect(getGrantTypeLabel('authorization_code')).toBe('authorization_code')
  })
})

describe('buildGrantTypeOptions', () => {
  it('uses supported when present and dedupes selected values', () => {
    const result = buildGrantTypeOptions(['a', 'b'], ['b', 'c'], ['fallback'])
    expect(result.map((o) => o.value)).toEqual(['a', 'b', 'c'])
  })

  it('falls back when supported is empty', () => {
    const result = buildGrantTypeOptions([], undefined, ['fb'])
    expect(result).toEqual([{ value: 'fb', label: 'fb' }])
  })

  it('labels urn grant types', () => {
    const result = buildGrantTypeOptions(['urn:ietf:params:oauth:grant-type:device_code'], [], [])
    expect(result[0].label).toBe('device_code')
  })
})

describe('getDynamicListValidationMessage', () => {
  it('returns undefined for empty list', () => {
    expect(getDynamicListValidationMessage({ items: [], t })).toBeUndefined()
  })

  it('returns the single-mode required message when a value is blank', () => {
    const items: GluuDynamicListItem[] = [{ id: '1', value: '  ' }]
    expect(getDynamicListValidationMessage({ items, t })).toBe('errors.fido_empty_row_value')
  })

  it('returns the pair-mode required message when key or value blank', () => {
    const items: GluuDynamicListItem[] = [{ id: '1', key: '', value: 'v' }]
    expect(getDynamicListValidationMessage({ items, t, mode: 'pair' })).toBe(
      'errors.fido_empty_row_key_value',
    )
  })

  it('prefers a custom required message', () => {
    const items: GluuDynamicListItem[] = [{ id: '1', value: '' }]
    expect(getDynamicListValidationMessage({ items, t, requiredMessage: 'custom-required' })).toBe(
      'custom-required',
    )
  })

  it('returns undefined when all items are complete and no validator', () => {
    const items: GluuDynamicListItem[] = [{ id: '1', value: 'ok' }]
    expect(getDynamicListValidationMessage({ items, t })).toBeUndefined()
  })

  it('returns the invalid message when validateItem fails', () => {
    const items: GluuDynamicListItem[] = [{ id: '1', value: 'bad' }]
    expect(
      getDynamicListValidationMessage({
        items,
        t,
        validateItem: () => false,
        invalidMessage: 'invalid!',
      }),
    ).toBe('invalid!')
  })

  it('falls back to the default invalid translation key', () => {
    const items: GluuDynamicListItem[] = [{ id: '1', value: 'bad' }]
    expect(getDynamicListValidationMessage({ items, t, validateItem: () => false })).toBe(
      'validation_messages.invalid_pattern',
    )
  })
})

describe('toStringArray', () => {
  it('returns the array or an empty array', () => {
    expect(toStringArray(['a'])).toEqual(['a'])
    expect(toStringArray(undefined)).toEqual([])
  })
})

describe('mapTranslatedOptions', () => {
  it('maps value and translated label', () => {
    const result = mapTranslatedOptions([{ value: 'v', labelKey: 'k' }], (key) => `T:${key}`)
    expect(result).toEqual([{ value: 'v', label: 'T:k' }])
  })
})

describe('createPassiveSelectFormik', () => {
  it('returns a no-op handleChange and the provided handleBlur', () => {
    const handleBlur = jest.fn()
    const formik = createPassiveSelectFormik(handleBlur)
    expect(formik.handleBlur).toBe(handleBlur)
    expect(typeof formik.handleChange).toBe('function')
  })
})

describe('boolean select helpers', () => {
  it('toBooleanSelectValue stringifies truthiness', () => {
    expect(toBooleanSelectValue(true)).toBe('true')
    expect(toBooleanSelectValue(null)).toBe('false')
    expect(toBooleanSelectValue(0)).toBe('false')
  })

  it('fromBooleanSelectValue parses the "true" string', () => {
    expect(fromBooleanSelectValue('true')).toBe(true)
    expect(fromBooleanSelectValue('false')).toBe(false)
  })
})

describe('dynamic list value helpers', () => {
  it('mapDynamicListValues assigns ids to each value', () => {
    const result = mapDynamicListValues(['a', 'b'])
    expect(result).toHaveLength(2)
    expect(result[0].value).toBe('a')
    expect(typeof result[0].id).toBe('string')
  })

  it('appendDynamicListItem appends a new item with a default empty value', () => {
    const current: GluuDynamicListItem[] = [{ id: '1', value: 'a' }]
    const result = appendDynamicListItem(current)
    expect(result).toHaveLength(2)
    expect(result[1].value).toBe('')
  })
})

describe('extractDnInum', () => {
  it('extracts the inum from a DN string', () => {
    expect(extractDnInum('inum=abc-123,ou=clients,o=jans')).toBe('abc-123')
  })

  it('returns null for nullish input', () => {
    expect(extractDnInum(null)).toBeNull()
    expect(extractDnInum(undefined)).toBeNull()
  })
})
