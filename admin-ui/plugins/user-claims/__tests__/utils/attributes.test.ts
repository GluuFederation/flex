import scopes from 'Plugins/user-claims/utils/attributes'

describe('attributes', () => {
  it('default export is an array', () => {
    expect(Array.isArray(scopes)).toBe(true)
  })

  it('scopes array is not empty', () => {
    expect(scopes.length).toBeGreaterThan(0)
  })

  it('each scope has required properties', () => {
    scopes.forEach((scope) => {
      expect(scope).toHaveProperty('name')
      expect(scope).toHaveProperty('inum')
      expect(scope).toHaveProperty('displayName')
    })
  })
})
