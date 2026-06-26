import { buildKeyCandidates } from '@/utils/stringUtils'

describe('buildKeyCandidates', () => {
  it('returns the original key plus its lower-first form', () => {
    const result = buildKeyCandidates('Name')
    expect(result).toContain('Name')
    expect(result).toContain('name')
  })

  it('converts camelCase into snake_case variants', () => {
    const result = buildKeyCandidates('firstName')
    expect(result).toContain('firstName')
    expect(result).toContain('first_name')
  })

  it('normalizes spaces and hyphens to underscores in the snake_case variant', () => {
    const result = buildKeyCandidates('First Name-Field')
    expect(result).toContain('first_name_field')
  })

  it('compacts non-alphanumeric runs into underscores for the compact variant', () => {
    const result = buildKeyCandidates('foo.bar/baz')
    expect(result).toContain('foo_bar_baz')
  })

  it('deduplicates identical candidates', () => {
    const result = buildKeyCandidates('name')
    const unique = new Set(result)
    expect(result).toHaveLength(unique.size)
  })

  it('drops falsy candidates produced from an empty key', () => {
    const result = buildKeyCandidates('')
    expect(result).toHaveLength(0)
  })

  it('handles an already-lowercase single-word key', () => {
    expect(buildKeyCandidates('email')).toEqual(['email'])
  })

  it('produces distinct snake and compact forms for mixed separators', () => {
    const result = buildKeyCandidates('User ID')
    expect(result).toContain('user_id')
  })
})
