import type { TFunction } from 'i18next'
import { getFieldPlaceholder } from '@/utils/placeholderUtils'

describe('getFieldPlaceholder', () => {
  it('builds the placeholder using the lowercased translated label', () => {
    const t = ((key: string, opts?: { field?: string }): string => {
      if (key === 'fields.userName') return 'User Name'
      if (key === 'placeholders.type_value') return `Type ${opts?.field}`
      return key
    }) as TFunction
    expect(getFieldPlaceholder(t, 'fields.userName')).toBe('Type user name')
  })

  it('passes the lowercased label as the field interpolation value', () => {
    const calls: Array<{ key: string; field?: string }> = []
    const t = ((key: string, opts?: { field?: string }): string => {
      calls.push({ key, field: opts?.field })
      if (key === 'label') return 'EMAIL'
      return key
    }) as TFunction
    getFieldPlaceholder(t, 'label')
    expect(calls).toContainEqual({ key: 'placeholders.type_value', field: 'email' })
  })
})
