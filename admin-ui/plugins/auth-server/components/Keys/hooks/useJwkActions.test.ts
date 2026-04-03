import { renderHook, act } from '@testing-library/react'
import { useJwkActions } from './useJwkActions'

const mockNavigateToRoute = jest.fn()

jest.mock('@/helpers/navigation', () => ({
  useAppNavigation: jest.fn(() => ({
    navigateToRoute: mockNavigateToRoute,
  })),
  ROUTES: {
    AUTH_SERVER_CONFIG_KEYS: '/auth-server/config/keys',
  },
}))

describe('useJwkActions', () => {
  beforeEach(() => {
    mockNavigateToRoute.mockClear()
  })

  it('returns navigateToKeysList function', () => {
    const { result } = renderHook(() => useJwkActions())
    expect(result.current.navigateToKeysList).toBeDefined()
  })

  it('navigates to keys list route', () => {
    const { result } = renderHook(() => useJwkActions())

    act(() => {
      result.current.navigateToKeysList()
    })

    expect(mockNavigateToRoute).toHaveBeenCalledWith('/auth-server/config/keys')
  })
})
