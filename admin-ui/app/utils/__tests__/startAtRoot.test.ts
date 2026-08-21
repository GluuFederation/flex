import { resolveStartPath, startAtRoot } from '../startAtRoot'
import { ROUTES } from '@/helpers/navigation'

const BASE = '/admin/'

describe('resolveStartPath', () => {
  it('leaves the base path alone, with or without its trailing slash', () => {
    expect(resolveStartPath(BASE, '/admin/', '', '')).toBeNull()
    expect(resolveStartPath(BASE, '/admin', '', '')).toBeNull()
  })

  it('sends a deep route back to the base path', () => {
    expect(resolveStartPath(BASE, '/admin/home/policystores', '', '')).toBe('/admin/')
  })

  it('keeps the query and hash so an auth callback survives the rewrite', () => {
    expect(resolveStartPath(BASE, '/admin/home/dashboard', '?code=abc&state=xyz', '#s')).toBe(
      '/admin/?code=abc&state=xyz#s',
    )
  })

  it('leaves the logout route alone', () => {
    expect(resolveStartPath(BASE, ROUTES.LOGOUT, '', '')).toBeNull()
  })

  it('accepts a base path given without a trailing slash', () => {
    expect(resolveStartPath('/admin', '/admin/home/health', '', '')).toBe('/admin/')
  })
})

describe('startAtRoot', () => {
  const replaceState = jest.spyOn(window.history, 'replaceState')

  afterEach(() => {
    window.history.replaceState(null, '', BASE)
    replaceState.mockClear()
  })

  afterAll(() => {
    replaceState.mockRestore()
  })

  it('rewrites the address bar when the page loads on a deep route', () => {
    window.history.replaceState(null, '', '/admin/home/policystores')
    replaceState.mockClear()

    startAtRoot(BASE)

    expect(replaceState).toHaveBeenCalledWith(null, '', BASE)
    expect(window.location.pathname).toBe(BASE)
  })

  it('does nothing when the page already loaded on the base path', () => {
    startAtRoot(BASE)

    expect(replaceState).not.toHaveBeenCalled()
  })
})
