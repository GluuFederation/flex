import { renderHook, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'react-redux'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import React from 'react'
import {
  useClientList,
  useClientById,
  useCreateClient,
  useUpdateClient,
  useDeleteClient,
  useInvalidateClientQueries,
} from 'Plugins/auth-server/components/Clients/hooks/useClientApi'

const mockMutate = jest.fn()
const mockInvalidateQueries = jest.fn()

let capturedCreateOptions: any = null
let capturedUpdateOptions: any = null
let capturedDeleteOptions: any = null

jest.mock('JansConfigApi', () => ({
  useGetOauthOpenidClients: jest.fn(() => ({
    data: {
      entries: [
        {
          inum: '1801.a0beec01-617b-4607-8a35-3e46ac43deb5',
          clientName: 'Jans Config Api Client',
          displayName: 'Jans Config Api Client',
        },
        {
          inum: '1001.7f0a05b2-0976-475f-8048-50d4cc5e845f',
          clientName: 'oxTrust Admin GUI',
          displayName: 'oxTrust Admin GUI',
        },
        {
          inum: '1202.22bd540e-e14e-4416-a9e9-8076053f7d24',
          clientName: 'SCIM Requesting Party Client',
          displayName: 'SCIM Requesting Party Client',
        },
      ],
      totalEntriesCount: 3,
      entriesCount: 3,
    },
    isLoading: false,
    error: null,
  })),
  usePostOauthOpenidClient: jest.fn((options: any) => {
    capturedCreateOptions = options
    return {
      mutate: mockMutate,
      isPending: false,
    }
  }),
  usePutOauthOpenidClient: jest.fn((options: any) => {
    capturedUpdateOptions = options
    return {
      mutate: mockMutate,
      isPending: false,
    }
  }),
  useDeleteOauthOpenidClientByInum: jest.fn((options: any) => {
    capturedDeleteOptions = options
    return {
      mutate: mockMutate,
      isPending: false,
    }
  }),
  getGetOauthOpenidClientsQueryKey: jest.fn(() => ['oauth-openid-clients']),
}))

const mockDispatch = jest.fn()
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}))

jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  useQueryClient: () => ({
    invalidateQueries: mockInvalidateQueries,
  }),
}))

const store = configureStore({
  reducer: combineReducers({
    authReducer: (state = { permissions: [] }) => state,
    noReducer: (state = {}) => state,
  }),
})

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>{children}</Provider>
  </QueryClientProvider>
)

