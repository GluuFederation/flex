import { isSafeInternalRoute } from '@/utils/intendedRoute'

describe('isSafeInternalRoute', () => {
  it('accepts same-origin paths with query strings and hashes', () => {
    expect(isSafeInternalRoute('/clients')).toBe(true)
    expect(isSafeInternalRoute('/clients?tab=users')).toBe(true)
    expect(isSafeInternalRoute('/clients?tab=users#details')).toBe(true)
    expect(isSafeInternalRoute('/')).toBe(true)
  })

  it('rejects authority-like routes', () => {
    expect(isSafeInternalRoute('//evil.example')).toBe(false)
    expect(isSafeInternalRoute('/\\evil.example')).toBe(false)
    expect(isSafeInternalRoute('https://evil.example')).toBe(false)
  })

  it('rejects whitespace-prefixed authority-like routes', () => {
    expect(isSafeInternalRoute('/\t//evil.example')).toBe(false)
    expect(isSafeInternalRoute('/\n//evil.example')).toBe(false)
    expect(isSafeInternalRoute('/ //evil.example')).toBe(false)
  })
})
