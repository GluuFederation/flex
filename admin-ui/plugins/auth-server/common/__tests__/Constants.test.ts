import { SCOPE_TYPES } from 'Plugins/auth-server/common/Constants'

describe('auth-server Constants', () => {
  it('exposes the expected scope types', () => {
    expect(SCOPE_TYPES).toEqual({
      OAUTH: 'oauth',
      OPENID: 'openid',
      DYNAMIC: 'dynamic',
      UMA: 'uma',
      SPONTANEOUS: 'spontaneous',
    })
  })

  it('has exactly five scope type keys', () => {
    expect(Object.keys(SCOPE_TYPES)).toHaveLength(5)
  })
})
