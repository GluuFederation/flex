import { renderHook, waitFor } from '@testing-library/react'
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
} from 'Plugins/auth-server/components/Clients/hooks/useClientApi'

const mockClients = [
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
]

const mockMutate = jest.fn()
const mockInvalidateQueries = jest.fn()

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
  usePostOauthOpenidClient: jest.fn(() => ({
    mutate: mockMutate,
    isPending: false,
  })),
  usePutOauthOpenidClient: jest.fn(() => ({
    mutate: mockMutate,
    isPending: false,
  })),
  useDeleteOauthOpenidClientByInum: jest.fn(() => ({
    mutate: mockMutate,
    isPending: false,
  })),
  getGetOauthOpenidClientsQueryKey: jest.fn(() => ['oauth-openid-clients']),
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
  })

  describe('useUpdateClient', () => {
    it('returns mutation function', () => {
      const { result } = renderHook(() => useUpdateClient(), { wrapper })

      expect(result.current.mutate).toBeDefined()
      expect(result.current.isPending).toBe(false)
    })
  })

  describe('useDeleteClient', () => {
    it('returns mutation function', () => {
      const { result } = renderHook(() => useDeleteClient(), { wrapper })

      expect(result.current.mutate).toBeDefined()
      expect(result.current.isPending).toBe(false)
    })
  })
})
