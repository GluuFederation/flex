import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import CachePage from 'Plugins/services/Components/Configuration/CachePage'

const mockMutate = jest.fn()

jest.mock('@/cedarling', () => ({
  useCedarling: jest.fn(() => ({
    hasCedarReadPermission: jest.fn(() => true),
    hasCedarWritePermission: jest.fn(() => true),
    authorizeHelper: jest.fn(),
  })),
  ADMIN_UI_RESOURCES: { Cache: 'Cache', Webhooks: 'Webhooks' },
  CEDAR_RESOURCE_SCOPES: { Cache: [], Webhooks: [] },
}))

const mockInMemoryConfig = {
  defaultPutExpiration: 60,
}

const mockMemcachedConfig = {
  servers: 'localhost:11211',
  maxOperationQueueLength: 100000,
  bufferSize: 32768,
  defaultPutExpiration: 60,
  connectionFactoryType: 'DEFAULT',
}

const mockRedisConfig = {
  redisProviderType: 'STANDALONE',
  servers: 'localhost:6379',
  password: '',
  sentinelMasterGroupName: '',
  sslTrustStoreFilePath: '',
  defaultPutExpiration: 60,
  useSSL: false,
  maxIdleConnections: 10,
  maxTotalConnections: 500,
  connectionTimeout: 3000,
  soTimeout: 3000,
  maxRetryAttempts: 5,
}

const mockNativeConfig = {
  defaultPutExpiration: 60,
  defaultCleanupBatchSize: 25,
  deleteExpiredOnGetRequest: false,
}

jest.mock('JansConfigApi', () => ({
  useGetConfigCache: jest.fn(() => ({
    data: { cacheProviderType: 'IN_MEMORY' },
    isLoading: false,
  })),
  useGetConfigCacheInMemory: jest.fn(() => ({
    data: mockInMemoryConfig,
    isLoading: false,
  })),
  useGetConfigCacheMemcached: jest.fn(() => ({
    data: mockMemcachedConfig,
    isLoading: false,
  })),
  useGetConfigCacheNativePersistence: jest.fn(() => ({
    data: mockNativeConfig,
    isLoading: false,
  })),
  useGetConfigCacheRedis: jest.fn(() => ({
    data: mockRedisConfig,
    isLoading: false,
  })),
  usePatchConfigCache: jest.fn(() => ({
    mutateAsync: mockMutate,
    isPending: false,
  })),
  usePutConfigCacheInMemory: jest.fn(() => ({
    mutateAsync: mockMutate,
    isPending: false,
  })),
  usePutConfigCacheMemcached: jest.fn(() => ({
    mutateAsync: mockMutate,
    isPending: false,
  })),
  usePutConfigCacheNativePersistence: jest.fn(() => ({
    mutateAsync: mockMutate,
    isPending: false,
  })),
  usePutConfigCacheRedis: jest.fn(() => ({
    mutateAsync: mockMutate,
    isPending: false,
  })),
  getGetConfigCacheQueryKey: jest.fn(() => ['configCache']),
  useGetWebhooksByFeatureId: jest.fn(() => ({ data: [], isFetching: false, isFetched: true })),
  CacheConfigurationCacheProviderType: {
    IN_MEMORY: 'IN_MEMORY',
    MEMCACHED: 'MEMCACHED',
    REDIS: 'REDIS',
    NATIVE_PERSISTENCE: 'NATIVE_PERSISTENCE',
  },
}))

const store = configureStore({
  reducer: combineReducers({
    authReducer: (state = { permissions: [] }) => state,
    webhookReducer: (
      state = {
        featureWebhooks: [],
        loadingWebhooks: false,
        webhookModal: false,
        triggerWebhookInProgress: false,
      },
    ) => state,
    noReducer: (state = {}) => state,
  }),
})

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <AppTestWrapper>
      <Provider store={store}>{children}</Provider>
    </AppTestWrapper>
  </QueryClientProvider>
)

