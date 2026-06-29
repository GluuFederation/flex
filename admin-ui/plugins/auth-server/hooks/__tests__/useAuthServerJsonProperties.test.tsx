import React from 'react'
import { renderHook, act, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { UserAction } from 'Utils/types'
import type { AppConfiguration } from 'Plugins/auth-server/components/AuthServerProperties/types'
import {
  useAuthServerJsonPropertiesQuery,
  usePatchAuthServerJsonPropertiesMutation,
  authServerJsonPropertiesQueryKey,
} from 'Plugins/auth-server/hooks/useAuthServerJsonProperties'

const mockDispatch = jest.fn()
const mockFetch = jest.fn()
const mockPatch = jest.fn()
const mockUpdateToast = jest.fn((show: boolean, type: string) => ({
  type: 'toast',
  payload: { show, type },
}))

jest.mock('@/redux/hooks', () => ({
  useAppDispatch: () => mockDispatch,
}))

jest.mock('Redux/features/toastSlice', () => ({
  updateToast: (show: boolean, type: string) => mockUpdateToast(show, type),
}))

jest.mock('Plugins/auth-server/services/jsonPropertiesService', () => ({
  fetchAuthServerJsonProperties: () => mockFetch(),
  patchAuthServerJsonProperties: (action: UserAction) => mockPatch(action),
}))

const config: AppConfiguration = { issuer: 'https://issuer' } as AppConfiguration

const userAction: UserAction = {
  action_message: 'patched',
  action_data: null,
}

const createWrapper = (queryClient: QueryClient) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
  return Wrapper
}

const newClient = () => new QueryClient({ defaultOptions: { queries: { retry: false } } })

describe('useAuthServerJsonProperties', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockFetch.mockResolvedValue(config)
    mockPatch.mockResolvedValue(config)
  })

  describe('useAuthServerJsonPropertiesQuery', () => {
    it('fetches and returns json properties', async () => {
      const queryClient = newClient()
      const { result } = renderHook(() => useAuthServerJsonPropertiesQuery(), {
        wrapper: createWrapper(queryClient),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })
      expect(mockFetch).toHaveBeenCalledTimes(1)
      expect(result.current.data).toEqual(config)
    })
  })

  describe('usePatchAuthServerJsonPropertiesMutation', () => {
    it('patches, dispatches a success toast and caches the result on success', async () => {
      const queryClient = newClient()
      const setQueryDataSpy = jest.spyOn(queryClient, 'setQueryData')
      const userOnSuccess = jest.fn()
      const { result } = renderHook(
        () => usePatchAuthServerJsonPropertiesMutation({ onSuccess: userOnSuccess }),
        { wrapper: createWrapper(queryClient) },
      )

      await act(async () => {
        await result.current.mutateAsync(userAction)
      })

      expect(mockPatch).toHaveBeenCalledWith(userAction)
      expect(mockUpdateToast).toHaveBeenCalledWith(true, 'success')
      expect(mockDispatch).toHaveBeenCalled()
      expect(setQueryDataSpy).toHaveBeenCalledWith(authServerJsonPropertiesQueryKey, config)
      expect(userOnSuccess).toHaveBeenCalledTimes(1)
    })

    it('invalidates queries when the patch result is not a plain object', async () => {
      mockPatch.mockResolvedValueOnce(null)
      const queryClient = newClient()
      const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries')
      const { result } = renderHook(() => usePatchAuthServerJsonPropertiesMutation(), {
        wrapper: createWrapper(queryClient),
      })

      await act(async () => {
        await result.current.mutateAsync(userAction)
      })

      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: authServerJsonPropertiesQueryKey })
    })

    it('dispatches an error toast and calls the user onError when the patch fails', async () => {
      const failure = new Error('patch failed')
      mockPatch.mockRejectedValueOnce(failure)
      const queryClient = newClient()
      const userOnError = jest.fn()
      const { result } = renderHook(
        () => usePatchAuthServerJsonPropertiesMutation({ onError: userOnError }),
        { wrapper: createWrapper(queryClient) },
      )

      await act(async () => {
        await expect(result.current.mutateAsync(userAction)).rejects.toThrow('patch failed')
      })

      expect(mockUpdateToast).toHaveBeenCalledWith(true, 'error')
      // Guard against a regression where the hook builds the toast but stops
      // dispatching the error action.
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'toast',
        payload: { show: true, type: 'error' },
      })
      await waitFor(() => {
        expect(userOnError).toHaveBeenCalledTimes(1)
      })
    })
  })
})
