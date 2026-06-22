import { matchesPattern } from 'Plugins/saml/components/WebsiteSsoServiceProviderList'
import type { TrustRelationship } from 'Plugins/saml/components/hooks'

const provider: TrustRelationship = {
  inum: 'ABC-123',
  displayName: 'My Service Provider',
  enabled: true,
}

describe('matchesPattern', () => {
  it('returns true for an empty pattern (no filtering)', () => {
    expect(matchesPattern(provider, '')).toBe(true)
  })

  it('matches against the inum case-insensitively', () => {
    expect(matchesPattern(provider, 'abc')).toBe(true)
    expect(matchesPattern(provider, 'ABC-123')).toBe(true)
  })

  it('matches against the displayName case-insensitively', () => {
    expect(matchesPattern(provider, 'service')).toBe(true)
    expect(matchesPattern(provider, 'MY SERVICE')).toBe(true)
  })

  it('returns false when the pattern matches neither inum nor displayName', () => {
    expect(matchesPattern(provider, 'nonexistent')).toBe(false)
  })

  it('handles providers with missing fields without throwing', () => {
    expect(matchesPattern({ enabled: false }, 'anything')).toBe(false)
    expect(matchesPattern({ enabled: false }, '')).toBe(true)
  })
})
