import React from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { useFirstAuthorizedPath } from '../useFirstAuthorizedPath'
import type { MenuItem } from '@/components/Sidebar'

type HealthService = { name: string; status?: string }

const mockAuthorizeHelper = jest.fn()
const mockUseHealthStatus = jest.fn()
const mockUseFido2HealthStatus = jest.fn()
const mockProcessMenus = jest.fn()
const mockFilterMenusByHealth = jest.fn()
const mockFilterMenusByAuth = jest.fn()
const mockFindFirstLeafPath = jest.fn()

jest.mock('@/cedarling/hooks/useCedarling', () => ({
  useCedarling: () => ({ authorizeHelper: mockAuthorizeHelper }),
}))

jest.mock('Plugins/admin/components/Health/hooks', () => ({
  useHealthStatus: () => mockUseHealthStatus(),
  useFido2HealthStatus: () => mockUseFido2HealthStatus(),
}))

jest.mock('Plugins/PluginMenuResolver', () => ({
  processMenus: () => mockProcessMenus(),
}))

jest.mock('@/utils/menuFilters', () => ({
  filterMenusByHealth: (menus: MenuItem[], services: HealthService[]) =>
    mockFilterMenusByHealth(menus, services),
  filterMenusByAuth: (menus: MenuItem[], helper: typeof mockAuthorizeHelper) =>
    mockFilterMenusByAuth(menus, helper),
  findFirstLeafPath: (menus: MenuItem[]) => mockFindFirstLeafPath(menus),
}))

const buildStore = (initialized = true) =>
  configureStore({
    reducer: combineReducers({
      cedarPermissions: (state = { initialized }) => state,
    }),
  })

const createWrapper = (store: ReturnType<typeof buildStore>) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  )
  return Wrapper
}

const menus: MenuItem[] = [{ title: 'Home', path: '/home' }]

describe('useFirstAuthorizedPath', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseHealthStatus.mockReturnValue({ allServices: [{ name: 'oxauth', status: 'up' }] })
    mockUseFido2HealthStatus.mockReturnValue({ data: undefined })
    mockProcessMenus.mockResolvedValue(menus)
    mockFilterMenusByHealth.mockImplementation((m: MenuItem[]) => m)
    mockFilterMenusByAuth.mockResolvedValue(menus)
    mockFindFirstLeafPath.mockReturnValue('/home')
  })

  it('starts in a loading state with a null path', () => {
    const store = buildStore(false)
    const { result } = renderHook(() => useFirstAuthorizedPath(), {
      wrapper: createWrapper(store),
    })

    expect(result.current.loading).toBe(true)
    expect(result.current.path).toBeNull()
  })

  it('resolves the first authorized leaf path once initialized and services are ready', async () => {
    const store = buildStore(true)
    const { result } = renderHook(() => useFirstAuthorizedPath(), {
      wrapper: createWrapper(store),
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    expect(result.current.path).toBe('/home')
    expect(mockFilterMenusByAuth).toHaveBeenCalledWith(menus, mockAuthorizeHelper)
  })

  it('does not resolve while cedar permissions are not initialized', async () => {
    const store = buildStore(false)
    renderHook(() => useFirstAuthorizedPath(), { wrapper: createWrapper(store) })

    await Promise.resolve()
    expect(mockProcessMenus).not.toHaveBeenCalled()
  })

  it('does not resolve while no services are ready', async () => {
    mockUseHealthStatus.mockReturnValue({ allServices: [] })
    mockUseFido2HealthStatus.mockReturnValue({ data: undefined })
    const store = buildStore(true)
    renderHook(() => useFirstAuthorizedPath(), { wrapper: createWrapper(store) })

    await Promise.resolve()
    expect(mockProcessMenus).not.toHaveBeenCalled()
  })

  it('includes fido2 health data in the combined services passed to the health filter', async () => {
    const fido2 = { name: 'fido2', status: 'up' }
    mockUseFido2HealthStatus.mockReturnValue({ data: fido2 })
    const store = buildStore(true)
    const { result } = renderHook(() => useFirstAuthorizedPath(), {
      wrapper: createWrapper(store),
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    expect(mockFilterMenusByHealth).toHaveBeenCalledWith(menus, expect.arrayContaining([fido2]))
  })

  it('returns a null path when no leaf path can be resolved', async () => {
    mockFindFirstLeafPath.mockReturnValue(null)
    const store = buildStore(true)
    const { result } = renderHook(() => useFirstAuthorizedPath(), {
      wrapper: createWrapper(store),
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    expect(result.current.path).toBeNull()
  })
})
