import { renderHook } from '@testing-library/react'
import { useJwkApi } from '../../hooks/useJwkApi'
import { mockJwksConfig } from '../fixtures/jwkTestData'

const mockRefetch = jest.fn()
const originalConsoleError = console.error

beforeAll(() => {
  console.error = (...args: Parameters<typeof console.error>) => {
    const msg = String(args[0] ?? '')
    if (msg.includes('Failed to fetch JWKs')) return
    originalConsoleError(...args)
  }
})

afterAll(() => {
  console.error = originalConsoleError
})

jest.mock('JansConfigApi', () => ({
  useGetConfigJwks: jest.fn(() => ({
    data: mockJwksConfig,
    isLoading: false,
    error: null,
    refetch: mockRefetch,
  })),
}))

describe('useJwkApi', () => {
  it('returns jwks data from API', () => {
    const { result } = renderHook(() => useJwkApi())

    expect(result.current.jwks).toEqual(mockJwksConfig)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(result.current.refetch).toBeDefined()
  })

  it('returns loading state', () => {
    const { useGetConfigJwks } = jest.requireMock('JansConfigApi')
    useGetConfigJwks.mockReturnValueOnce({
      data: undefined,
      isLoading: true,
      error: null,
      refetch: mockRefetch,
    })

    const { result } = renderHook(() => useJwkApi())

    expect(result.current.jwks).toBeUndefined()
    expect(result.current.isLoading).toBe(true)
  })

  it('normalizes error to Error instance', () => {
    const { useGetConfigJwks } = jest.requireMock('JansConfigApi')
    useGetConfigJwks.mockReturnValueOnce({
      data: undefined,
      isLoading: false,
      error: 'string error',
      refetch: mockRefetch,
    })

    const { result } = renderHook(() => useJwkApi())

    expect(result.current.error).toBeInstanceOf(Error)
    expect(result.current.error?.message).toBe('string error')
  })

  it('passes through Error instances', () => {
    const originalError = new Error('API failed')
    const { useGetConfigJwks } = jest.requireMock('JansConfigApi')
    useGetConfigJwks.mockReturnValueOnce({
      data: undefined,
      isLoading: false,
      error: originalError,
      refetch: mockRefetch,
    })

    const { result } = renderHook(() => useJwkApi())

    expect(result.current.error).toStrictEqual(originalError)
  })
})
