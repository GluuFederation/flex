import { renderHook, act } from '@testing-library/react'

const mockNavigate = jest.fn()

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}))

import { useAppNavigation, ROUTES } from '../navigation'

describe('navigation', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
  })

  describe('ROUTES', () => {
    it('exposes the core app routes', () => {
      expect(ROUTES.PROFILE).toBe('/profile')
      expect(ROUTES.LOGOUT).toBe('/admin/logout')
      expect(ROUTES.ROOT).toBe('/')
      expect(ROUTES.WILDCARD).toBe('/*')
    })
  })

  describe('useAppNavigation', () => {
    it('navigateToRoute forwards the route and options to navigate', () => {
      const { result } = renderHook(() => useAppNavigation())
      act(() => {
        result.current.navigateToRoute('/profile', { replace: true })
      })
      expect(mockNavigate).toHaveBeenCalledWith('/profile', { replace: true })
    })

    it('navigateBack goes back one entry when history has depth', () => {
      const original = window.history.length
      Object.defineProperty(window.history, 'length', { value: 3, configurable: true })
      const { result } = renderHook(() => useAppNavigation())
      act(() => {
        result.current.navigateBack('/fallback')
      })
      expect(mockNavigate).toHaveBeenCalledWith(-1)
      Object.defineProperty(window.history, 'length', { value: original, configurable: true })
    })

    it('navigateBack uses the fallback route when there is no history', () => {
      const original = window.history.length
      Object.defineProperty(window.history, 'length', { value: 1, configurable: true })
      const { result } = renderHook(() => useAppNavigation())
      act(() => {
        result.current.navigateBack('/fallback')
      })
      expect(mockNavigate).toHaveBeenCalledWith('/fallback', undefined)
      Object.defineProperty(window.history, 'length', { value: original, configurable: true })
    })

    it('navigateBack does nothing without history or a fallback', () => {
      const original = window.history.length
      Object.defineProperty(window.history, 'length', { value: 1, configurable: true })
      const { result } = renderHook(() => useAppNavigation())
      act(() => {
        result.current.navigateBack()
      })
      expect(mockNavigate).not.toHaveBeenCalled()
      Object.defineProperty(window.history, 'length', { value: original, configurable: true })
    })

    it('exposes the raw navigate function', () => {
      const { result } = renderHook(() => useAppNavigation())
      expect(result.current.navigate).toBe(mockNavigate)
    })
  })
})
