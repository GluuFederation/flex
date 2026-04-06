import { generateLabel } from './helpers'

describe('generateLabel', () => {
  it('title-cases camelCase keys without lowercasing inner words', () => {
    expect(generateLabel('rotateDeviceSecret')).toBe('Rotate Device Secret')
    expect(generateLabel('dcrAuthorizationWithClientCredentials')).toBe(
      'Dcr Authorization With Client Credentials',
    )
    expect(generateLabel('useLocalCache')).toBe('Use Local Cache')
  })

  it('handles empty input', () => {
    expect(generateLabel('')).toBe('')
  })
})
