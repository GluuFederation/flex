import React from 'react'
import { renderHook } from '@testing-library/react'
import { Provider } from 'react-redux'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { useMauStats } from '../useMauStats'
import { createDate } from '@/utils/dayjsUtils'
import type { JsonNode, GetStatParams } from 'JansConfigApi'
import type { MauStatEntry, MauDateRange } from '../../types'

type StatSelect = (data: JsonNode[]) => MauStatEntry[]
type StatOptions = { query: { enabled: boolean; select: StatSelect } }

const mockUseGetStat = jest.fn()

jest.mock('JansConfigApi', () => ({
  useGetStat: (params: GetStatParams, options: StatOptions) => mockUseGetStat(params, options),
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

const dateRange: MauDateRange = {
  startDate: createDate('2024-01-15'),
  endDate: createDate('2024-02-15'),
}

const rawTwoMonths: JsonNode[] = [
  {
    month: 202401,
    monthly_active_users: 10,
    token_count_per_granttype: {
      client_credentials: { access_token: 5 },
      authorization_code: { access_token: 3, id_token: 2 },
    },
  },
  {
    month: 202402,
    monthly_active_users: 20,
    token_count_per_granttype: {
      client_credentials: { access_token: 5 },
      authorization_code: { access_token: 3, id_token: 2 },
    },
  },
]

describe('useMauStats', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('formats the date range into start_month and end_month params', () => {
    mockUseGetStat.mockImplementation((_params, options: StatOptions) => ({
      data: options.query.select(rawTwoMonths),
    }))

    const store = buildStore(true)
    renderHook(() => useMauStats(dateRange), { wrapper: createWrapper(store) })

    expect(mockUseGetStat.mock.calls[0][0]).toEqual({
      start_month: '202401',
      end_month: '202402',
    })
  })

  it('transforms the API response and computes the summary', () => {
    mockUseGetStat.mockImplementation((_params, options: StatOptions) => ({
      data: options.query.select(rawTwoMonths),
    }))

    const store = buildStore(true)
    const { result } = renderHook(() => useMauStats(dateRange), { wrapper: createWrapper(store) })

    expect(result.current.data).toHaveLength(2)
    expect(result.current.summary.totalMau).toBe(30)
    // 2 * (5 + 3 + 2) = 20
    expect(result.current.summary.totalTokens).toBe(20)
    expect(result.current.summary.clientCredentialsTokens).toBe(10)
    // second-half mau (20) vs first-half mau (10) => +100%
    expect(result.current.summary.mauChange).toBe(100)
  })

  it('returns a zeroed summary when data is empty', () => {
    mockUseGetStat.mockImplementation(() => ({ data: [] }))

    const store = buildStore(true)
    const { result } = renderHook(() => useMauStats(dateRange), { wrapper: createWrapper(store) })

    expect(result.current.data).toHaveLength(0)
    expect(result.current.summary.totalMau).toBe(0)
    expect(result.current.summary.mauChange).toBe(0)
  })

  it('is disabled when there is no session', () => {
    mockUseGetStat.mockImplementation(() => ({ data: undefined }))

    const store = buildStore(false)
    renderHook(() => useMauStats(dateRange), { wrapper: createWrapper(store) })

    expect(mockUseGetStat.mock.calls[0][1].query.enabled).toBe(false)
  })

  it('is disabled when explicitly disabled', () => {
    mockUseGetStat.mockImplementation(() => ({ data: undefined }))

    const store = buildStore(true)
    renderHook(() => useMauStats(dateRange, { enabled: false }), {
      wrapper: createWrapper(store),
    })

    expect(mockUseGetStat.mock.calls[0][1].query.enabled).toBe(false)
  })

  it('is enabled with a session and a valid date range', () => {
    mockUseGetStat.mockImplementation((_params, options: StatOptions) => ({
      data: options.query.select(rawTwoMonths),
    }))

    const store = buildStore(true)
    renderHook(() => useMauStats(dateRange), { wrapper: createWrapper(store) })

    expect(mockUseGetStat.mock.calls[0][1].query.enabled).toBe(true)
  })
})
