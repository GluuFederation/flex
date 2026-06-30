import { renderHook, act } from '@testing-library/react'
import setTitle from 'Utils/SetTitle'
import { usePageTitle } from '../usePageTitle'

describe('usePageTitle', () => {
  afterEach(() => {
    delete window.__gluuPageTitle
  })

  it('returns the default title when no stored title exists', () => {
    const { result } = renderHook(() => usePageTitle())
    expect(result.current).toBe('Dashboard')
  })

  it('prefers the stored title over the provided initial title', () => {
    window.__gluuPageTitle = 'Clients'
    const { result } = renderHook(() => usePageTitle('Scopes'))
    expect(result.current).toBe('Clients')
  })

  it('returns the stored page title when one is already set', () => {
    window.__gluuPageTitle = 'Scopes'
    const { result } = renderHook(() => usePageTitle())
    expect(result.current).toBe('Scopes')
  })

  it('updates when a new title is published through setTitle', async () => {
    const { result } = renderHook(() => usePageTitle())
    expect(result.current).toBe('Dashboard')

    await act(async () => {
      setTitle('Users')
      await Promise.resolve()
    })

    expect(result.current).toBe('Users')
  })
})
