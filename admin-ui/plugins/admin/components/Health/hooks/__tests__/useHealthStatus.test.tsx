import React from 'react'
import { renderHook } from '@testing-library/react'
import { Provider } from 'react-redux'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { useHealthStatus } from '../useHealthStatus'
import type { JsonNode } from 'JansConfigApi'
import type { ServiceHealth } from '../../types'

type ServiceStatusSelect = (data: JsonNode | undefined) => ServiceHealth[]
type ServiceStatusOptions = { query: { enabled: boolean; select: ServiceStatusSelect } }

const mockUseGetServiceStatus = jest.fn()

jest.mock('JansConfigApi', () => ({
  useGetServiceStatus: (params: undefined, options: ServiceStatusOptions) =>
    mockUseGetServiceStatus(params, options),
}))

const buildStore = (hasSession = true) =>
  configureStore({
    reducer: combineReducers({
      authReducer: (state = { hasSession }) => state,
      noReducer: (state = {}) => state,
    }),
  })

const createWrapper = (store: ReturnType<typeof buildStore>) => {
  return ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  )
}

// Mimic react-query by running the caller-provided `select` over the raw payload.
const buildQueryResult = (rawData: JsonNode | undefined, options: ServiceStatusOptions) => ({
  data: rawData === undefined ? undefined : options.query.select(rawData),
  isLoading: false,
  isFetching: false,
  isError: false,
  error: null,
  refetch: jest.fn(),
})

describe('useHealthStatus', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('transforms, normalizes, sorts and excludes services', () => {
    const raw: JsonNode = {
      'jans-auth': 'running',
      'jans-config-api': 'down',
      'jans-fido2': 'degraded',
      'jans-link': 'running',
    }
    mockUseGetServiceStatus.mockImplementation((_params, options: ServiceStatusOptions) =>
      buildQueryResult(raw, options),
    )

    const store = buildStore(true)
    const { result } = renderHook(() => useHealthStatus(), { wrapper: createWrapper(store) })

    // jans-link is excluded from the health page list
    const names = result.current.services.map((s) => s.name)
    expect(names).not.toContain('jans-link')
    // up sorts before degraded which sorts before down
    expect(result.current.services[0].status).toBe('up')
    expect(result.current.services[result.current.services.length - 1].status).toBe('down')
    // allServices still contains the excluded entry
    expect(result.current.allServices.map((s) => s.name)).toContain('jans-link')
  })

  it('counts healthy and total services from the filtered list', () => {
    const raw: JsonNode = {
      'jans-auth': 'running',
      'jans-config-api': 'running',
      'jans-fido2': 'down',
    }
    mockUseGetServiceStatus.mockImplementation((_params, options: ServiceStatusOptions) =>
      buildQueryResult(raw, options),
    )

    const store = buildStore(true)
    const { result } = renderHook(() => useHealthStatus(), { wrapper: createWrapper(store) })

    expect(result.current.totalCount).toBe(3)
    expect(result.current.healthyCount).toBe(2)
  })

  it('enables the query only when a session is present', () => {
    mockUseGetServiceStatus.mockImplementation((_params, options: ServiceStatusOptions) =>
      buildQueryResult(undefined, options),
    )

    const store = buildStore(false)
    renderHook(() => useHealthStatus(), { wrapper: createWrapper(store) })

    expect(mockUseGetServiceStatus.mock.calls[0][1].query.enabled).toBe(false)
  })

  it('returns empty collections when there is no data', () => {
    mockUseGetServiceStatus.mockImplementation((_params, options: ServiceStatusOptions) =>
      buildQueryResult(undefined, options),
    )

    const store = buildStore(true)
    const { result } = renderHook(() => useHealthStatus(), { wrapper: createWrapper(store) })

    expect(result.current.services).toHaveLength(0)
    expect(result.current.allServices).toHaveLength(0)
    expect(result.current.totalCount).toBe(0)
    expect(result.current.healthyCount).toBe(0)
  })
})