describe('CachePage', () => {
  beforeEach(() => {
    mockMutate.mockClear()
    queryClient.clear()
    jest.requireMock('@/cedarling').useCedarling.mockImplementation(() => ({
      hasCedarReadPermission: jest.fn(() => true),
      hasCedarWritePermission: jest.fn(() => true),
      authorizeHelper: jest.fn(),
    }))
    jest.requireMock('JansConfigApi').useGetConfigCache.mockImplementation(() => ({
      data: { cacheProviderType: 'IN_MEMORY' },
      isLoading: false,
    }))
  })

  it('renders without crashing', () => {
    render(
      <Wrapper>
        <CachePage />
      </Wrapper>,
    )

    expect(document.querySelector('form')).toBeInTheDocument()
  })

  it('renders cache provider type select', () => {
    render(
      <Wrapper>
        <CachePage />
      </Wrapper>,
    )

    const select = document.querySelector('select[name="cacheProviderType"]')
    expect(select).toBeInTheDocument()
  })

  it('renders IN_MEMORY as default cache provider', () => {
    render(
      <Wrapper>
        <CachePage />
      </Wrapper>,
    )

    const select = document.querySelector('select[name="cacheProviderType"]') as HTMLSelectElement
    expect(select).toBeInTheDocument()
    expect(select.value).toBe('IN_MEMORY')
  })

  it('renders in-memory default put expiration field with correct value', () => {
    render(
      <Wrapper>
        <CachePage />
      </Wrapper>,
    )

    const input = document.querySelector('input[name="memoryDefaultPutExpiration"]')
    expect(input).toBeInTheDocument()
    expect(input).toHaveValue(60)
  })

  it('renders footer with Back, Cancel, and Apply buttons', () => {
    render(
      <Wrapper>
        <CachePage />
      </Wrapper>,
    )

    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /apply/i })).toBeInTheDocument()
  })

  it('renders when user has no read permission', () => {
    jest.requireMock('@/cedarling').useCedarling.mockImplementation(() => ({
      hasCedarReadPermission: jest.fn(() => false),
      hasCedarWritePermission: jest.fn(() => false),
      authorizeHelper: jest.fn(),
    }))

    render(
      <Wrapper>
        <CachePage />
      </Wrapper>,
    )

    expect(document.querySelector('[data-testid="MISSING"]')).toBeInTheDocument()
    expect(document.querySelector('select[name="cacheProviderType"]')).not.toBeInTheDocument()
  })

  it('renders loading state', () => {
    jest.requireMock('JansConfigApi').useGetConfigCache.mockImplementation(() => ({
      data: undefined,
      isLoading: true,
    }))

    render(
      <Wrapper>
        <CachePage />
      </Wrapper>,
    )

    expect(document.querySelector('[aria-busy="true"]')).toBeInTheDocument()
  })

  it('renders with REDIS provider config', () => {
    jest.requireMock('JansConfigApi').useGetConfigCache.mockImplementation(() => ({
      data: { cacheProviderType: 'REDIS' },
      isLoading: false,
    }))

    render(
      <Wrapper>
        <CachePage />
      </Wrapper>,
    )

    const serversInput = document.querySelector('input[name="servers"]')
    expect(serversInput).toBeInTheDocument()
    expect(serversInput).toHaveValue('localhost:6379')
  })

  it('renders with MEMCACHED provider config', () => {
    jest.requireMock('JansConfigApi').useGetConfigCache.mockImplementation(() => ({
      data: { cacheProviderType: 'MEMCACHED' },
      isLoading: false,
    }))

    render(
      <Wrapper>
        <CachePage />
      </Wrapper>,
    )

    const serversInput = document.querySelector('input[name="memCacheServers"]')
    expect(serversInput).toBeInTheDocument()
    expect(serversInput).toHaveValue('localhost:11211')
  })

  it('renders with NATIVE_PERSISTENCE provider config', () => {
    jest.requireMock('JansConfigApi').useGetConfigCache.mockImplementation(() => ({
      data: { cacheProviderType: 'NATIVE_PERSISTENCE' },
      isLoading: false,
    }))

    render(
      <Wrapper>
        <CachePage />
      </Wrapper>,
    )

    const expirationInput = document.querySelector('input[name="nativeDefaultPutExpiration"]')
    expect(expirationInput).toBeInTheDocument()
    expect(expirationInput).toHaveValue(60)

    const batchSizeInput = document.querySelector('input[name="defaultCleanupBatchSize"]')
    expect(batchSizeInput).toBeInTheDocument()
    expect(batchSizeInput).toHaveValue(25)
  })

  it('renders with empty config', () => {
    const api = jest.requireMock('JansConfigApi')
    api.useGetConfigCache.mockReturnValueOnce({ data: undefined, isLoading: false })
    api.useGetConfigCacheInMemory.mockReturnValueOnce({ data: undefined, isLoading: false })
    api.useGetConfigCacheMemcached.mockReturnValueOnce({ data: undefined, isLoading: false })
    api.useGetConfigCacheNativePersistence.mockReturnValueOnce({
      data: undefined,
      isLoading: false,
    })
    api.useGetConfigCacheRedis.mockReturnValueOnce({ data: undefined, isLoading: false })

    render(
      <Wrapper>
        <CachePage />
      </Wrapper>,
    )

    expect(document.querySelector('form')).toBeInTheDocument()
  })
})
