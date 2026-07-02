import type { TFunction } from 'i18next'
import {
  extractActionMessage,
  isInMemoryCache,
  isMemcachedCache,
  isRedisCache,
  isNativePersistenceCache,
  buildCacheChangedFieldOperations,
} from 'Plugins/services/helper/utils'
import type { CacheFormValues } from 'Plugins/services/components/types'

// Echoes the key so operation paths are asserted without the i18n bundle.
const t = ((key: string) => key) as TFunction

const cache = (over: Partial<CacheFormValues>): CacheFormValues =>
  ({ cacheProviderType: 'IN_MEMORY', ...over }) as CacheFormValues

describe('cache provider type guards', () => {
  it('isInMemoryCache is true only for IN_MEMORY', () => {
    expect(isInMemoryCache(cache({ cacheProviderType: 'IN_MEMORY' }))).toBe(true)
    expect(isInMemoryCache(cache({ cacheProviderType: 'REDIS' }))).toBe(false)
  })

  it('isMemcachedCache is true only for MEMCACHED', () => {
    expect(isMemcachedCache(cache({ cacheProviderType: 'MEMCACHED' }))).toBe(true)
    expect(isMemcachedCache(cache({ cacheProviderType: 'IN_MEMORY' }))).toBe(false)
  })

  it('isRedisCache is true only for REDIS', () => {
    expect(isRedisCache(cache({ cacheProviderType: 'REDIS' }))).toBe(true)
    expect(isRedisCache(cache({ cacheProviderType: 'MEMCACHED' }))).toBe(false)
  })

  it('isNativePersistenceCache is true only for NATIVE_PERSISTENCE', () => {
    expect(isNativePersistenceCache(cache({ cacheProviderType: 'NATIVE_PERSISTENCE' }))).toBe(true)
    expect(isNativePersistenceCache(cache({ cacheProviderType: 'REDIS' }))).toBe(false)
  })
})

describe('buildCacheChangedFieldOperations', () => {
  it('returns no operations when nothing changed', () => {
    const values = cache({ cacheProviderType: 'REDIS', servers: 'localhost:6379' })
    expect(buildCacheChangedFieldOperations(values, { ...values }, t)).toEqual([])
  })

  it('records a single changed field within the same provider', () => {
    const initial = cache({ cacheProviderType: 'REDIS', servers: 'a:6379', maxRetryAttempts: 3 })
    const current = { ...initial, servers: 'b:6379' }
    const ops = buildCacheChangedFieldOperations(initial, current, t)
    expect(ops).toEqual([{ path: 'fields.servers', value: 'b:6379' }])
  })

  it('never emits the excluded password field for a same-provider change', () => {
    const initial = cache({ cacheProviderType: 'REDIS', password: 'old', servers: 'a' })
    const current = { ...initial, password: 'new' }
    const ops = buildCacheChangedFieldOperations(initial, current, t)
    // password is explicitly skipped in the field loop.
    expect(ops).toEqual([])
  })

  it('emits a provider-type change and all non-empty fields of the new provider', () => {
    const initial = cache({ cacheProviderType: 'IN_MEMORY', memoryDefaultPutExpiration: 60 })
    const current = cache({
      cacheProviderType: 'REDIS',
      servers: 'localhost:6379',
      maxRetryAttempts: 5,
      sentinelMasterGroupName: '',
    })
    const ops = buildCacheChangedFieldOperations(initial, current, t)
    expect(ops).toContainEqual({ path: 'fields.cache_provider_type', value: 'REDIS' })
    expect(ops).toContainEqual({ path: 'fields.servers', value: 'localhost:6379' })
    expect(ops).toContainEqual({ path: 'fields.max_retry_attempts', value: 5 })
    // Empty-string fields are skipped on a provider change.
    expect(ops).not.toContainEqual(
      expect.objectContaining({ path: 'fields.sentinel_master_group_name' }),
    )
  })

  it('treats undefined and empty-string values as equal (no spurious op)', () => {
    const initial = cache({ cacheProviderType: 'REDIS', servers: undefined })
    const current = cache({ cacheProviderType: 'REDIS', servers: '' })
    expect(buildCacheChangedFieldOperations(initial, current, t)).toEqual([])
  })

  it('falls back to an empty field list for an unknown provider', () => {
    const initial = cache({ cacheProviderType: 'IN_MEMORY' })
    const current = cache({
      cacheProviderType: 'UNKNOWN' as CacheFormValues['cacheProviderType'],
    })
    const ops = buildCacheChangedFieldOperations(initial, current, t)
    // Only the provider-type change is recorded; no fields exist for the provider.
    expect(ops).toEqual([{ path: 'fields.cache_provider_type', value: 'UNKNOWN' }])
  })
})

describe('extractActionMessage', () => {
  it('extracts action_message and returns clean data', () => {
    const data = { action_message: 'Updated cache', host: 'localhost', port: 6379 }
    const { cleanData, message } = extractActionMessage(data, 'default msg')
    expect(message).toBe('Updated cache')
    expect(cleanData).toEqual({ host: 'localhost', port: 6379 })
    expect(cleanData).not.toHaveProperty('action_message')
  })

  it('returns default message when action_message is not provided', () => {
    const data = { action_message: undefined, host: 'localhost' }
    const { cleanData, message } = extractActionMessage(data, 'default msg')
    expect(message).toBe('default msg')
    expect(cleanData).toEqual({ host: 'localhost' })
  })

  it('returns default message when action_message is empty string', () => {
    const data = { action_message: '', host: 'localhost' }
    const { cleanData, message } = extractActionMessage(data, 'fallback')
    expect(message).toBe('fallback')
    expect(cleanData).toEqual({ host: 'localhost' })
  })

  it('handles data with only action_message', () => {
    const data = { action_message: 'some action' }
    const { cleanData, message } = extractActionMessage(data, 'default')
    expect(message).toBe('some action')
    expect(cleanData).toEqual({})
  })
})
