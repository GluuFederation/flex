import attributes from 'Plugins/user-claims/utils/attributes'

describe('attributes', () => {
  it('default export is an array', () => {
    expect(Array.isArray(attributes)).toBe(true)
  })

  it('attributes array is not empty', () => {
    expect(attributes.length).toBeGreaterThan(0)
  })

  it('each attribute has required properties', () => {
    attributes.forEach((attribute) => {
      expect(attribute).toHaveProperty('name')
      expect(attribute).toHaveProperty('inum')
      expect(attribute).toHaveProperty('displayName')
    })
  })
})