describe('useClientApi hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    queryClient.clear()
    capturedCreateOptions = null
    capturedUpdateOptions = null
    capturedDeleteOptions = null
  })

  describe('useClientList', () => {
    it('returns client list data', () => {
      const { result } = renderHook(() => useClientList({ limit: 10, startIndex: 0 }), { wrapper })

      expect(result.current.data?.entries).toHaveLength(3)
      expect(result.current.isLoading).toBe(false)
    })
  })

  describe('useClientById', () => {
    it('finds client by inum from list', () => {
      const targetInum = '1801.a0beec01-617b-4607-8a35-3e46ac43deb5'
      const { result } = renderHook(() => useClientById(targetInum), {
        wrapper,
      })

      expect(result.current.data?.inum).toBe(targetInum)
    })

    it('returns undefined for non-existent inum', () => {
      const { result } = renderHook(() => useClientById('non-existent-inum'), {
        wrapper,
      })

      expect(result.current.data).toBeUndefined()
    })
  })

  describe('useCreateClient', () => {
    it('returns mutation function', () => {
      const { result } = renderHook(() => useCreateClient(), { wrapper })

      expect(result.current.mutate).toBeDefined()
      expect(result.current.isPending).toBe(false)
    })

    it('calls onSuccess callback and invalidates queries on success', () => {
      const onSuccess = jest.fn()
      renderHook(() => useCreateClient(onSuccess), { wrapper })

      const mockClientData = { inum: 'new-client', clientName: 'New Client' }
      act(() => {
        capturedCreateOptions.mutation.onSuccess(mockClientData)
      })

      expect(mockDispatch).toHaveBeenCalled()
      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: ['oauth-openid-clients'],
      })
      expect(onSuccess).toHaveBeenCalled()
    })

    it('calls onError callback and dispatches error toast on error', () => {
      const onError = jest.fn()
      renderHook(() => useCreateClient(undefined, onError), { wrapper })

      const mockError = new Error('Create failed')
      act(() => {
        capturedCreateOptions.mutation.onError(mockError)
      })

      expect(mockDispatch).toHaveBeenCalled()
      expect(onError).toHaveBeenCalledWith(mockError)
    })

    it('uses default error message when error has no message', () => {
      const onError = jest.fn()
      renderHook(() => useCreateClient(undefined, onError), { wrapper })

      const mockError = new Error()
      mockError.message = ''
      act(() => {
        capturedCreateOptions.mutation.onError(mockError)
      })

      expect(mockDispatch).toHaveBeenCalled()
      expect(onError).toHaveBeenCalledWith(mockError)
    })
  })

  describe('useUpdateClient', () => {
    it('returns mutation function', () => {
      const { result } = renderHook(() => useUpdateClient(), { wrapper })

      expect(result.current.mutate).toBeDefined()
      expect(result.current.isPending).toBe(false)
    })

    it('calls onSuccess callback and invalidates queries on success', () => {
      const onSuccess = jest.fn()
      renderHook(() => useUpdateClient(onSuccess), { wrapper })

      const mockClientData = { inum: 'updated-client', clientName: 'Updated Client' }
      act(() => {
        capturedUpdateOptions.mutation.onSuccess(mockClientData)
      })

      expect(mockDispatch).toHaveBeenCalled()
      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: ['oauth-openid-clients'],
      })
      expect(onSuccess).toHaveBeenCalled()
    })

    it('calls onError callback and dispatches error toast on error', () => {
      const onError = jest.fn()
      renderHook(() => useUpdateClient(undefined, onError), { wrapper })

      const mockError = new Error('Update failed')
      act(() => {
        capturedUpdateOptions.mutation.onError(mockError)
      })

      expect(mockDispatch).toHaveBeenCalled()
      expect(onError).toHaveBeenCalledWith(mockError)
    })
  })

  describe('useDeleteClient', () => {
    it('returns mutation function', () => {
      const { result } = renderHook(() => useDeleteClient(), { wrapper })

      expect(result.current.mutate).toBeDefined()
      expect(result.current.isPending).toBe(false)
    })

    it('calls onSuccess callback and invalidates queries on success', () => {
      const onSuccess = jest.fn()
      renderHook(() => useDeleteClient(onSuccess), { wrapper })

      act(() => {
        capturedDeleteOptions.mutation.onSuccess()
      })

      expect(mockDispatch).toHaveBeenCalled()
      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: ['oauth-openid-clients'],
      })
      expect(onSuccess).toHaveBeenCalled()
    })

    it('calls onError callback and dispatches error toast on error', () => {
      const onError = jest.fn()
      renderHook(() => useDeleteClient(undefined, onError), { wrapper })

      const mockError = new Error('Delete failed')
      act(() => {
        capturedDeleteOptions.mutation.onError(mockError)
      })

      expect(mockDispatch).toHaveBeenCalled()
      expect(onError).toHaveBeenCalledWith(mockError)
    })
  })

  describe('useInvalidateClientQueries', () => {
    it('returns a function', () => {
      const { result } = renderHook(() => useInvalidateClientQueries(), { wrapper })

      expect(typeof result.current).toBe('function')
    })

    it('calls invalidateQueries with correct query key when invoked', () => {
      const { result } = renderHook(() => useInvalidateClientQueries(), { wrapper })

      result.current()

      expect(mockInvalidateQueries).toHaveBeenCalledTimes(1)
      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: ['oauth-openid-clients'],
      })
    })
  })
})
