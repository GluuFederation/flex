import * as ApiResources from '@/utils/ApiResources'

describe('ApiResources', () => {
  it('exposes the expected resource-name string constants', () => {
    expect(ApiResources.SCOPE).toBe('scope')
    expect(ApiResources.ATTRIBUTE).toBe('attribute')
    expect(ApiResources.SCRIPT).toBe('script')
    expect(ApiResources.JSON_CONFIG).toBe('json_properties')
    expect(ApiResources.SETTINGS).toBe('settings')
    expect(ApiResources.CACHE).toBe('cache')
    expect(ApiResources.AUTHN).toBe('authn')
    expect(ApiResources.SSA).toBe('ssa')
    expect(ApiResources.WEBHOOK).toBe('webhook')
    expect(ApiResources.ASSET).toBe('asset')
  })

  it('keeps every resource name unique', () => {
    const values = [
      ApiResources.SCOPE,
      ApiResources.ATTRIBUTE,
      ApiResources.SCRIPT,
      ApiResources.JSON_CONFIG,
      ApiResources.SETTINGS,
      ApiResources.CACHE,
      ApiResources.AUTHN,
      ApiResources.SSA,
      ApiResources.WEBHOOK,
      ApiResources.ASSET,
    ]
    expect(new Set(values).size).toBe(values.length)
  })
})
