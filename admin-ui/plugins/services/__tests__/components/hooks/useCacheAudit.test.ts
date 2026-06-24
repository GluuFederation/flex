import { renderHook, act } from '@testing-library/react'
import type { CacheConfiguration } from 'JansConfigApi'
import type { LogAuditParams } from 'Utils/AuditLogger'
import { useCacheAudit } from 'Plugins/services/Components/hooks/useCacheAudit'

const mockLogAuditUserAction = jest.fn()
const mockLoggerError = jest.fn()

jest.mock('Utils/AuditLogger', () => ({
  logAuditUserAction: (params: LogAuditParams) => mockLogAuditUserAction(params),
}))

jest.mock('@/audit', () => ({
  useAuditContext: jest.fn(() => ({
    client_id: 'test-client-id',
    userinfo: { inum: 'inum-123', name: 'admin' },
  })),
  PATCH: 'PATCH',
}))

jest.mock('@/utils/logger', () => ({
  logger: {
    error: (message: string, detail: Error | string) => mockLoggerError(message, detail),
  },
}))

const mockCache: CacheConfiguration = {
  cacheProviderType: 'REDIS',
}

describe('useCacheAudit', () => {
  beforeEach(() => {
    mockLogAuditUserAction.mockReset()
    mockLoggerError.mockReset()
    mockLogAuditUserAction.mockResolvedValue(undefined)
  })

  it('returns logCacheUpdate function', () => {
    const { result } = renderHook(() => useCacheAudit())
    expect(typeof result.current.logCacheUpdate).toBe('function')
  })

  it('calls logAuditUserAction with the expected audit shape', async () => {
    const { result } = renderHook(() => useCacheAudit())

    await act(async () => {
      await result.current.logCacheUpdate(mockCache, 'Updated cache config', {
        servers: 'localhost:6379',
      })
    })

    expect(mockLogAuditUserAction).toHaveBeenCalledTimes(1)
    expect(mockLogAuditUserAction).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'PATCH',
        resource: 'api-cache',
        message: 'Updated cache config',
        modifiedFields: { servers: 'localhost:6379' },
        performedOn: 'REDIS',
        client_id: 'test-client-id',
        payload: mockCache,
        userinfo: { inum: 'inum-123', name: 'admin' },
      }),
    )
  })

  it('passes performedOn from cache.cacheProviderType', async () => {
    const { result } = renderHook(() => useCacheAudit())
    const inMemoryCache: CacheConfiguration = { cacheProviderType: 'IN_MEMORY' }

    await act(async () => {
      await result.current.logCacheUpdate(inMemoryCache, 'msg')
    })

    expect(mockLogAuditUserAction).toHaveBeenCalledWith(
      expect.objectContaining({ performedOn: 'IN_MEMORY' }),
    )
  })

  it('logs an error and does not throw when logAuditUserAction rejects', async () => {
    const failure = new Error('audit failed')
    mockLogAuditUserAction.mockRejectedValueOnce(failure)
    const { result } = renderHook(() => useCacheAudit())

    await act(async () => {
      await expect(result.current.logCacheUpdate(mockCache, 'msg')).resolves.toBeUndefined()
    })

    expect(mockLoggerError).toHaveBeenCalledTimes(1)
    expect(mockLoggerError).toHaveBeenCalledWith('Failed to log cache update audit:', failure)
  })
})
